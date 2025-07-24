import React from 'react';
import { useFormSchema } from '../hooks/useUserData';

const FormSchemaDisplay: React.FC = () => {
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
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Form Schema Configuration</h3>
      
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
          fontSize: '0.9rem'
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
          fontSize: '0.9rem'
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
          fontSize: '0.9rem'
        }}>
          {JSON.stringify(formSchemaChoices, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormSchemaDisplay;
