import React, { useState, useRef } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingSaved?: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingSaved }) => {
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
      alert('Please enter a name for the recording');
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
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Record Audio</h3>
      
      <div className="form-group">
        <label htmlFor="recordingName">Recording Name:</label>
        <input
          type="text"
          id="recordingName"
          value={recordingName}
          onChange={(e) => setRecordingName(e.target.value)}
          placeholder="Enter recording name"
          disabled={isRecording}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {formatDuration(duration)}
        </div>
      </div>

      <div className="recording-controls">
        {!isRecording ? (
          <button onClick={handleStartRecording} className="btn btn-primary">
            Start Recording
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button onClick={pauseRecording} className="btn">
                Pause
              </button>
            ) : (
              <button onClick={resumeRecording} className="btn btn-primary">
                Resume
              </button>
            )}
            <button onClick={handleStopRecording} className="btn btn-danger">
              Stop Recording
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          🔴 Recording in progress...
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
