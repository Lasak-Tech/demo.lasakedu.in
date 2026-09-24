import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, XCircle, Lock } from 'lucide-react';
import { canAccessStudent, getAccessDeniedMessage } from '../utils/security';

export default function StudentDetailModal({ student, currentUser, onClose, onUpdateStatus, canManageStatus }) {
  const [internalNote, setInternalNote] = useState('');

  if (!student) return null;

  // Enforce Core Access Rule: Verify advisor portfolio authorization
  const isAuthorized = canAccessStudent(student, currentUser);

  if (!isAuthorized) {
    const deniedInfo = getAccessDeniedMessage(student.id);
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-header" style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b' }}>
              <ShieldAlert size={22} />
              <h3 style={{ margin: 0, color: '#991b1b' }}>{deniedInfo.title}</h3>
            </div>
            <button className="btn-close-modal" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ background: '#fee2e2', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#dc2626' }}>
              <Lock size={28} />
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
              Restricted Candidate Portfolio Record
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {deniedInfo.message}
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.85rem', fontSize: '0.8rem', color: '#64748b', textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Policy Enforcement & Security Notice:</div>
              <div>{deniedInfo.subtext}</div>
              <div style={{ marginTop: '0.4rem', fontStyle: 'italic', color: '#b45309' }}>
                🔒 {deniedInfo.auditNote}
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center', background: '#f8fafc' }}>
            <button className="btn-secondary" onClick={onClose} style={{ minWidth: '120px' }}>
              Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(student.id, newStatus, internalNote);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Application Profile: {student.id}</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Department of {student.dept} • Applied {student.appliedDate}
            </span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Info Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>{student.name}</h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                <span><strong>Email:</strong> {student.email}</span>
                <span><strong>Phone:</strong> {student.phone}</span>
              </div>
            </div>
            <div>
              <span className={`status-badge badge-${student.status.toLowerCase().replace(' ', '-')}`}>
                {student.status}
              </span>
            </div>
          </div>

          {/* Metric Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>ACADEMIC GPA</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>
                {student.gpa} / 4.0
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>ENTRANCE PERCENTILE</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#4f46e5', marginTop: '0.2rem' }}>
                {student.entranceScore}%
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>CAREER STATUS</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginTop: '0.2rem' }}>
                {student.placedStatus}
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div style={{ fontSize: '0.875rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div><strong>Location:</strong> {student.address}</div>
            <div><strong>Company Placement:</strong> {student.company} {student.packageAmt !== '—' && `(${student.packageAmt})`}</div>
            <div><strong>Assigned Career Advisor:</strong> {student.assignedAdvisorName}</div>
          </div>

          {/* Internal Review Note input for Senior Manager */}
          {canManageStatus && (
            <div style={{ marginTop: '1.5rem', background: '#eef2ff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #c7d2fe' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#3730a3', display: 'block', marginBottom: '0.4rem' }}>
                Internal Manager Decision Note (Optional)
              </label>
              <textarea
                style={{ width: '100%', padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #a5b4fc', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}
                rows="2"
                placeholder="Add comments on eligibility, fee waiver, or documents..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              />
            </div>
          )}

          {/* Counselling History */}
          {student.counsellingNotes && student.counsellingNotes.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
                Counselling Notes Log
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {student.counsellingNotes.map((note) => (
                  <div key={note.id} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: '3px solid #6366f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>
                      <span>{note.author} ({note.type})</span>
                      <span>{note.date}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: '0.25rem' }}>{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          
          {canManageStatus && student.status !== 'Admitted' && (
            <button className="btn-action-success" onClick={() => handleStatusChange('Admitted')}>
              <CheckCircle size={16} /> Approve Application
            </button>
          )}

          {canManageStatus && student.status !== 'Rejected' && (
            <button className="btn-action-danger" onClick={() => handleStatusChange('Rejected')}>
              <XCircle size={16} /> Reject Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

