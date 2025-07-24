import React, { useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile, useUserRecordings } from '../hooks/useUserData';
import AudioRecorder from './Audio/AudioRecorder';
import RecordingsList from './Audio/RecordingsList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const recordingsListRef = useRef<{ refreshRecordings: () => void }>(null);
  
  // Fetch user profile and recordings from GraphQL
  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();
  const { recordings: serverRecordings, loading: recordingsLoading, error: recordingsError, refetch: refetchRecordings } = useUserRecordings();

  const handleRecordingSaved = () => {
    // Refresh both local and server recordings when a new recording is saved
    if (recordingsListRef.current) {
      recordingsListRef.current.refreshRecordings();
    }
    refetchRecordings();
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

      {recordingsError && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px' }}>
          Error loading server recordings: {recordingsError.message}
        </div>
      )}
      
      <main>
        <AudioRecorder onRecordingSaved={handleRecordingSaved} />
        <RecordingsList 
          ref={recordingsListRef} 
          serverRecordings={serverRecordings}
          serverRecordingsLoading={recordingsLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard;
