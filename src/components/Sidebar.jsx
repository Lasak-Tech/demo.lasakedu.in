import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  BarChart2,
  PlusSquare,
  UserCog,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ user, activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isHead = user?.roleCode === 'HEAD_ADMISSIONS';

  // Navigation menu items — User Management only for Head of Admissions
  const menuItems = [
    { id: 'employee', label: 'Employee', icon: Users },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'demo-analytics', label: 'Demo Analytics', icon: BarChart2, highlight: true },
    { id: 'course-management', label: 'Course Management', icon: PlusSquare, externalUrl: 'https://course-managemnet.vercel.app/' },
    ...(isHead ? [{ id: 'user-management', label: 'User Management', icon: UserCog }] : [])
  ];

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        {/* Section Header & Collapsible Toggle */}
        <div className="sidebar-header-row">
          {!isCollapsed && <span className="sidebar-section-title">Navigation Menu</span>}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.externalUrl) {
                    window.location.href = item.externalUrl;
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={20} className="sidebar-item-icon" />
                {!isCollapsed && <span className="sidebar-item-text">{item.label}</span>}

                {item.highlight && !isActive && !isCollapsed && (
                  <span className="sidebar-new-tag">MAIN</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer User Badge */}
      {!isCollapsed && (
        <div className="sidebar-footer-card">
          <div className="access-level-header">
            <ShieldCheck size={14} color={isHead ? "#4f46e5" : "#059669"} />
            <span>{isHead ? 'Admin Portal' : 'Advisor Portal'}</span>
          </div>
          <div className="access-level-role">
            {user?.name || user?.role || 'User'} ({isHead ? 'Full Reports Access' : 'My Reports Only'})
          </div>
        </div>
      )}
    </aside>
  );
}
