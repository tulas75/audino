import React, { useState } from 'react';
import { useFormSchema } from '../hooks/useUserData';

const FormSchemaDisplay: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    formSchema, 
    formSchemaName, 
    formSchemaExampleData, 
    formSchemaChoices, 
    loading, 
    error 
  } = useFormSchema();

  if (loading) {
    return <div>Loading form schema...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
        Error loading form schema: {error.message}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: 'none',
          borderRadius: '8px 8px 0 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        <span>📋 Form Schema Configuration (Mock Data)</span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </button>
      
      {isExpanded && (
        <div style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h4>Schema Name: {formSchemaName}</h4>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4>Form Schema:</h4>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '0.9rem',
              maxHeight: '300px'
            }}>
              {JSON.stringify(formSchema, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4>Example Data:</h4>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '0.9rem',
              maxHeight: '200px'
            }}>
              {JSON.stringify(formSchemaExampleData, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4>Form Choices:</h4>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '0.9rem',
              maxHeight: '200px'
            }}>
              {JSON.stringify(formSchemaChoices, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSchemaDisplay;
