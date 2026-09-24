import React, { useState } from 'react';
import { X, Save, ShieldAlert, Lock } from 'lucide-react';
import { canAccessStudent, getAccessDeniedMessage } from '../utils/security';

export default function CounsellingModal({ student, currentUser, authorName, onClose, onSaveNote }) {
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState('Guidance');
  const [counsellingStatus, setCounsellingStatus] = useState(student?.counsellingStatus || 'Active');

  if (!student) return null;

  // Enforce Core Access Rule: Verify advisor portfolio authorization
  const isAuthorized = canAccessStudent(student, currentUser);

  if (!isAuthorized) {
    const deniedInfo = getAccessDeniedMessage(student.id);
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-header" style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b' }}>
              <ShieldAlert size={22} />
              <h3 style={{ margin: 0, color: '#991b1b' }}>Access Denied — Counselling Log</h3>
            </div>
            <button className="btn-close-modal" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ background: '#fee2e2', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#dc2626' }}>
              <Lock size={24} />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1rem' }}>
              {deniedInfo.message}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
              🔒 Attempt logged to security audit trail.
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNoteObj = {
      id: `n-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: authorName,
      text: noteText.trim(),
      type: noteType
    };

    onSaveNote(student.id, newNoteObj, counsellingStatus);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Counselling Entry: {student.name}</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Student ID: {student.id} • Dept: {student.dept}
            </span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Note Category
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                >
                  <option value="Guidance">General Guidance</option>
                  <option value="Resume/Prep">Resume & Interview Prep</option>
                  <option value="Followup">Follow-up Session</option>
                  <option value="Milestone">Placement Milestone</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Counselling Case Status
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={counsellingStatus}
                  onChange={(e) => setCounsellingStatus(e.target.value)}
                >
                  <option value="Active">Active Counselling</option>
                  <option value="Scheduled">Next Meeting Scheduled</option>
                  <option value="Resolved">Resolved / Placed</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Advisor Note & Recommendations
              </label>
              <textarea
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1.5px solid #cbd5e1', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
                rows="4"
                placeholder="Log counselling observations, mock interview feedback, career goals..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                required
              />
            </div>

            {/* Existing notes preview */}
            {student.counsellingNotes && student.counsellingNotes.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                  Previous Log History ({student.counsellingNotes.length})
                </span>
                <div style={{ maxHeight: '120px', overflowY: 'auto', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {student.counsellingNotes.map((n) => (
                    <div key={n.id} style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>
                      <strong style={{ color: '#4338ca' }}>{n.author}</strong> ({n.date}): {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto' }}>
              <Save size={16} /> Save Note Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
