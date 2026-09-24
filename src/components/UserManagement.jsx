import React, { useState } from 'react';
import {
  Users, UserPlus, Edit2, Trash2, ShieldOff, ShieldCheck,
  X, Save, AlertTriangle, Check, Search, ShieldAlert
} from 'lucide-react';
import { getAuditLogs } from '../utils/security';

const ROLE_OPTIONS = [
  { value: 'SR_MANAGER', label: 'Senior Manager – Admission' },
  { value: 'SR_CAREER_ADVISOR', label: 'Senior Career Advisor' },
  { value: 'CAREER_ADVISOR', label: 'Career Advisor' }
];

const DEPT_OPTIONS = [
  { value: 'ALL', label: 'All Departments' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'MECH', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' }
];

const ROLE_BADGE = {
  HEAD_ADMISSIONS: { bg: '#e0e7ff', text: '#4338ca' },
  SR_MANAGER: { bg: '#dbeafe', text: '#1d4ed8' },
  SR_CAREER_ADVISOR: { bg: '#fef3c7', text: '#b45309' },
  CAREER_ADVISOR: { bg: '#d1fae5', text: '#047857' }
};

const EMPTY_FORM = { name: '', email: '', password: '', roleCode: 'CAREER_ADVISOR', dept: 'IT', title: '' };

export default function UserManagement({ staffUsers, onAddUser, onEditUser, onToggleStatus, onDeleteUser }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = staffUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (!editingUser && !form.password.trim()) e.password = 'Password is required';
    if (!form.roleCode) e.roleCode = 'Select a role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', roleCode: user.roleCode, dept: user.dept || 'ALL', title: user.title || '' });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const roleLabel = ROLE_OPTIONS.find(r => r.value === form.roleCode)?.label || form.roleCode;
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const COLORS = { SR_MANAGER: '#0284c7', SR_CAREER_ADVISOR: '#d97706', CAREER_ADVISOR: '#059669' };
    if (editingUser) {
      onEditUser({
        ...editingUser,
        name: form.name,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
        roleCode: form.roleCode,
        role: roleLabel,
        dept: form.dept,
        title: form.title,
        avatar: initials,
        badgeColor: COLORS[form.roleCode] || '#4f46e5'
      });
    } else {
      onAddUser({
        id: `usr-${Date.now()}`,
        name: form.name,
        email: form.email,
        password: form.password,
        roleCode: form.roleCode,
        role: roleLabel,
        dept: form.dept,
        title: form.title,
        avatar: initials,
        badgeColor: COLORS[form.roleCode] || '#4f46e5',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }
    setShowForm(false);
  };

  const fc = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>User Management</h1>
          <p>Create, edit, and manage staff accounts — Head of Admissions access only</p>
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: 0, width: 'auto', padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          onClick={openCreate}
        >
          <UserPlus size={16} /> Add Staff Member
        </button>
      </div>

      {/* Stats Row */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Staff', value: staffUsers.length, color: '#4f46e5', bg: '#e0e7ff' },
          { label: 'Active', value: staffUsers.filter(u => u.status === 'Active').length, color: '#047857', bg: '#d1fae5' },
          { label: 'Inactive', value: staffUsers.filter(u => u.status !== 'Active').length, color: '#be123c', bg: '#fee2e2' },
          { label: 'Career Advisors', value: staffUsers.filter(u => u.roleCode === 'CAREER_ADVISOR').length, color: '#d97706', bg: '#fef3c7' }
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="kpi-card">
            <div><div className="kpi-info-label">{label}</div><div className="kpi-value">{value}</div></div>
            <div className="kpi-icon-box" style={{ background: bg, color }}><Users size={20} /></div>
          </div>
        ))}
      </div>

      <div className="content-card">
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>Staff Directory</h3>
            <p>{filtered.length} staff members</p>
          </div>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input className="search-input" placeholder="Search by name, email or role..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const rb = ROLE_BADGE[user.roleCode] || { bg: '#f1f5f9', text: '#475569' };
                const isHead = user.roleCode === 'HEAD_ADMISSIONS';
                return (
                  <tr key={user.id} style={{ opacity: user.status === 'Inactive' ? 0.6 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.badgeColor || '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>
                          {user.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', background: rb.bg, color: rb.text, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{user.dept || '—'}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{user.joinedDate || '—'}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', background: user.status === 'Active' ? '#d1fae5' : '#fee2e2', color: user.status === 'Active' ? '#047857' : '#be123c', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      {!isHead && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.35rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: '600' }}
                            onClick={() => openEdit(user)}
                            title="Edit user"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            style={{ background: user.status === 'Active' ? '#fff7ed' : '#f0fdf4', border: `1px solid ${user.status === 'Active' ? '#fed7aa' : '#bbf7d0'}`, padding: '0.35rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: '600', color: user.status === 'Active' ? '#c2410c' : '#15803d' }}
                            onClick={() => onToggleStatus(user.id)}
                            title={user.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                          >
                            {user.status === 'Active' ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.35rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: '600', color: '#be123c' }}
                            onClick={() => setDeleteConfirm(user)}
                            title="Delete user"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                      {isHead && <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Protected</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security RBAC Audit Log Monitor */}
      <div className="content-card" style={{ marginTop: '2rem' }}>
        <div className="card-header-bar" style={{ background: '#f8fafc' }}>
          <div className="card-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#dc2626" />
              <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>RBAC Security Audit Trail & Access Logs</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Real-time security log recording candidate record requests, identity verifications, and access-denied events.
            </p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Requesting User</th>
                <th>Role</th>
                <th>Target Candidate ID</th>
                <th>Action</th>
                <th>Status</th>
                <th>Audit Details</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const logs = getAuditLogs();
                if (logs.length === 0) {
                  return (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                        No unauthorized access attempts or security violations recorded. Systems nominal.
                      </td>
                    </tr>
                  );
                }
                return logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{log.userName}</td>
                    <td>
                      <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                        {log.userRole}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#4f46e5' }}>{log.studentId}</td>
                    <td style={{ fontSize: '0.8rem' }}>{log.action}</td>
                    <td>
                      <span className="status-badge" style={{ background: log.granted ? '#dcfce7' : '#fee2e2', color: log.granted ? '#15803d' : '#b91c1c' }}>
                        {log.granted ? 'GRANTED' : 'DENIED'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#475569', maxWidth: '300px' }}>
                      {log.reason}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{editingUser ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{editingUser ? 'Update account details' : 'Create a new staff login account'}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[
                  { field: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Ravi Kumar' },
                  { field: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. ravi.k@lasakedu.in' },
                  { field: 'password', label: editingUser ? 'New Password (leave blank to keep)' : 'Password', type: 'password', placeholder: '••••••••' },
                  { field: 'title', label: 'Job Title', type: 'text', placeholder: 'e.g. Career Counsellor' }
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="form-label">{label}</label>
                    <input type={type} className={`input-control ${errors[field] ? 'input-error' : ''}`} style={{ paddingLeft: '0.85rem' }} placeholder={placeholder} value={form[field]} onChange={e => fc(field, e.target.value)} />
                    {errors[field] && <span className="field-error">{errors[field]}</span>}
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Role</label>
                    <select className={`input-control filter-select ${errors.roleCode ? 'input-error' : ''}`} style={{ paddingLeft: '0.85rem', width: '100%' }} value={form.roleCode} onChange={e => fc('roleCode', e.target.value)}>
                      {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {errors.roleCode && <span className="field-error">{errors.roleCode}</span>}
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <select className="input-control filter-select" style={{ paddingLeft: '0.85rem', width: '100%' }} value={form.dept} onChange={e => fc('dept', e.target.value)}>
                      {DEPT_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.6rem 1.5rem' }}>
                  <Save size={15} /> {editingUser ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={26} color="#be123c" />
              </div>
              <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>Delete {deleteConfirm.name}?</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                This will permanently remove their account and all associated data. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button
                  style={{ background: '#be123c', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => { onDeleteUser(deleteConfirm.id); setDeleteConfirm(null); }}
                >
                  <Trash2 size={15} /> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
