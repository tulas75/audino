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
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: 'center' }}>
          <span className="loading-spinner"></span>
          <span style={{ marginLeft: '0.5rem' }}>Loading form schema...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <strong>Error loading form schema:</strong> {error.message}
      </div>
    );
  }

  return (
    <div className="accordion">
      <button
        className="accordion-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📋 Form Schema Configuration
          <span style={{ 
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            background: 'var(--warning-500)',
            color: 'white',
            borderRadius: '9999px'
          }}>
            Mock Data
          </span>
        </span>
        <span style={{ fontSize: '1.25rem' }}>{isExpanded ? '▼' : '▶'}</span>
      </button>
      
      {isExpanded && (
        <div className="accordion-content">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <h4 style={{ 
                color: 'var(--primary-600)', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏷️ Schema Name
              </h4>
              <div style={{ 
                padding: '0.75rem 1rem',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontWeight: '500'
              }}>
                {formSchemaName}
              </div>
            </div>

            <div>
              <h4 style={{ 
                color: 'var(--primary-600)', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📝 Form Schema
              </h4>
              <pre style={{ maxHeight: '300px' }}>
                {JSON.stringify(formSchema, null, 2)}
              </pre>
            </div>

            <div>
              <h4 style={{ 
                color: 'var(--primary-600)', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💡 Example Data
              </h4>
              <pre style={{ maxHeight: '200px' }}>
                {JSON.stringify(formSchemaExampleData, null, 2)}
              </pre>
            </div>

            <div>
              <h4 style={{ 
                color: 'var(--primary-600)', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎯 Form Choices
              </h4>
              <pre style={{ maxHeight: '200px' }}>
                {JSON.stringify(formSchemaChoices, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSchemaDisplay;
