import { useState, useEffect } from 'react';
import axios from 'axios';
import { FilePlus, FileText, Upload } from 'lucide-react';

const MedicalRecords = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recordType: 'Prescription',
    patientId: '', // Needed for Doctors/Admins to upload for a patient
    newPatientName: '',
    newPatientEmail: '',
    newPatientPhone: ''
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role]);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      // For Citizen, fetches their own. For Doctor, ideally they search, but we will mock general fetch if possible, 
      // though the route /api/records only brings Citizen's own records.
      if (user.role === 'Citizen') {
        const res = await axios.get('http://localhost:5000/api/records', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setDocumentFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('recordType', formData.recordType);
      
      if (user.role === 'Citizen') {
        data.append('patientId', user._id);
      } else {
        data.append('patientId', formData.patientId);
        if (formData.newPatientName) data.append('newPatientName', formData.newPatientName);
        if (formData.newPatientEmail) data.append('newPatientEmail', formData.newPatientEmail);
        if (formData.newPatientPhone) data.append('newPatientPhone', formData.newPatientPhone);
      }

      if (documentFile) {
        data.append('document', documentFile);
      }

      await axios.post('http://localhost:5000/api/records', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Record added successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', recordType: 'Prescription', patientId: '', newPatientName: '', newPatientEmail: '', newPatientPhone: '' });
      setDocumentFile(null);
      fetchRecords(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add record');
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="text-2xl font-bold">{user.role === 'Doctor' || user.role === 'Admin' ? 'Manage Patient Records' : 'My Medical Records'}</h1>
          <p className="text-secondary">{user.role === 'Doctor' || user.role === 'Admin' ? 'Add diagnosis, reports, and prescriptions for patients.' : 'View history and upload reports.'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FilePlus size={18} /> {showForm ? 'Cancel' : 'Add New Record'}
        </button>
      </header>

      {message && <div className={`badge ${message.includes('success') ? 'badge-success' : 'badge-danger'}`} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>{message}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', border: '2px dashed var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} className="text-primary" /> Upload New Medical Record
          </h3>
          <form onSubmit={onSubmit}>
            {(user.role === 'Doctor' || user.role === 'Admin') && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Patient Aadhar / Phone / Email / ID (Required)</label>
                  <input type="text" name="patientId" className="form-input" value={formData.patientId} onChange={handleChange} required placeholder="Enter Patient Aadhar, Phone, Email, or ID" />
                </div>
                
                <div className="card" style={{ padding: '1rem', background: 'var(--bg-color)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <p className="text-secondary" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                    * If the patient is not yet registered, enter their 12-digit Aadhar or Phone number above, and their details below to automatically create their profile.
                  </p>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">New Patient Name</label>
                      <input type="text" name="newPatientName" className="form-input" value={formData.newPatientName} onChange={handleChange} placeholder="Required for new patient" />
                    </div>
                    <div className="form-group">
                       <label className="form-label">Phone Number (Optional)</label>
                       <input type="text" name="newPatientPhone" className="form-input" value={formData.newPatientPhone} onChange={handleChange} placeholder="+91..." />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                     <label className="form-label">Email Address (Optional)</label>
                     <input type="email" name="newPatientEmail" className="form-input" value={formData.newPatientEmail} onChange={handleChange} placeholder="patient@example.com" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Record Title</label>
                <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required placeholder="e.g. Monthly Blood Test" />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select name="recordType" className="form-select" value={formData.recordType} onChange={handleChange} required>
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Treatment History">Treatment History</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Description / Diagnosis</label>
              <textarea name="description" className="form-input" rows="4" value={formData.description} onChange={handleChange} required placeholder="Provide details here..."></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Attach Report Document (Optional)</label>
              <input type="file" className="form-input" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            </div>

            <button type="submit" className="btn btn-primary"><FilePlus size={18} /> Save Record</button>
          </form>
        </div>
      )}

      {user.role === 'Citizen' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <FileText size={20} className="text-primary" /> Past Records Timeline
          </h3>
          
          {loading ? <p>Loading records...</p> : records.length === 0 ? (
            <p className="text-secondary text-center py-8">No records found. Click 'Add New Record' to upload one.</p>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--border-color)' }}>
              {records.map(rec => (
                <div key={rec._id} style={{ position: 'relative', marginBottom: '2rem' }}>
                  <div style={{ position: 'absolute', left: '-2.45rem', top: '0', background: 'white', border: '2px solid var(--primary-color)', borderRadius: '50%', width: '16px', height: '16px' }}></div>
                  
                  <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{rec.title}</h4>
                      <span className="badge badge-primary">{rec.recordType}</span>
                    </div>
                    
                    <p className="text-secondary" style={{ marginBottom: '1rem', whiteSpace: 'pre-line' }}>{rec.description}</p>
                    
                    {rec.document && (
                      <div style={{ marginBottom: '1rem' }}>
                        <a 
                          href={`http://localhost:5000${rec.document}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <FileText size={16} /> View Attached Document
                        </a>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span><strong style={{ color: 'var(--text-primary)' }}>Date:</strong> {new Date(rec.date).toLocaleDateString()}</span>
                      
                      {rec.doctor && (
                         <span><strong>Doctor:</strong> Dr. {rec.doctor.name}</span>
                      )}
                      

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {(user.role === 'Doctor' || user.role === 'Admin') && !showForm && (
         <div className="card text-center" style={{ padding: '3rem 2rem' }}>
            <FilePlus size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3>Upload Patient Records</h3>
            <p className="text-secondary">Click the button above to add prescriptions or diagnosis reports for your patients.</p>
         </div>
      )}
    </div>
  );
};

export default MedicalRecords;
