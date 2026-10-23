import React, { useState } from 'react';
import { GraduationCap, LogOut, ChevronDown, KeyRound } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import ChangeCredentialsModal from './ChangeCredentialsModal';

export default function Header({ user, selectedDepartment, onDepartmentChange, onLogout, staffUsers = [], onUpdateCredentials }) {
  const currentDeptObj = DEPARTMENTS.find(d => d.id === selectedDepartment) || DEPARTMENTS[0];
  const [showCredModal, setShowCredModal] = useState(false);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="header-logo-badge">
            <GraduationCap size={22} />
          </div>
          <span className="header-logo-text">LASAK EDU</span>
        </div>

        {/* Header Department Switcher Dropdown */}
        <div className="dept-switcher">
          <span className="dept-switcher-label">DEPT:</span>
          <select
            className="dept-select-dropdown"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            title="Switch Active Department"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.code} — {dept.shortName}
              </option>
            ))}
          </select>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>

      <div className="header-right">
        {/* User Profile Badge */}
        <div className="user-profile-badge">
          <div
            className="user-avatar"
            style={{ backgroundColor: user.badgeColor || '#4f46e5' }}
          >
            {user.avatar}
          </div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role-badge">{user.role}</span>
          </div>
        </div>

        {/* Change Credentials / Password Action Button */}
        <button
          type="button"
          onClick={() => setShowCredModal(true)}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#4f46e5',
            padding: '0.45rem 0.85rem',
            borderRadius: '2rem',
            fontSize: '0.82rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e0e7ff';
            e.currentTarget.style.borderColor = '#c7d2fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          title="Change your email address or password"
        >
          <KeyRound size={14} />
          <span>Change Password</span>
        </button>

        {/* Logout Action Button */}
        <button className="btn-logout" onClick={onLogout} title="Log out of session">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Change Credentials Modal for Logged In User */}
      <ChangeCredentialsModal
        isOpen={showCredModal}
        onClose={() => setShowCredModal(false)}
        staffUsers={staffUsers}
        onUpdateCredentials={onUpdateCredentials}
        preselectedUserId={user.id}
      />
    </header>
  );
}
