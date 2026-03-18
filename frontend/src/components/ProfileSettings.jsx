import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const ProfileSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    age: '',
    bloodGroup: 'A+',
    allergies: '',
    chronicDiseases: '',
    emergencyContacts: []
  });
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile = res.data.data;
        if (profile) {
          setFormData({
            age: profile.age || '',
            bloodGroup: profile.bloodGroup || 'A+',
            allergies: profile.allergies.join(', '),
            chronicDiseases: profile.chronicDiseases.join(', '),
            emergencyContacts: profile.emergencyContacts || []
          });
        }
      } catch (error) {
        console.log("Creating new profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addContact = () => {
    if (contactName && contactPhone) {
      setFormData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { name: contactName, relation: contactRelation, phone: contactPhone }]
      }));
      setContactName(''); setContactRelation(''); setContactPhone('');
    }
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        age: Number(formData.age),
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
        chronicDiseases: formData.chronicDiseases.split(',').map(a => a.trim()).filter(a => a),
        emergencyContacts: formData.emergencyContacts
      };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Health Profile</h1>
          <p className="text-secondary">Manage your medical details and emergency contacts.</p>
        </div>
      </header>

      {message && <div className={`badge ${message.includes('success') ? 'badge-success' : 'badge-danger'}`} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>{message}</div>}

      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange} required>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Allergies (comma separated)</label>
              <input type="text" name="allergies" className="form-input" placeholder="e.g. Peanuts, Penicillin" value={formData.allergies} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Chronic Diseases (comma separated)</label>
              <input type="text" name="chronicDiseases" className="form-input" placeholder="e.g. Asthma, Diabetes" value={formData.chronicDiseases} onChange={handleChange} />
            </div>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
          
          <h3 style={{ marginBottom: '1rem' }}>Emergency Contacts</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
             <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
               <label className="form-label">Name</label>
               <input type="text" className="form-input" value={contactName} onChange={e => setContactName(e.target.value)} />
             </div>
             <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
               <label className="form-label">Relation</label>
               <input type="text" className="form-input" value={contactRelation} onChange={e => setContactRelation(e.target.value)} />
             </div>
             <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
               <label className="form-label">Phone</label>
               <input type="text" className="form-input" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
             </div>
             <button type="button" onClick={addContact} className="btn btn-outline" style={{ height: '42px' }}>Add</button>
          </div>

          {formData.emergencyContacts.length > 0 && (
             <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
               {formData.emergencyContacts.map((contact, index) => (
                 <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                    <span><strong>{contact.name}</strong> ({contact.relation}) - {contact.phone}</span>
                    <button type="button" onClick={() => removeContact(index)} style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                 </li>
               ))}
             </ul>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
