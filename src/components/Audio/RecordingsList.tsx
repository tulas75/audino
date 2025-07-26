import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AudioRecording } from '../../types/audio';
import { ServerRecording } from '../../types/graphql';
import { MAUIService } from '../../services/maui';
import { 
  MOCK_FORM_SCHEMA, 
  MOCK_FORM_SCHEMA_NAME, 
  MOCK_FORM_SCHEMA_EXAMPLE_DATA, 
  MOCK_FORM_SCHEMA_CHOICES 
} from '../../services/mockGraphql';
import { useAuth } from '../../hooks/useAuth';
import { useFormSchema } from '../../hooks/useUserData';
import StorageService from '../../services/storage';
import AudioPlayer from './AudioPlayer';
import TranscriptionEditor from './TranscriptionEditor';

export interface RecordingsListRef {
  refreshRecordings: () => void;
}

interface RecordingsListProps {
  showMessage: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const RecordingsList = forwardRef<RecordingsListRef, RecordingsListProps>((props, ref) => {
  const [localRecordings, setLocalRecordings] = useState<AudioRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingLoading, setProcessingLoading] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  
  const storageService = StorageService.getInstance();
  const mauiService = MAUIService.getInstance();
  const { token } = useAuth();
  const { formSchema, formSchemaName, formSchemaExampleData, formSchemaChoices } = useFormSchema() || {};

  const loadLocalRecordings = async () => {
    try {
      setLoading(true);
      const allRecordings = await storageService.getAllRecordings();
      setLocalRecordings(allRecordings);
      
      // Auto-transcribe recordings that need transcription
      for (const recording of allRecordings) {
        if (recording.transcribing && !recording.transcription && !recording.transcriptionError) {
          transcribeRecording(recording);
        }
      }
    } catch (error) {
      console.error('Error loading local recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const transcribeRecording = async (recording: AudioRecording) => {
    if (!token) {
      console.error('No authentication token available for transcription');
      return;
    }

    try {
      console.log('Starting transcription for:', recording.name);
      
      const transcriptionResult = await mauiService.transcribeAudio(recording.blob, token);

      const updatedRecording = {
        ...recording,
        transcribing: false,
        transcription: transcriptionResult.text,
        transcriptionError: undefined
      };

      await storageService.updateRecording(updatedRecording);
      setLocalRecordings(prev => 
        prev.map(r => r.id === recording.id ? updatedRecording : r)
      );

      console.log('Transcription completed for:', recording.name);
    } catch (error) {
      console.error('Error transcribing recording:', error);
      
      const updatedRecording = {
        ...recording,
        transcribing: false,
        transcriptionError: error.message || 'Transcription failed'
      };

      await storageService.updateRecording(updatedRecording);
      setLocalRecordings(prev => 
        prev.map(r => r.id === recording.id ? updatedRecording : r)
      );
    }
  };

  useImperativeHandle(ref, () => ({
    refreshRecordings: loadLocalRecordings
  }));

  useEffect(() => {
    loadLocalRecordings();
  }, []);

  const [recordingToDelete, setRecordingToDelete] = useState<string | null>(null);

  const handleDeleteLocal = async (id: string) => {
    setRecordingToDelete(id);
  };

  const confirmDelete = async () => {
    if (!recordingToDelete) return;
    
    try {
      await storageService.deleteRecording(recordingToDelete);
      setLocalRecordings(prev => prev.filter(r => r.id !== recordingToDelete));
      props.showMessage('Recording deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting local recording:', error);
      props.showMessage('Failed to delete recording', 'error');
    } finally {
      setRecordingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRecordingToDelete(null);
  };


  const handleProcessWithMAUI = async (recording: AudioRecording) => {
    if (!token) {
      props.showMessage('Authentication token not available. Please log in again.', 'error');
      return;
    }

    if (!formSchema || !formSchemaName || !formSchemaExampleData || !formSchemaChoices) {
      props.showMessage('Form schema data not loaded. Please wait and try again.', 'error');
      return;
    }

    if (!recording.transcription) {
      props.showMessage('Transcription is required before processing. Please wait for transcription to complete.', 'warning');
      return;
    }

    try {
      setProcessingLoading(true);
      setProcessingStep('Compiling form data...');

      // Use mock data from mockGraphql
      const mockFormSchemaName = MOCK_FORM_SCHEMA_NAME;
      const mockFormSchema = MOCK_FORM_SCHEMA;
      const mockFormSchemaExampleData = MOCK_FORM_SCHEMA_EXAMPLE_DATA;
      const mockFormSchemaChoices = MOCK_FORM_SCHEMA_CHOICES;

      // Create JSON object with required fields
      const jsonRequest = {
        name: mockFormSchemaName,
        schema: mockFormSchema,
        exampledata: mockFormSchemaExampleData,
        choices: mockFormSchemaChoices,
        transcribedAudio: recording.transcription
      };

      const compilationResult = await mauiService.compileAudioForm(jsonRequest);

      console.log('Form compilation result:', compilationResult);

      // Always store the response and show success
      const updatedRecording = { 
        ...recording, 
        uploaded: true,
        compiledForm: compilationResult
      };
      await storageService.updateRecording(updatedRecording);
      setLocalRecordings(prev => 
        prev.map(r => r.id === recording.id ? updatedRecording : r)
      );

      // Log full response for debugging
      console.log('Form compilation result:', JSON.stringify(compilationResult, null, 2));
      
      // Show success message
      props.showMessage('Processing completed successfully!', 'success');
    } catch (error) {
      console.error('Error processing with MAUI:', error);
      props.showMessage(`Failed to process recording: ${error.message}`, 'error');
    } finally {
      setProcessingLoading(false);
      setProcessingStep('');
    }
  };

  const handleTranscriptionUpdate = async (recordingId: string, newTranscription: string) => {
    try {
      const recording = localRecordings.find(r => r.id === recordingId);
      if (!recording) return;

      const updatedRecording = {
        ...recording,
        transcription: newTranscription
      };

      await storageService.updateRecording(updatedRecording);
      setLocalRecordings(prev => 
        prev.map(r => r.id === recordingId ? updatedRecording : r)
      );
    } catch (error) {
      console.error('Error updating transcription:', error);
    }
  };

  const handleRetryTranscription = async (recording: AudioRecording) => {
    const updatedRecording = {
      ...recording,
      transcribing: true,
      transcriptionError: undefined
    };

    await storageService.updateRecording(updatedRecording);
    setLocalRecordings(prev => 
      prev.map(r => r.id === recording.id ? updatedRecording : r)
    );

    transcribeRecording(updatedRecording);
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
      <div>
        <h3>Recordings ({localRecordings.length})</h3>
        
        {localRecordings.length === 0 ? (
          <p>No recordings yet. Start recording to see them here!</p>
        ) : (
          <div>
            {localRecordings.map((recording) => (
              <div key={recording.id} className="recording-item">
                <div>
                  <h4>{recording.name}</h4>
                  <p>Duration: {formatDuration(recording.duration)}</p>
                  <p>Created: {recording.createdAt.toLocaleString()}</p>
                  <p>Status: {
                    recording.uploaded ? '✅ Processed' : 
                    recording.transcribing ? '🔄 Transcribing...' :
                    recording.transcriptionError ? '❌ Transcription failed' :
                    recording.transcription ? '📝 Transcribed' : '⏳ Not processed'
                  }</p>
                  
                  {/* Transcription Section */}
                  {recording.transcribing && (
                    <div style={{ 
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '4px',
                      border: '1px solid #2196f3'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="loading-spinner"></span>
                        <span>Transcribing audio...</span>
                      </div>
                    </div>
                  )}

                  {recording.transcriptionError && (
                    <div style={{ 
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#ffebee',
                      borderRadius: '4px',
                      border: '1px solid #f44336'
                    }}>
                      <div style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>
                        ❌ Transcription Error: {recording.transcriptionError}
                      </div>
                      <button 
                        onClick={() => handleRetryTranscription(recording)}
                        className="btn btn-sm btn-primary"
                      >
                        🔄 Retry Transcription
                      </button>
                    </div>
                  )}

                  {recording.transcription && (
                    <TranscriptionEditor
                      recordingId={recording.id}
                      transcription={recording.transcription}
                      onUpdate={handleTranscriptionUpdate}
                      disabled={recording.uploaded}
                    />
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
                      disabled={recording.uploaded || processingLoading || recording.transcribing || !recording.transcription}
                    >
                      {processingLoading ? processingStep || 'Processing...' : 
                       recording.uploaded ? 'Processed' : 
                       recording.transcribing ? 'Transcribing...' :
                       !recording.transcription ? 'Waiting for transcription' :
                       'Process with MAUI'}
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
    </div>
    
    {/* Delete Confirmation Modal */}
    {recordingToDelete && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Confirm Deletion</h3>
          <p>Are you sure you want to delete this local recording?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              onClick={cancelDelete}
              className="btn btn-secondary"
              style={{ minWidth: '100px' }}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="btn btn-danger"
              style={{ minWidth: '100px' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  );
});

RecordingsList.displayName = 'RecordingsList';

export default RecordingsList;
