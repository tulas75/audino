import React, { useState, useEffect } from 'react';

interface TranscriptionEditorProps {
  recordingId: string;
  transcription: string;
  onUpdate: (recordingId: string, newTranscription: string) => void;
  disabled?: boolean;
}

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({
  recordingId,
  transcription,
  onUpdate,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState(transcription);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedTranscription(transcription);
    setHasChanges(false);
  }, [transcription]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(recordingId, editedTranscription);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedTranscription(transcription);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTranscription(e.target.value);
    setHasChanges(e.target.value !== transcription);
  };

  return (
    <details style={{ marginTop: '0.5rem' }} open={isEditing}>
      <summary style={{ 
        cursor: 'pointer', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📝 Transcription
        {hasChanges && !disabled && (
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--warning-500)',
            color: 'white',
            borderRadius: '9999px'
          }}>
            Modified
          </span>
        )}
      </summary>
      
      <div style={{ marginTop: '0.75rem' }}>
        {isEditing ? (
          <div>
            <textarea
              value={editedTranscription}
              onChange={handleChange}
              disabled={disabled}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                backgroundColor: disabled ? 'var(--gray-50)' : 'white'
              }}
              placeholder="Edit the transcription..."
            />
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginTop: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={handleCancel}
                className="btn btn-sm btn-secondary"
                disabled={disabled}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-sm btn-primary"
                disabled={disabled || !hasChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              border: '1px solid var(--gray-200)'
            }}>
              {transcription}
            </div>
            {!disabled && (
              <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                <button 
                  onClick={handleEdit}
                  className="btn btn-sm btn-secondary"
                >
                  ✏️ Edit Transcription
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
};

export default TranscriptionEditor;
