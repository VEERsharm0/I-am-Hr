import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('seeker');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mock') === 'recruiter') {
      setRole('recruiter');
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password, role);
      
      const userRole = data?.user?.user_metadata?.role || role;
      if (userRole === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-panel animate-fade-in">
        <div className="login-header">
          <Briefcase className="brand-icon" size={36} color="var(--primary)" />
          <h2>Welcome back</h2>
          <p>Please log in to your account</p>
        </div>

        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'seeker' ? 'active' : ''}`}
            onClick={() => setRole('seeker')}
            type="button"
          >
            Job Seeker
          </button>
          <button 
            className={`role-btn ${role === 'recruiter' ? 'active' : ''}`}
            onClick={() => setRole('recruiter')}
            type="button"
          >
            Employer
          </button>
        </div>

        {error && <div className="auth-error" style={{color: 'red', marginTop: '1rem', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              required 
              placeholder={role === 'seeker' ? "john@example.com" : "hr@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            <input 
              type="password" 
              className="input-field" 
              required 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : `Sign In as ${role === 'seeker' ? 'Job Seeker' : 'Employer'}`}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
