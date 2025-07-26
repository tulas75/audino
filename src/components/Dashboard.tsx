import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserData';
import AudioRecorder from './Audio/AudioRecorder';
import RecordingsList from './Audio/RecordingsList';
import FormSchemaDisplay from './FormSchemaDisplay';
import { AuthService } from '../services/auth';

// Snackbar types
type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';
interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const recordingsListRef = useRef<{ refreshRecordings: () => void }>(null);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Fetch user profile from GraphQL
  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();

  useEffect(() => {
    const fetchTokenCount = async () => {
      if (user?.email) {
        const tokenCount = await AuthService.getInstance().getTokenCount(user.email);
        setTokenCount(tokenCount);
      }
    };

    fetchTokenCount();

    const handleTokenCountUpdate = (event: CustomEvent) => {
      setTokenCount(event.detail);
    };

    document.addEventListener('tokenCountUpdate', handleTokenCountUpdate as EventListener);
    
    return () => {
      document.removeEventListener('tokenCountUpdate', handleTokenCountUpdate as EventListener);
    };
  }, [user]);

  const handleRecordingSaved = () => {
    // Refresh local recordings when a new recording is saved
    if (recordingsListRef.current) {
      recordingsListRef.current.refreshRecordings();
    }
  };

  const handleTokenCountUpdate = async () => {
    // Refresh token count after MAUI processing
    if (user?.email) {
      const updatedTokenCount = await AuthService.getInstance().getTokenCount(user.email);
      setTokenCount(updatedTokenCount);
    }
  };

  const showSnackbar = (message: string, severity: SnackbarSeverity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
              Audio Forms Compilation
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: tokenCount > 0 ? '#ef4444' : '#6b7280',
                  color: 'white',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {tokenCount}
                </span>
              </div>
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
          <AudioRecorder onRecordingSaved={handleRecordingSaved} showMessage={showSnackbar} />
          <RecordingsList 
            ref={recordingsListRef} 
            showMessage={showSnackbar} 
            onTokenCountUpdate={handleTokenCountUpdate}
          />
        </div>
      </main>

      {/* Snackbar */}
      {snackbar.open && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: snackbar.severity === 'success' ? '#4caf50' : 
                          snackbar.severity === 'error' ? '#f44336' :
                          snackbar.severity === 'warning' ? '#ff9800' : '#2196f3',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000
        }}>
          <div>{snackbar.message}</div>
          <button 
            onClick={handleCloseSnackbar}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
