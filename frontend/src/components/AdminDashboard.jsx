import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Shield, Trash2, Activity } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data);
      } catch (error) {
        console.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalCitizens = users.filter(u => u.role === 'Citizen').length;
  const totalDoctors = users.filter(u => u.role === 'Doctor').length;

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Hospitality Admin Panel</h1>
          <p className="text-secondary">Manage hospital users, patients, and system overview.</p>
        </div>
      </header>

      {loading ? (
        <p>Loading system data...</p>
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%' }}>
                <Users size={24} color="var(--primary-color)" />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Citizens</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{totalCitizens}</h3>
              </div>
            </div>
            
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '50%' }}>
                <Activity size={24} color="var(--secondary-color)" />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Doctors</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{totalDoctors}</h3>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%' }}>
                <Shield size={24} color="var(--error)" />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>System Status</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Secured</h3>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} className="text-primary" /> Registered Users
            </h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Registered At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>{u.name}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Doctor' ? 'badge-success' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <button className="btn btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)', padding: '0.25rem 0.5rem' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
