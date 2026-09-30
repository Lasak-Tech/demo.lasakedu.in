import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  BarChart2,
  PlusSquare,
  UserCog,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ user, activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedTab, setExpandedTab] = useState('demo-analytics');
  const isHead = user?.roleCode === 'HEAD_ADMISSIONS';

  // Navigation menu items — User Management only for Head of Admissions
  const menuItems = [
    { id: 'employee', label: 'Employee', icon: Users },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'student-placement', label: 'Student Placement', icon: GraduationCap },
    { 
      id: 'demo-analytics', 
      label: 'Demo Analytics', 
      icon: BarChart2, 
      highlight: true,
      subItems: [
        { id: 'demo-booking-funnel', label: 'Demo Booking Funnel' },
        { id: 'demo-fixed-today', label: 'Demo Fixed For Today Funnel' },
        { id: 'demo-conducted', label: 'Demo Conducted Funnel' },
        { id: 'time-slots', label: 'Time Slots' },
        { id: 'todays-funnel-report', label: "Today's Funnel Report Summary" }
      ]
    },
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
            const subIds = item.subItems ? item.subItems.map(s => s.id) : [];
            const isActive = activeTab === item.id || subIds.includes(activeTab);
            return (
              <div key={item.id} className="sidebar-item-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (item.subItems) {
                      setExpandedTab(expandedTab === item.id ? null : item.id);
                    }
                    if (item.externalUrl) {
                      window.location.href = item.externalUrl;
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  title={isCollapsed ? item.label : ''}
                  style={item.subItems && !isCollapsed && expandedTab === item.id ? { marginBottom: '0.2rem' } : {}}
                >
                  <Icon size={20} className="sidebar-item-icon" />
                  {!isCollapsed && <span className="sidebar-item-text">{item.label}</span>}

                  {item.highlight && !isActive && !isCollapsed && (
                    <span className="sidebar-new-tag">MAIN</span>
                  )}
                </button>

                {item.subItems && !isCollapsed && expandedTab === item.id && (
                  <div className="sidebar-sub-menu" style={{ 
                    paddingLeft: '3.2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.4rem',
                    marginBottom: '0.8rem',
                    borderLeft: '2px solid #e2e8f0',
                    marginLeft: '1.2rem',
                    paddingTop: '0.2rem',
                    paddingBottom: '0.2rem'
                  }}>
                    {item.subItems.map((sub, idx) => (
                      <button
                        key={idx}
                        className="sidebar-sub-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(sub.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '0.82rem',
                          fontWeight: '500',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '0.3rem 0.5rem',
                          borderRadius: '0.4rem',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.color = '#4f46e5'; 
                          e.currentTarget.style.background = '#e0e7ff'; 
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.color = '#64748b'; 
                          e.currentTarget.style.background = 'transparent'; 
                        }}
                      >
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', marginRight: '0.5rem', flexShrink: 0 }}></div>
                        <span style={{ lineHeight: '1.2' }}>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
