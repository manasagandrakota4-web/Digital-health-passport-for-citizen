import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    role: 'Citizen'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Differentiate between email and phone
    const isPhone = /^\+?[1-9]\d{1,14}$/.test(formData.identifier);
    const payload = {
        name: formData.name,
        password: formData.password,
        role: formData.role
    };
    if (isPhone) {
        payload.phone = formData.identifier;
    } else {
        payload.email = formData.identifier;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      onRegister(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '3rem 2rem' }}>
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Activity size={40} color="var(--primary-color)" />
        </div>
        <h2>Create Account</h2>
        <p>Start managing your health securely</p>
        
        {error && <div className="badge badge-danger" style={{ marginBottom: '1rem', width: '100%', justifyContent: 'center', padding: '0.5rem' }}>{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="John Doe" value={formData.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <input type="text" name="identifier" className="form-input" placeholder="john@example.com or +1234567890" value={formData.identifier} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password (min 6 chars)</label>
            <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={onChange} required minLength="6" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select name="role" className="form-select" value={formData.role} onChange={onChange}>
              <option value="Citizen">Citizen (Patient)</option>
              <option value="Doctor">Doctor / Healthcare Provider</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
