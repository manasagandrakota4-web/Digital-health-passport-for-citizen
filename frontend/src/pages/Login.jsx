import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Globe } from 'lucide-react';
import './Login.css';

const translations = {
  en: {
    welcomeTitle: "Welcome Back",
    welcomeDesc: "Login to your Health Passport",
    identifierLabel: "Email or Phone Number",
    identifierPlaceholder: "Enter your email or phone",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginBtn: "Login",
    loggingInBtn: "Logging in...",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    loginFailed: "Login failed",
  },
  hi: {
    welcomeTitle: "वापसी पर स्वागत है",
    welcomeDesc: "अपने हेल्थ पासपोर्ट में लॉगिन करें",
    identifierLabel: "ईमेल या फोन नंबर",
    identifierPlaceholder: "अपना ईमेल या फोन दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    loginBtn: "लॉगिन करें",
    loggingInBtn: "लॉगिन हो रहा है...",
    noAccount: "क्या आपके पास खाता नहीं है?",
    signUp: "साइन अप करें",
    loginFailed: "लॉगिन विफल",
  },
  te: {
    welcomeTitle: "తిరిగి స్వాగతం",
    welcomeDesc: "మీ హెల్త్ పాస్‌పోర్ట్‌లోకి లాగిన్ అవ్వండి",
    identifierLabel: "ఈమెయిల్ లేదా ఫోన్ నంబర్",
    identifierPlaceholder: "మీ ఈమెయిల్ లేదా ఫోన్ నంబర్‌ను నమోదు చేయండి",
    passwordLabel: "పాస్‌వర్డ్",
    passwordPlaceholder: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి",
    loginBtn: "లాగిన్ చేయండి",
    loggingInBtn: "లాగిన్ అవుతోంది...",
    noAccount: "ఖాతా లేదా?",
    signUp: "సైన్ అప్ చేయండి",
    loginFailed: "లాగిన్ విఫలమైంది",
  }
};

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');

  const t = translations[lang];

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login-page">
      <div className="auth-card" style={{ position: 'relative', paddingTop: '3rem' }}>
        {/* Language Selector */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} color="var(--text-secondary, #666)" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color, #ccc)',
              backgroundColor: 'var(--bg-secondary, #fff)',
              color: 'var(--text-primary, #333)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Activity size={48} color="var(--primary-color)" />
        </div>
        <h2>{t.welcomeTitle}</h2>
        <p>{t.welcomeDesc}</p>
        
        {error && <div className="badge badge-danger" style={{ marginBottom: '1rem', width: '100%', justifyContent: 'center', padding: '0.5rem' }}>{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">{t.identifierLabel}</label>
            <input 
              type="text" 
              name="identifier" 
              className="form-input" 
              placeholder={t.identifierPlaceholder} 
              value={formData.identifier} 
              onChange={onChange} required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.passwordLabel}</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              placeholder={t.passwordPlaceholder} 
              value={formData.password} 
              onChange={onChange} required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? t.loggingInBtn : t.loginBtn}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          {t.noAccount} <Link to="/register" style={{ fontWeight: '600' }}>{t.signUp}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
