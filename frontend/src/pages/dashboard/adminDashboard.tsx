import  { useEffect, useState } from 'react';
import type { User } from '../../features/auth/api/requests/user.requests';
import { getAllUsersRequest, updateUserRequest, deleteUserRequest } from '../../features/auth/api/requests/user.requests';
import { getProfileRequest } from '../../features/auth/api/requests/auth.requests';
import './adminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch admin profile
        const profile = await getProfileRequest();
        setAdminProfile(profile);

        // Fetch users
        const response = await getAllUsersRequest(page, limit);
        setUsers(response.data);
        setTotal(response.total);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditFormData(user);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      await updateUserRequest(userId, editFormData);
      setUsers(users.map(u => u.id === userId ? { ...u, ...editFormData } : u));
      setEditingId(null);
      setEditFormData({});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserRequest(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
        console.error('Delete error:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          {adminProfile && <p className="welcome">Welcome, {adminProfile.email}</p>}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-card">
        <h2>All Users ({total})</h2>

        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className={editingId === user.id ? 'editing' : ''}>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, email: e.target.value })
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="text"
                          value={editFormData.firstName || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, firstName: e.target.value })
                          }
                        />
                      ) : (
                        user.firstName || '-'
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="text"
                          value={editFormData.lastName || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, lastName: e.target.value })
                          }
                        />
                      ) : (
                        user.lastName || '-'
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <select
                          value={editFormData.gender || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, gender: e.target.value })
                          }
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        user.gender || '-'
                      )}
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <>
                          <button
                            className="btn btn-save"
                            onClick={() => handleSaveEdit(user.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-cancel"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => (p < totalPages ? p + 1 : p))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
