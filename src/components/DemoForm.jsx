import React, { useState } from 'react';
import { X, User, Phone, Calendar, BookOpen, AlignLeft, CheckCircle } from 'lucide-react';
import { DEPARTMENTS, COURSES } from '../data/mockData';

const STATUS_OPTIONS = ['Scheduled', 'Completed', 'Follow-up', 'Cancelled'];

export default function DemoForm({ currentUser, onSave, onClose }) {
  const [form, setForm] = useState({
    prospectName: '',
    prospectPhone: '',
    dept: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const availableCourses = COURSES.filter(c => c.dept === form.dept);

  const validate = () => {
    const e = {};vb 
    if (!form.prospectName.trim()) e.prospectName = 'Prospect name is required';
    if (!form.prospectPhone.trim()) e.prospectPhone = 'Phone number is required';
    if (!form.dept) e.dept = 'Select a department';
    if (!form.course) e.course = 'Select a course';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    if (field === 'dept') setForm(f => ({ ...f, dept: value, course: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newDemo = {
      id: `dem-${Date.now()}`,
      staffId: currentUser.id,
      staffName: currentUser.name,
      ...form 
    };
    onSave(newDemo);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>Log a New Demo</h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.1rem' }}>Record a counselling demo session</p>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Prospect Name */}
            <div>
              <label className="form-label">
                <User size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Prospect Name
              </label>
              <input
                className={`input-control ${errors.prospectName ? 'input-error' : ''}`}
                style={{ paddingLeft: '0.85rem' }}
                placeholder="Full name of prospective student"
                value={form.prospectName}
                onChange={e => handleChange('prospectName', e.target.value)}
              />
              {errors.prospectName && <span className="field-error">{errors.prospectName}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">
                <Phone size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Phone Number
              </label>
              <input
                className={`input-control ${errors.prospectPhone ? 'input-error' : ''}`}
                style={{ paddingLeft: '0.85rem' }}
                placeholder="+91 XXXXX XXXXX"
                value={form.prospectPhone}
                onChange={e => handleChange('prospectPhone', e.target.value)}
              />
              {errors.prospectPhone && <span className="field-error">{errors.prospectPhone}</span>}
            </div>

            {/* Dept + Course Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label">Department</label>
                <select
                  className={`input-control filter-select ${errors.dept ? 'input-error' : ''}`}
                  style={{ paddingLeft: '0.85rem', width: '100%' }}
                  value={form.dept}
                  onChange={e => handleChange('dept', e.target.value)}
                >
                  <option value="">Select Dept</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d.code} value={d.code}>{d.shortName}</option>
                  ))}
                </select>
                {errors.dept && <span className="field-error">{errors.dept}</span>}
              </div>
              <div>
                <label className="form-label">Course</label>
                <select
                  className={`input-control filter-select ${errors.course ? 'input-error' : ''}`}
                  style={{ paddingLeft: '0.85rem', width: '100%' }}
                  value={form.course}
                  onChange={e => handleChange('course', e.target.value)}
                  disabled={!form.dept}
                >
                  <option value="">Select Course</option>
                  {availableCourses.map(c => (
                    <option key={c.id} value={c.name}>{c.shortName}</option>
                  ))}
                </select>
                {errors.course && <span className="field-error">{errors.course}</span>}
              </div>
            </div>

            {/* Date + Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label">
                  <Calendar size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Demo Date
                </label>
                <input
                  type="date"
                  className={`input-control ${errors.date ? 'input-error' : ''}`}
                  style={{ paddingLeft: '0.85rem' }}
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                />
                {errors.date && <span className="field-error">{errors.date}</span>}
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  className="input-control filter-select"
                  style={{ paddingLeft: '0.85rem', width: '100%' }}
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="form-label">
                <AlignLeft size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Notes / Remarks
              </label>
              <textarea
                className="input-control"
                style={{ paddingLeft: '0.85rem', minHeight: '80px', resize: 'vertical' }}
                placeholder="Any follow-up actions, student feedback, or observations..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.6rem 1.5rem' }}>
              <CheckCircle size={16} />
              Save Demo Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
