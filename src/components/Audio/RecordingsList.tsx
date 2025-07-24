import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useMutation } from '@apollo/client';
import { AudioRecording } from '../../types/audio';
import { ServerRecording } from '../../types/graphql';
import { UPLOAD_AUDIO_RECORDING, DELETE_RECORDING } from '../../graphql/queries';
import StorageService from '../../services/storage';
import AudioPlayer from './AudioPlayer';

export interface RecordingsListRef {
  refreshRecordings: () => void;
}

interface RecordingsListProps {
  serverRecordings?: ServerRecording[];
  serverRecordingsLoading?: boolean;
}

const RecordingsList = forwardRef<RecordingsListRef, RecordingsListProps>(({ serverRecordings = [], serverRecordingsLoading = false }, ref) => {
  const [localRecordings, setLocalRecordings] = useState<AudioRecording[]>([]);
  const [loading, setLoading] = useState(true);
  
  const storageService = StorageService.getInstance();
  
  // GraphQL mutations
  const [uploadRecording, { loading: uploadLoading }] = useMutation(UPLOAD_AUDIO_RECORDING);
  const [deleteServerRecording] = useMutation(DELETE_RECORDING);

  const loadLocalRecordings = async () => {
    try {
      setLoading(true);
      const allRecordings = await storageService.getAllRecordings();
      setLocalRecordings(allRecordings);
    } catch (error) {
      console.error('Error loading local recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshRecordings: loadLocalRecordings
  }));

  useEffect(() => {
    loadLocalRecordings();
  }, []);

  const handleDeleteLocal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this local recording?')) {
      try {
        await storageService.deleteRecording(id);
        setLocalRecordings(prev => prev.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting local recording:', error);
      }
    }
  };

  const handleDeleteServer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this server recording?')) {
      try {
        await deleteServerRecording({ variables: { id } });
        // The parent component should refetch server recordings
        alert('Recording deleted from server successfully!');
      } catch (error) {
        console.error('Error deleting server recording:', error);
        alert('Failed to delete recording from server.');
      }
    }
  };

  const handleUpload = async (recording: AudioRecording) => {
    try {
      // Convert blob to File
      const file = new File([recording.blob], `${recording.name}.webm`, {
        type: recording.blob.type,
      });

      const { data } = await uploadRecording({
        variables: {
          input: {
            name: recording.name,
            duration: recording.duration,
            audioFile: file,
          },
        },
      });

      if (data?.uploadAudioRecording) {
        // Mark as uploaded in local storage
        const updatedRecording = { ...recording, uploaded: true };
        await storageService.updateRecording(updatedRecording);
        setLocalRecordings(prev => 
          prev.map(r => r.id === recording.id ? updatedRecording : r)
        );
        alert('Recording uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
      alert('Failed to upload recording. Please try again.');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || serverRecordingsLoading) {
    return <div>Loading recordings...</div>;
  }

  return (
    <div>
      {/* Local Recordings Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Local Recordings ({localRecordings.length})</h3>
        
        {localRecordings.length === 0 ? (
          <p>No local recordings yet. Start recording to see them here!</p>
        ) : (
          <div>
            {localRecordings.map((recording) => (
              <div key={recording.id} className="recording-item">
                <div>
                  <h4>{recording.name}</h4>
                  <p>Duration: {formatDuration(recording.duration)}</p>
                  <p>Created: {recording.createdAt.toLocaleString()}</p>
                  <p>Status: {recording.uploaded ? '✅ Uploaded' : '⏳ Not uploaded'}</p>
                </div>
                
                <div>
                  <AudioPlayer audioBlob={recording.blob} />
                  <div className="recording-controls" style={{ marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleUpload(recording)}
                      className="btn btn-primary"
                      disabled={recording.uploaded || uploadLoading}
                    >
                      {uploadLoading ? 'Uploading...' : recording.uploaded ? 'Uploaded' : 'Upload'}
                    </button>
                    <button 
                      onClick={() => handleDeleteLocal(recording.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Server Recordings Section */}
      <div>
        <h3>Server Recordings ({serverRecordings.length})</h3>
        
        {serverRecordings.length === 0 ? (
          <p>No server recordings found.</p>
        ) : (
          <div>
            {serverRecordings.map((recording) => (
              <div key={recording.id} className="recording-item">
                <div>
                  <h4>{recording.name}</h4>
                  <p>Duration: {formatDuration(recording.duration)}</p>
                  <p>Created: {new Date(recording.createdAt).toLocaleString()}</p>
                  <p>Status: ✅ On Server</p>
                  {recording.uploadedAt && (
                    <p>Uploaded: {new Date(recording.uploadedAt).toLocaleString()}</p>
                  )}
                </div>
                
                <div>
                  {recording.fileUrl && (
                    <audio controls style={{ marginBottom: '0.5rem' }}>
                      <source src={recording.fileUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <div className="recording-controls">
                    <button 
                      onClick={() => handleDeleteServer(recording.id)}
                      className="btn btn-danger"
                    >
                      Delete from Server
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

RecordingsList.displayName = 'RecordingsList';

export default RecordingsList;
