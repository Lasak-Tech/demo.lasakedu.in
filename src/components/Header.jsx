import React from 'react';
import { GraduationCap, LogOut, ChevronDown } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

export default function Header({ user, selectedDepartment, onDepartmentChange, onLogout }) {
  const currentDeptObj = DEPARTMENTS.find(d => d.id === selectedDepartment) || DEPARTMENTS[0];

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

        {/* Logout Action Button */}
        <button className="btn-logout" onClick={onLogout} title="Log out of session">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
