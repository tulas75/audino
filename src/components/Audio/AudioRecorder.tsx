import React, { useState, useRef } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingSaved?: () => void;
  showMessage: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingSaved, showMessage }) => {
  const [recordingName, setRecordingName] = useState('');
  const { 
    isRecording, 
    isPaused, 
    duration, 
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording 
  } = useAudioRecorder(onRecordingSaved);

  const handleStartRecording = async () => {
    if (!recordingName.trim()) {
      showMessage('Please enter a name for the recording', 'warning');
      return;
    }
    try {
      await startRecording(recordingName);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setRecordingName(''); // Clear the input after stopping
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎙️ Audio Recorder
        </h3>
      </div>
      
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="recordingName">Recording Name</label>
          <input
            type="text"
            id="recordingName"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            placeholder="Enter a descriptive name for your recording"
            disabled={isRecording}
          />
        </div>

        {/* Duration Display */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: '700',
            fontFamily: 'monospace',
            color: isRecording ? 'var(--error-500)' : 'var(--gray-600)',
            marginBottom: '0.5rem'
          }}>
            {formatDuration(duration)}
          </div>
          {isRecording && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--error-500)',
              fontWeight: '500'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--error-500)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              {isPaused ? 'Recording Paused' : 'Recording in Progress'}
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {!isRecording ? (
            <button 
              onClick={handleStartRecording} 
              className="btn btn-primary btn-lg"
              style={{ minWidth: '150px' }}
            >
              🎙️ Start Recording
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button 
                  onClick={pauseRecording} 
                  className="btn btn-secondary"
                  style={{ minWidth: '120px' }}
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button 
                  onClick={resumeRecording} 
                  className="btn btn-primary"
                  style={{ minWidth: '120px' }}
                >
                  ▶️ Resume
                </button>
              )}
              <button 
                onClick={handleStopRecording} 
                className="btn btn-danger"
                style={{ minWidth: '120px' }}
              >
                ⏹️ Stop
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
