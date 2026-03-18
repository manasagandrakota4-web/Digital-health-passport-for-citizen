import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Droplet, AlertTriangle, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const CitizenDashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.data);
      } catch (error) {
        console.error("No profile found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-secondary">Here's an overview of your health profile</p>
        </div>
        <Link to={`/emergency/${user._id}`} target="_blank" className="btn btn-outline border-error text-error">
          <AlertTriangle size={16} /> View Emergency Card
        </Link>
      </header>

      {loading ? (
        <p>Loading your medical data...</p>
      ) : profile ? (
        <div className="grid-3">
          <div className="card">
             <div className="card-title text-secondary">
               <Droplet size={20} color="var(--error)" /> Blood Group
             </div>
             <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile.bloodGroup}</div>
             <div className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Age: {profile.age}</div>
          </div>
          
          <div className="card">
             <div className="card-title text-secondary">
               <AlertTriangle size={20} color="#f59e0b" /> Allergies
             </div>
             {profile.allergies?.length > 0 ? (
               <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                 {profile.allergies.map((a, i) => <span key={i} className="badge badge-danger">{a}</span>)}
               </div>
             ) : (
               <p className="text-secondary">No known allergies</p>
             )}
          </div>

          <div className="card">
             <div className="card-title text-secondary">
               <Activity size={20} color="var(--primary-color)" /> Conditions
             </div>
             {profile.chronicDiseases?.length > 0 ? (
               <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                 {profile.chronicDiseases.map((a, i) => <span key={i} className="badge badge-primary">{a}</span>)}
               </div>
             ) : (
               <p className="text-secondary">No chronic diseases</p>
             )}
          </div>

           <div className="card" style={{ gridColumn: 'span 3' }}>
             <div className="card-title text-secondary">
               <PhoneCall size={20} color="var(--secondary-color)" /> Emergency Contacts
             </div>
             {profile.emergencyContacts?.length > 0 ? (
               <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                     <th style={{ padding: '0.5rem' }}>Name</th>
                     <th style={{ padding: '0.5rem' }}>Relation</th>
                     <th style={{ padding: '0.5rem' }}>Phone</th>
                   </tr>
                 </thead>
                 <tbody>
                   {profile.emergencyContacts.map((contact, i) => (
                     <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                       <td style={{ padding: '0.75rem 0.5rem' }}>{contact.name}</td>
                       <td style={{ padding: '0.75rem 0.5rem' }}>{contact.relation}</td>
                       <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace' }}>{contact.phone}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <p className="text-secondary">No emergency contacts added.</p>
             )}
           </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <Activity size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Health Profile Found</h3>
          <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Please set up your health profile to get started.</p>
          <Link to="/dashboard/profile" className="btn btn-primary">Setup Profile</Link>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
