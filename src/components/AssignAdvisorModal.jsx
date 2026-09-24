import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { CAREER_ADVISORS_LIST } from '../data/mockData';

export default function AssignAdvisorModal({ student, staffUsers, onClose, onAssign }) {
  const advisors = (staffUsers && staffUsers.length > 0)
    ? staffUsers
        .filter((u) => u.roleCode === 'CAREER_ADVISOR' || u.roleCode === 'SR_CAREER_ADVISOR')
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          activeCases: u.activeCases || 5
          
        }))
    : CAREER_ADVISORS_LIST;

  const [selectedAdvisorId, setSelectedAdvisorId] = useState(
    student?.assignedAdvisorId || (advisors[0] ? advisors[0].id : '')
  );

  if (!student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosenAdvisor = advisors.find((a) => a.id === selectedAdvisorId);
    if (chosenAdvisor) {
      onAssign(student.id, chosenAdvisor.id, chosenAdvisor.name);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Assign Career Advisor</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Student: {student.name} ({student.id})
            </span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
              Select a dedicated Career Advisor for <strong>{student.name}</strong> from the department advisor roster:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {advisors.map((adv) => (
                <div
                  key={adv.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.5rem',
                    border: selectedAdvisorId === adv.id ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    background: selectedAdvisorId === adv.id ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setSelectedAdvisorId(adv.id)}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{adv.name}</div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{adv.email} • {adv.activeCases} active students</div>
                  </div>

                  {selectedAdvisorId === adv.id && (
                    <div style={{ background: '#4f46e5', color: '#ffffff', borderRadius: '50%', padding: '0.2rem' }}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto' }}>
              <UserPlus size={16} /> Confirm Advisor Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
