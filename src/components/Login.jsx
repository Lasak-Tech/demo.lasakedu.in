import React, { useState } from 'react';
import { LogIn, Lock, Mail, GraduationCap, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    const inputEmail = email.trim().toLowerCase();
    const matchedUser = MOCK_USERS.find((u) => {
      const mainMatch = u.email.toLowerCase() === inputEmail;
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
      setErrorMessage('Invalid credentials. Please select one of the demo credentials below.');
    }
  };

  const handleQuickFill = (user) => {
    setEmail(user.email);
    setPassword(user.password);
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

          <div className="demo-credentials-container">
            <div className="demo-credentials-title">👇 Quick Demo Credentials (Click to Auto-fill)</div>
            <div className="demo-roles-grid">
              {MOCK_USERS.map((user) => (
                <div
                  key={user.id}
                  className="demo-role-card"
                  onClick={() => handleQuickFill(user)}
                  title={`Click to fill ${user.role} credentials`}
                >
                  <span className="demo-role-name">{user.role}</span>
                  <span className="demo-role-email">{user.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-side">
          <div className="login-header-text">
            <h3>Sign in to account</h3>
            <p>Enter your institutional credentials to continue</p>
          </div>

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
                  placeholder="e.g. head@lasakedu.in"
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

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
            🔐 Single-Page Demo • Hardcoded Mock Session
          </div>
        </div>
      </div>
    </div>
  );
}
