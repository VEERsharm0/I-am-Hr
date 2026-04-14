import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase } from 'lucide-react';
import './Login.css'; // Reusing the same styles as Login

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('seeker');

  const [fullName, setFullName] = useState('');
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, role, fullName);
      if (role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-panel animate-fade-in">
        <div className="login-header">
          <Briefcase className="brand-icon" size={36} color="var(--primary)" />
          <h2>Create an account</h2>
          <p>Join us and start your journey</p>
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

        {error && <div className="auth-error" style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSignup} className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              required
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
            {loading ? 'Signing Up...' : `Sign Up as ${role === 'seeker' ? 'Job Seeker' : 'Employer'}`}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
