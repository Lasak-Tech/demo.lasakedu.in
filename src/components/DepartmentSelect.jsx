import React from 'react';
import { Settings, Building2, Laptop, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

export default function DepartmentSelect({ user, onSelectDepartment }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Settings':
        return <Settings size={28} color="#3b82f6" />;
      case 'Building2':
        return <Building2 size={28} color="#10b981" />;
      case 'Laptop':
        return <Laptop size={28} color="#8b5cf6" />;
      default:
        return <Laptop size={28} color="#6366f1" />;
    }
  };

  return (
    <div className="dept-select-wrapper">
      <div className="dept-select-container">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', color: '#4338ca', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.825rem', fontWeight: '700', marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Authenticated as {user.name} ({user.role})
        </div>

        <div className="dept-header">
          <h2>Select Department</h2>
          <p>Choose an academic department to access admissions & placement workflows</p>
        </div>

        <div className="dept-grid">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="dept-card"
              onClick={() => onSelectDepartment(dept.id)}
            >
              <div
                className="dept-icon-circle"
                style={{ backgroundColor: `${dept.color}15` }}
              >
                {getIcon(dept.icon)}
              </div>

              <span
                className="dept-card-code"
                style={{ backgroundColor: `${dept.color}20`, color: dept.color }}
              >
                DEPARTMENT OF {dept.code}
              </span>

              <h3 className="dept-card-title">{dept.name}</h3>
              <p className="dept-card-desc">{dept.description}</p>

              <div className="dept-card-head">
                Department Chair: {dept.headName}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: dept.color, fontWeight: '700', fontSize: '0.875rem' }}>
                <span>Enter Workspace</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
