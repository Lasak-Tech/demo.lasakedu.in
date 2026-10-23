import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  ArrowRight
} from 'lucide-react';

export default function ChangeCredentialsModal({
  isOpen,
  onClose,
  staffUsers = [],
  onUpdateCredentials,
  preselectedUserId = null,
  onSuccessCallback = null
}) {
  const [selectedUserId, setSelectedUserId] = useState(preselectedUserId || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Active user being modified
  const selectedUser = staffUsers.find((u) => u.id === selectedUserId) || staffUsers[0] || null;

  useEffect(() => {
    if (preselectedUserId) {
      setSelectedUserId(preselectedUserId);
    } else if (staffUsers.length > 0 && !selectedUserId) {
      setSelectedUserId(staffUsers[0].id);
    }
  }, [preselectedUserId, staffUsers]);

  // When selected user changes, pre-fill their current email
  useEffect(() => {
    if (selectedUser) {
      setNewEmail(selectedUser.email || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [selectedUserId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedUser) {
      setErrorMessage('Please select an employee account.');
      return;
    }

    if (!currentPassword) {
      setErrorMessage('Please enter your current temporary password.');
      return;
    }

    // Verify current password
    if (currentPassword !== selectedUser.password) {
      setErrorMessage('Incorrect current password. Please check your credentials and try again.');
      return;
    }

    const trimmedEmail = newEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if new email is already taken by another employee
    const duplicateEmailUser = staffUsers.find(
      (u) => u.id !== selectedUser.id && u.email?.toLowerCase() === trimmedEmail
    );
    if (duplicateEmailUser) {
      setErrorMessage(`The email "${trimmedEmail}" is already registered to another user (${duplicateEmailUser.name}).`);
      return;
    }

    if (!newPassword) {
      setErrorMessage('Please enter your new password.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    // Call update handler
    if (onUpdateCredentials) {
      onUpdateCredentials(selectedUser.id, trimmedEmail, newPassword);
    }

    setSuccessMessage(
      `Credentials successfully updated for ${selectedUser.name}! Your new login email is "${trimmedEmail}".`
    );

    if (onSuccessCallback) {
      onSuccessCallback({
        userId: selectedUser.id,
        newEmail: trimmedEmail,
        newPassword: newPassword,
        userName: selectedUser.name
      });
    }

    // Close after a short delay or allow user to see confirmation
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          border: '1px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
            color: '#ffffff',
            padding: '1.35rem 1.6rem',
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Close"
          >
            <X size={17} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.35)',
                color: '#c7d2fe',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(129, 140, 248, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <KeyRound size={13} />
              ACCOUNT CREDENTIALS
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: '0.2rem 0', color: '#ffffff' }}>
            Change Email & Password
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
            Update your temporary login credentials to your permanent email and password.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {errorMessage && (
            <div
              style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#be123c',
                borderRadius: '0.65rem',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.2rem'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                borderRadius: '0.65rem',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.2rem'
              }}
            >
              <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Account Selector (if not preselected) */}
            {!preselectedUserId ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Select Employee / Account
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="input-control"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600', background: '#f8fafc' }}
                  >
                    {staffUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: selectedUser?.badgeColor || '#4f46e5',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}
                >
                  {selectedUser?.avatar || 'US'}
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>{selectedUser?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedUser?.role} • {selectedUser?.email}</div>
                </div>
              </div>
            )}

            {/* Current Temporary Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Current Temporary Password <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={17} style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8' }} />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="input-control"
                  placeholder="Enter your current temporary password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.4rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: 'absolute', right: '0.85rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '0.2rem 0' }} />

            {/* New Email Address */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                New Permanent Email Address <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={17} style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="input-control"
                  placeholder="e.g. yourname@lasakedu.in or gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                New Password <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={17} style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8' }} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="input-control"
                  placeholder="At least 4 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.4rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '0.85rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Confirm New Password <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={17} style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-control"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.4rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.85rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1.5,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                }}
              >
                <ShieldCheck size={18} />
                <span>Save New Credentials</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
