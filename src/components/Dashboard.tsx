import React, { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserData';
import AudioRecorder from './Audio/AudioRecorder';
import RecordingsList from './Audio/RecordingsList';
import FormSchemaDisplay from './FormSchemaDisplay';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const recordingsListRef = useRef<{ refreshRecordings: () => void }>(null);
  
  // Fetch user profile from GraphQL
  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();

  const handleRecordingSaved = () => {
    // Refresh local recordings when a new recording is saved
    if (recordingsListRef.current) {
      recordingsListRef.current.refreshRecordings();
    }
  };

  // Display user profile data if available, fallback to auth user
  const displayUser = userProfile || user;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Header */}
      <header style={{ 
        background: 'white',
        borderBottom: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem',
          maxWidth: '1200px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎵 Audino
            </div>
            <div style={{ 
              padding: '0.25rem 0.75rem',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              AI Audio Processing
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '500', color: 'var(--gray-900)' }}>
                {displayUser?.name || displayUser?.email}
              </div>
              {profileLoading && (
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  Loading profile...
                </div>
              )}
            </div>
            <button onClick={logout} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {profileError && (
        <div className="container" style={{ paddingTop: '1rem' }}>
          <div className="alert alert-error">
            Error loading profile: {profileError.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gap: '2rem',
          gridTemplateColumns: '1fr',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <FormSchemaDisplay />
          <AudioRecorder onRecordingSaved={handleRecordingSaved} />
          <RecordingsList ref={recordingsListRef} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
