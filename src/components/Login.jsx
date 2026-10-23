import React, { useState } from 'react';
import { LogIn, Lock, Mail, GraduationCap, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';
import ChangeCredentialsModal from './ChangeCredentialsModal';

export default function Login({ onLoginSuccess, staffUsers = [], onUpdateCredentials }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotification, setSuccessNotification] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);

  // Active pool of users: live staffUsers from localStorage, fallback to MOCK_USERS
  const activeUsers = (staffUsers && staffUsers.length > 0) ? staffUsers : MOCK_USERS;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    const inputEmail = email.trim().toLowerCase();
    const matchedUser = activeUsers.find((u) => {
      const mainMatch = u.email?.toLowerCase() === inputEmail;
      const aliasMatch = (
        (u.id === 'usr-1' && inputEmail === 'head@lasakedu.in') ||
        (u.id === 'usr-2' && (inputEmail === 'srmanager@lasakedu.in' || inputEmail === 'sanjana@lasakedu.in' || inputEmail === 'sanjana@lasak.in')) ||
        (u.id === 'usr-3' && (inputEmail === 'srcareer@lasakedu.in' || inputEmail === 'lakshmanan@lasakedu.in' || inputEmail === 'laskhmanan@lasak.in'))
      );
      return (mainMatch || aliasMatch) && u.password === password;
    });

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setErrorMessage('Invalid email or password. Please check your credentials or click "Change Temporary Email or Password" below.');
    }
  };

  const handleCredentialsUpdated = ({ newEmail, newPassword, userName }) => {
    setEmail(newEmail);
    setPassword(newPassword);
    setSuccessNotification(`Credentials updated for ${userName}! You can now sign in.`);
    setErrorMessage('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-decor"></div>
      
      <div className="login-card">
        {/* Left Side: Hero Banner & Demo Role Quick Select */}
        <div className="login-hero">
          <div>
            <div className="login-brand">
              <div className="brand-icon-box">
                <GraduationCap size={24} />
              </div>
              <span className="brand-title">LASAK EDU PORTAL</span>
            </div>

            <div className="login-hero-body">
              <h2>Admissions & Career Management</h2>
              <p>
                Integrated portal for admissions officers, department heads, and career advisors to manage applications, enrollments, and placement drives.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-side">
          <div className="login-header-text">
            <h3>Sign in to account</h3>
            <p>Enter your institutional credentials to continue</p>
          </div>

          {successNotification && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                borderRadius: '0.65rem',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem'
              }}
            >
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
              <span>{successNotification}</span>
            </div>
          )}

          {errorMessage && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  className="input-control"
                  placeholder="e.g. head@lasakedu.in or your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  className="input-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <LogIn size={18} />
              <span>Sign in to Dashboard</span>
            </button>
          </form>

          {/* Change Temporary Credentials Button */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setShowChangeModal(true);
              }}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#4338ca',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: '2rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e0e7ff';
                e.currentTarget.style.color = '#3730a3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#4338ca';
              }}
            >
              <KeyRound size={15} color="#4f46e5" />
              <span>Change Temporary Email or Password</span>
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
            🔐 Institutional Portal • Lasak Educational Admissions
          </div>
        </div>
      </div>

      {/* Change Credentials Interactive Modal */}
      <ChangeCredentialsModal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        staffUsers={activeUsers}
        onUpdateCredentials={onUpdateCredentials}
        onSuccessCallback={handleCredentialsUpdated}
      />
    </div>
  );
}
