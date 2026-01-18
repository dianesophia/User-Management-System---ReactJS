import { useEffect, useState } from 'react';
import { getProfileRequest } from '../../features/auth/api/requests/auth.requests';
import type { UserProfile } from '../../features/auth/api/requests/auth.requests';
import './userDashboard.css';

function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await getProfileRequest();
        setProfile(userProfile);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="profile-card">
        <h2>My Profile</h2>
        {profile && (
          <div className="profile-info">
            <div className="info-group">
              <label>Email:</label>
              <p>{profile.email}</p>
            </div>
            {profile.firstName && (
              <div className="info-group">
                <label>First Name:</label>
                <p>{profile.firstName}</p>
              </div>
            )}
            {profile.lastName && (
              <div className="info-group">
                <label>Last Name:</label>
                <p>{profile.lastName}</p>
              </div>
            )}
            {profile.gender && (
              <div className="info-group">
                <label>Gender:</label>
                <p>{profile.gender}</p>
              </div>
            )}
            {profile.role && (
              <div className="info-group">
                <label>Role:</label>
                <p className="role-badge">{profile.role}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
