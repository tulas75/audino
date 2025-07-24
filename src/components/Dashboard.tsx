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
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Audio PWA Dashboard</h1>
        <div>
          <span>Welcome, {displayUser?.name || displayUser?.email}</span>
          {profileLoading && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>(Loading profile...)</span>}
          <button onClick={logout} className="btn btn-danger" style={{ marginLeft: '1rem' }}>
            Logout
          </button>
        </div>
      </header>

      {profileError && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px' }}>
          Error loading profile: {profileError.message}
        </div>
      )}

      
      <main>
        <FormSchemaDisplay />
        <AudioRecorder onRecordingSaved={handleRecordingSaved} />
        <RecordingsList ref={recordingsListRef} />
      </main>
    </div>
  );
};

export default Dashboard;
