import { Link } from 'react-router-dom';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <Activity size={28} color="var(--primary-color)" />
        <span>Health Passport</span>
      </Link>
      
      {user ? (
        <div className="nav-links">
          <span className="badge badge-primary">{user.role}</span>
          <span className="font-medium flex items-center gap-2">
            <User size={18} /> {user.name}
          </span>
          <button onClick={onLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
