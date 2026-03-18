import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Droplet, PhoneCall, Activity, AlertTriangle } from 'lucide-react';

const Emergency = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/user/${userId}`);
        setData(res.data.data);
      } catch (err) {
        setError('Emergency Profile Not Found or Not Setup');
      } finally {
        setLoading(false);
      }
    };
    fetchEmergencyData();
  }, [userId]);

  if (loading) return <div className="auth-container"><h2>Loading Emergency Card...</h2></div>;

  if (error || !data) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', borderColor: 'var(--error)' }}>
          <ShieldAlert size={48} color="var(--error)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="text-error">Profile Not Found</h2>
          <p className="text-secondary">{error}</p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ef4444', minHeight: '100vh', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
         <ShieldAlert size={40} />
         <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>EMERGENCY MEDICAL CARD</h1>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
         <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{data.user.name}</h2>
            <p className="text-secondary" style={{ fontSize: '1.1rem' }}>Age: {data.age || 'N/A'}</p>
         </div>

         <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div style={{ background: '#fee2e2', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
               <Droplet size={32} color="var(--error)" style={{ margin: '0 auto 0.5rem' }} />
               <div style={{ fontSize: '0.875rem', color: 'var(--error)', fontWeight: 'bold', textTransform: 'uppercase' }}>Blood Group</div>
               <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--error)' }}>{data.bloodGroup}</div>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b', fontWeight: 'bold' }}>
                 <AlertTriangle size={20} /> ALLERGIES
               </div>
               {data.allergies.length > 0 ? (
                 <ul style={{ paddingLeft: '1.5rem' }}>
                   {data.allergies.map((a, i) => <li key={i} style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{a}</li>)}
                 </ul>
               ) : <span className="text-secondary">None Listed</span>}
            </div>
         </div>

         <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
              <Activity size={20} /> CHRONIC CONDITIONS / DISEASES
            </div>
            {data.chronicDiseases.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem' }}>
                {data.chronicDiseases.map((a, i) => <li key={i} style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{a}</li>)}
              </ul>
            ) : <span className="text-secondary">None Listed</span>}
         </div>

         <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              <PhoneCall size={20} /> EMERGENCY CONTACTS
            </div>
            {data.emergencyContacts.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.emergencyContacts.map((contact, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                       <div>
                         <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                         <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{contact.relation}</div>
                       </div>
                       <a href={`tel:${contact.phone}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                          <PhoneCall size={16} /> Call
                       </a>
                    </div>
                  ))}
               </div>
            ) : <div className="text-secondary">No contacts provided.</div>}
         </div>
      </div>
      
      <div style={{ marginTop: '2rem', color: 'white', opacity: 0.8, fontSize: '0.875rem' }}>
         Smart Digital Health Passport - Authorized Access Only
      </div>
    </div>
  );
};

export default Emergency;
