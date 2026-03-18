import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CitizenDashboard from '../components/CitizenDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import AdminDashboard from '../components/AdminDashboard';
import ProfileSettings from '../components/ProfileSettings';
import MedicalRecords from '../components/MedicalRecords';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar role={user.role} />
      <div className="main-content">
        <Routes>
          {/* Default view based on role */}
          <Route path="/" element={
            user.role === 'Citizen' ? <CitizenDashboard user={user} /> :
            user.role === 'Doctor' ? <DoctorDashboard user={user} /> :
            <AdminDashboard user={user} />
          } />
          
          <Route path="profile" element={<ProfileSettings user={user} />} />
          <Route path="records" element={<MedicalRecords user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
