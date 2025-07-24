import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AudioRecorder from './Audio/AudioRecorder';
import RecordingsList from './Audio/RecordingsList';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Audio PWA Dashboard</h1>
        <div>
          <span>Welcome, {user?.name || user?.email}</span>
          <button onClick={logout} className="btn btn-danger" style={{ marginLeft: '1rem' }}>
            Logout
          </button>
        </div>
      </header>
      
      <main>
        <AudioRecorder />
        <RecordingsList />
      </main>
    </div>
  );
};

export default Dashboard;
