import { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';
import axios from 'axios';

const DoctorDashboard = ({ user }) => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
     newPatientName: '',
     newPatientEmail: '',
     newPatientPhone: '',
     title: '',
     recordType: 'Prescription',
     description: ''
  });
  const [documentFile, setDocumentFile] = useState(null);

  const searchPatient = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      
      // Get patient profile & emergency card data
      const profileRes = await axios.get(`http://localhost:5000/api/profile/user/${patientId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setPatientData(profileRes.data.data);

      // Get patient records
      const recordsRes = await axios.get(`http://localhost:5000/api/records/patient/${patientId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(recordsRes.data.data);
      
    } catch (err) {
      setPatientData(null);
      setRecords([]);
      const errMsg = err.response?.data?.message || 'Patient not found or no access';
      setMessage(errMsg);
      // If patient not found, assume we might want to register via Aadhar
      if (err.response?.status === 404) {
          setShowNewPatientForm(true);
      } else {
          setShowNewPatientForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewPatientChange = (e) => {
      setNewPatientData({ ...newPatientData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
      setDocumentFile(e.target.files[0]);
  };

  const createRecord = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
          const token = localStorage.getItem('token');
          const data = new FormData();
          
          if (showNewPatientForm) {
              data.append('patientId', patientId);
              data.append('newPatientName', newPatientData.newPatientName);
              data.append('newPatientEmail', newPatientData.newPatientEmail);
              data.append('newPatientPhone', newPatientData.newPatientPhone);
          } else {
              data.append('patientId', patientData.user._id);
          }
          
          data.append('title', newPatientData.title);
          data.append('recordType', newPatientData.recordType);
          data.append('description', newPatientData.description);
          
          if (documentFile) {
              data.append('document', documentFile);
          }

          await axios.post('http://localhost:5000/api/records', data, {
              headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
              }
          });
          
          setMessage(showNewPatientForm ? 'Successfully created patient and added first record!' : 'Medical record added successfully!');
          setShowNewPatientForm(false);
          setShowAddRecordForm(false);
          setDocumentFile(null);
          setNewPatientData({ 
            newPatientName: '', newPatientEmail: '', newPatientPhone: '', 
            title: '', recordType: 'Prescription', description: '' 
          });
          
          // Refresh records
          if (!showNewPatientForm) {
              const recordsRes = await axios.get(`http://localhost:5000/api/records/patient/${patientId}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setRecords(recordsRes.data.data);
          } else {
              searchPatient(new Event('submit'));
          }
      } catch (err) {
          setMessage(err.response?.data?.message || 'Failed to add record');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="text-secondary">Welcome, Dr. {user.name}. Access and update patient records securely.</p>
        </div>
      </header>

      <div className="card search-card">
        <div className="card-title"><Search size={20} /> Lookup Patient</div>
        <form onSubmit={searchPatient} className="search-form">
           <input 
             type="text" 
             className="form-input" 
             placeholder="Enter Patient Aadhar (12 digits), Name, Email, or ID" 
             value={patientId}
             onChange={e => { setPatientId(e.target.value); setShowNewPatientForm(false); }}
           />
           <button type="submit" className="btn btn-primary" disabled={loading}>
             {loading ? 'Searching...' : 'Search'}
           </button>
        </form>
        {message && (
          <div className={`badge ${message.includes('Success') ? 'badge-success' : 'badge-danger'} mt-4 p-2 inline-block`}>
            {message}
          </div>
        )}
      </div>

      {!patientData && showNewPatientForm && (
         <div className="card new-patient-registration mt-4">
            <h3 className="mb-4">Register New Patient & Add Record</h3>
            <p className="text-secondary mb-6">
               Patient not found. You can register them now by providing their basic details and first medical record. <strong>Patient ID must be a 12-digit Aadhar number.</strong>
            </p>
            <form onSubmit={createRecord}>
               <div className="grid-2">
                  <div className="form-group">
                     <label className="form-label">Patient Full Name (Required)</label>
                     <input type="text" name="newPatientName" className="form-input" required value={newPatientData.newPatientName} onChange={handleNewPatientChange} />
                  </div>
                  <div className="form-group">
                     <label className="form-label">Phone Number (Optional)</label>
                     <input type="text" name="newPatientPhone" className="form-input" placeholder="+91..." value={newPatientData.newPatientPhone} onChange={handleNewPatientChange} />
                  </div>
                  <div className="form-group">
                     <label className="form-label">Email (Optional)</label>
                     <input type="email" name="newPatientEmail" className="form-input" value={newPatientData.newPatientEmail} onChange={handleNewPatientChange} />
                  </div>
               </div>
               
               <hr className="divider" />
               <h4 className="mb-4">Initial Record Details</h4>

               <div className="grid-2">
                  <div className="form-group">
                     <label className="form-label">Record Title (Required)</label>
                     <input type="text" name="title" className="form-input" required value={newPatientData.title} onChange={handleNewPatientChange} />
                  </div>
                  <div className="form-group">
                     <label className="form-label">Record Type (Required)</label>
                     <select name="recordType" className="form-select" required value={newPatientData.recordType} onChange={handleNewPatientChange}>
                        <option value="Prescription">Prescription</option>
                        <option value="Lab Report">Lab Report</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Treatment History">Treatment History</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>
               </div>
               <div className="form-group">
                  <label className="form-label">Description / Diagnosis (Required)</label>
                  <textarea name="description" className="form-input" rows="3" required value={newPatientData.description} onChange={handleNewPatientChange}></textarea>
               </div>

               <div className="form-group">
                  <label className="form-label">Attach Report Document (Optional)</label>
                  <input type="file" className="form-input" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
               </div>

               <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Register Patient & Add Record'}
               </button>
            </form>
         </div>
      )}

      {patientData && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Patient: {patientData.user.name}</h2>
            <button className="btn btn-primary" onClick={() => setShowAddRecordForm(!showAddRecordForm)}>
              {showAddRecordForm ? 'Cancel' : 'Add New Record for Patient'}
            </button>
          </div>

          {showAddRecordForm && (
            <div className="card mb-8 border-primary">
              <h3 className="mb-6">Add Medical Record for {patientData.user.name}</h3>
              <form onSubmit={createRecord}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Record Title</label>
                    <input type="text" name="title" className="form-input" required value={newPatientData.title} onChange={handleNewPatientChange} placeholder="e.g. Heart Rate Consultation" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Record Type</label>
                    <select name="recordType" className="form-select" required value={newPatientData.recordType} onChange={handleNewPatientChange}>
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
                  <textarea name="description" className="form-input" rows="3" required value={newPatientData.description} onChange={handleNewPatientChange} placeholder="Enter diagnosis or record details..."></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Attach Report Document (Optional)</label>
                  <input type="file" className="form-input" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Record to Patient History'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {patientData && (
        <div className="grid-2">
           <div className="card">
             <div className="card-title text-primary"><UserCheck size={20} /> Patient Health Info</div>
             <div className="patient-details">
                <p><strong>Name:</strong> {patientData.user.name}</p>
                <p><strong>Email:</strong> {patientData.user.email}</p>
                <hr className="divider" />
                <p><strong>Blood Group:</strong> <span className="badge badge-danger">{patientData.bloodGroup}</span></p>
                <p><strong>Age:</strong> {patientData.age || 'N/A'}</p>
                <div className="mt-2">
                    <strong>Allergies: </strong> 
                    {patientData.allergies.length ? 
                      <div className="flex gap-2 mt-1">
                        {patientData.allergies.map((a, i) => <span key={i} className="badge badge-danger">{a}</span>)}
                      </div> : 'None'}
                </div>
                <div className="mt-2">
                    <strong>Conditions: </strong> 
                    {patientData.chronicDiseases.length ? 
                      <div className="flex gap-2 mt-1">
                        {patientData.chronicDiseases.map((c, i) => <span key={i} className="badge badge-primary">{c}</span>)}
                      </div> : 'None'}
                </div>
             </div>
           </div>

           <div className="card">
             <div className="card-title text-primary">Recent Patient Records</div>
             {records.length > 0 ? (
                <ul className="record-list">
                  {records.map(rec => (
                     <li key={rec._id} className="record-item">
                        <div className="record-header">
                           <span className="record-title">{rec.title}</span>
                           <span className="badge badge-primary">{rec.recordType}</span>
                        </div>
                        <p className="text-secondary text-sm">{rec.description}</p>
                        
                        <div className="record-meta">
                           {rec.document && (
                              <a 
                                 href={`http://localhost:5000${rec.document}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="record-link"
                              >
                                 View Attached Report
                              </a>
                           )}
                           <div className="text-xs">
                              {new Date(rec.date).toLocaleDateString()}
                           </div>
                        </div>
                     </li>
                  ))}
                </ul>
             ) : (
                <p className="text-secondary">No previous records found for this patient.</p>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
