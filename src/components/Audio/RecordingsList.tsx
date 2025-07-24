import React, { useState, useEffect } from 'react';
import { AudioRecording } from '../../types/audio';
import StorageService from '../../services/storage';
import AudioPlayer from './AudioPlayer';

const RecordingsList = () => {
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [loading, setLoading] = useState(true);
  
  const storageService = StorageService.getInstance();

  const loadRecordings = async () => {
    try {
      const allRecordings = await storageService.getAllRecordings();
      setRecordings(allRecordings);
    } catch (error) {
      console.error('Error loading recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      try {
        await storageService.deleteRecording(id);
        setRecordings(prev => prev.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting recording:', error);
      }
    }
  };

  const handleUpload = async (recording: AudioRecording) => {
    // TODO: Implement GraphQL upload
    console.log('Uploading recording:', recording.name);
    alert('Upload functionality will be implemented next!');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div>Loading recordings...</div>;
  }

  return (
    <div>
      <h3>Saved Recordings ({recordings.length})</h3>
      
      {recordings.length === 0 ? (
        <p>No recordings yet. Start recording to see them here!</p>
      ) : (
        <div>
          {recordings.map((recording) => (
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
                    disabled={recording.uploaded}
                  >
                    {recording.uploaded ? 'Uploaded' : 'Upload'}
                  </button>
                  <button 
                    onClick={() => handleDelete(recording.id)}
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
  );
};

export default RecordingsList;
