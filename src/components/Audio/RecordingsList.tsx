import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AudioRecording } from '../../types/audio';
import { ServerRecording } from '../../types/graphql';
import { MockGraphQLService } from '../../services/mockGraphql';
import { MAUIService } from '../../services/maui';
import { useAuth } from '../../hooks/useAuth';
import { useFormSchema } from '../../hooks/useUserData';
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
  const [processingLoading, setProcessingLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  
  const storageService = StorageService.getInstance();
  const mockService = MockGraphQLService.getInstance();
  const mauiService = MAUIService.getInstance();
  const { token } = useAuth();
  const { formSchema, formSchemaName, formSchemaExampleData, formSchemaChoices } = useFormSchema();

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
        const result = await mockService.deleteRecording(id);
        if (result.success) {
          alert('Recording deleted from server successfully!');
          // Trigger parent component to refetch
          window.location.reload(); // Simple refresh for now
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error deleting server recording:', error);
        alert('Failed to delete recording from server.');
      }
    }
  };

  const handleProcessWithMAUI = async (recording: AudioRecording) => {
    if (!token) {
      alert('Authentication token not available. Please log in again.');
      return;
    }

    if (!formSchema || !formSchemaName || !formSchemaExampleData || !formSchemaChoices) {
      alert('Form schema data not loaded. Please wait and try again.');
      return;
    }

    try {
      setProcessingLoading(true);
      setProcessingStep('Transcribing audio...');

      // Step 1: Transcribe audio using MAUI
      const transcriptionResult = import.meta.env.DEV 
        ? await mauiService.mockTranscribeAudio(recording.blob)
        : await mauiService.transcribeAudio(recording.blob, token);

      console.log('Transcription result:', transcriptionResult);

      setProcessingStep('Compiling form data...');

      // Step 2: Send form compilation request to MAUI
      const compilationRequest = {
        formSchema,
        formSchemaName,
        formSchemaExampleData,
        formSchemaChoices,
        transcribedAudio: transcriptionResult.transcription
      };

      const compilationResult = import.meta.env.DEV
        ? await mauiService.mockCompileAudioForm(compilationRequest)
        : await mauiService.compileAudioForm(compilationRequest, token);

      console.log('Form compilation result:', compilationResult);

      if (compilationResult.success) {
        // Mark as processed in local storage
        const updatedRecording = { 
          ...recording, 
          uploaded: true,
          transcription: transcriptionResult.transcription,
          compiledForm: compilationResult.compiledForm
        };
        await storageService.updateRecording(updatedRecording);
        setLocalRecordings(prev => 
          prev.map(r => r.id === recording.id ? updatedRecording : r)
        );

        // Show results
        alert(`Processing completed successfully!\n\nTranscription: ${transcriptionResult.transcription.substring(0, 100)}...\n\nGenerated Title: ${compilationResult.compiledForm.title}`);
      } else {
        throw new Error('Form compilation failed');
      }
    } catch (error) {
      console.error('Error processing with MAUI:', error);
      alert(`Failed to process recording: ${error.message}`);
    } finally {
      setProcessingLoading(false);
      setProcessingStep('');
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
      {processingLoading && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>🔄 Processing with MAUI...</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>{processingStep}</div>
        </div>
      )}
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
                  <p>Status: {recording.uploaded ? '✅ Processed' : '⏳ Not processed'}</p>
                  {recording.transcription && (
                    <details style={{ marginTop: '0.5rem' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        📝 Transcription
                      </summary>
                      <p style={{ 
                        marginTop: '0.5rem', 
                        padding: '0.5rem', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}>
                        {recording.transcription}
                      </p>
                    </details>
                  )}
                  {recording.compiledForm && (
                    <details style={{ marginTop: '0.5rem' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        📋 Compiled Form Data
                      </summary>
                      <pre style={{ 
                        marginTop: '0.5rem', 
                        padding: '0.5rem', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        overflow: 'auto',
                        maxHeight: '200px'
                      }}>
                        {JSON.stringify(recording.compiledForm, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                
                <div>
                  <AudioPlayer audioBlob={recording.blob} />
                  <div className="recording-controls" style={{ marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleProcessWithMAUI(recording)}
                      className="btn btn-primary"
                      disabled={recording.uploaded || processingLoading}
                    >
                      {processingLoading ? processingStep || 'Processing...' : recording.uploaded ? 'Processed' : 'Process with MAUI'}
                    </button>
                    <button 
                      onClick={() => handleDeleteLocal(recording.id)}
                      className="btn btn-danger"
                      disabled={processingLoading}
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
