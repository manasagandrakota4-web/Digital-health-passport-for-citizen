import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCircle, FileText, Users, HeartPulse } from 'lucide-react';

const Sidebar = ({ role }) => {
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '1rem', padding: '0 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
        Menu
      </div>
      
      <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        {role === 'Admin' ? 'Hospitality Panel' : 'Overview'}
      </NavLink>

      {role === 'Citizen' && (
        <>
          <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCircle size={20} />
            My Profile
          </NavLink>
          <NavLink to="/dashboard/records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            Medical Records
          </NavLink>
        </>
      )}

      {role === 'Doctor' && (
        <>
          <NavLink to="/dashboard/records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            Patient Records
          </NavLink>
        </>
      )}

      {role === 'Admin' && (
        <>
          <NavLink to="/dashboard/records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            Patient Records
          </NavLink>
        </>
      )}
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
         <div className="sidebar-link" style={{ justifyContent: 'center', background: 'var(--bg-color)', cursor: 'default' }}>
            <HeartPulse size={20} color="var(--error)" /> Stay Healthy
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
