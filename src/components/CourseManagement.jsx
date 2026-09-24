import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, X, Save, AlertTriangle, ChevronRight, Layers } from 'lucide-react';

const DEPT_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

export default function CourseManagement({ departments, courses, onAddDept, onDeleteDept, onAddCourse, onDeleteCourse }) {
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(null); // deptCode
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '', color: '#3b82f6', headName: '' });
  const [courseForm, setCourseForm] = useState({ name: '', shortName: '', duration: '', seats: 60, description: '' });
  const [deptErrors, setDeptErrors] = useState({});
  const [courseErrors, setCourseErrors] = useState({});
  const [deleteDeptConfirm, setDeleteDeptConfirm] = useState(null);
  const [deleteCourseConfirm, setDeleteCourseConfirm] = useState(null);

  const validateDept = () => {
    const e = {};
    if (!deptForm.name.trim()) e.name = 'Department name required';
    if (!deptForm.code.trim()) e.code = 'Department code required (e.g. CSE)';
    setDeptErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCourse = () => {
    const e = {};
    if (!courseForm.name.trim()) e.name = 'Course name required';
    if (!courseForm.duration.trim()) e.duration = 'Duration required';
    setCourseErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!validateDept()) return;
    onAddDept({
      id: deptForm.code.toUpperCase(),
      code: deptForm.code.toUpperCase(),
      name: deptForm.name,
      shortName: deptForm.name.split(' ').slice(0, 2).join(' '),
      icon: 'BookOpen',
      description: deptForm.description,
      color: deptForm.color,
      headName: deptForm.headName
    });
    setDeptForm({ name: '', code: '', description: '', color: '#3b82f6', headName: '' });
    setShowDeptForm(false);
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!validateCourse()) return;
    onAddCourse({
      id: `crs-${showCourseForm.toLowerCase()}-${Date.now()}`,
      dept: showCourseForm,
      name: courseForm.name,
      shortName: courseForm.shortName || courseForm.name,
      duration: courseForm.duration,
      seats: parseInt(courseForm.seats) || 60,
      description: courseForm.description,
      color: departments.find(d => d.code === showCourseForm)?.color || '#4f46e5',
      isSubCourse: courses.filter(c => c.dept === showCourseForm).length > 0
    });
    setCourseForm({ name: '', shortName: '', duration: '', seats: 60, description: '' });
    setShowCourseForm(null);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Course & Department Management</h1>
          <p>Add or remove departments and courses — Head of Admissions access only</p>
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: 0, width: 'auto', padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setShowDeptForm(true)}
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Stats Row */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.75rem' }}>
        {[
          { label: 'Departments', value: departments.length, color: '#4f46e5', bg: '#e0e7ff' },
          { label: 'Total Courses', value: courses.length, color: '#047857', bg: '#d1fae5' },
          { label: 'Total Seats', value: courses.reduce((a, c) => a + (c.seats || 0), 0), color: '#b45309', bg: '#fef3c7' }
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="kpi-card">
            <div><div className="kpi-info-label">{label}</div><div className="kpi-value">{value}</div></div>
            <div className="kpi-icon-box" style={{ background: bg, color }}><Layers size={20} /></div>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      {departments.map(dept => {
        const deptCourses = courses.filter(c => c.dept === dept.code);
        return (
          <div key={dept.code} className="content-card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header-bar" style={{ borderLeft: `4px solid ${dept.color}` }}>
              <div className="card-header-title">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: dept.color }} />
                  {dept.name}
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', color: '#64748b', letterSpacing: '0.04em' }}>{dept.code}</span>
                </h3>
                <p>{dept.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.4rem 0.85rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => setShowCourseForm(dept.code)}
                >
                  <Plus size={14} /> Add Course
                </button>
                <button
                  style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', padding: '0.4rem 0.7rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '600' }}
                  onClick={() => setDeleteDeptConfirm(dept)}
                  title="Delete department and all its courses"
                >
                  <Trash2 size={14} /> Delete Dept
                </button>
              </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {deptCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  No courses yet. Click "Add Course" to create one.
                </div>
              ) : deptCourses.map(course => (
                <div key={course.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: course.color || dept.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{course.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{course.duration} • {course.seats} seats</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.description}</span>
                    <button
                      style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: '600' }}
                      onClick={() => setDeleteCourseConfirm(course)}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Department Modal */}
      {showDeptForm && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Add New Department</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Create a new academic department</p>
              </div>
              <button className="btn-close-modal" onClick={() => setShowDeptForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDept}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Department Name</label>
                    <input className={`input-control ${deptErrors.name ? 'input-error' : ''}`} style={{ paddingLeft: '0.85rem' }} placeholder="e.g. Electronics Engineering" value={deptForm.name} onChange={e => { setDeptForm(f => ({ ...f, name: e.target.value })); setDeptErrors(er => ({ ...er, name: '' })); }} />
                    {deptErrors.name && <span className="field-error">{deptErrors.name}</span>}
                  </div>
                  <div>
                    <label className="form-label">Code</label>
                    <input className={`input-control ${deptErrors.code ? 'input-error' : ''}`} style={{ paddingLeft: '0.85rem' }} placeholder="e.g. ECE" value={deptForm.code} onChange={e => { setDeptForm(f => ({ ...f, code: e.target.value })); setDeptErrors(er => ({ ...er, code: '' })); }} />
                    {deptErrors.code && <span className="field-error">{deptErrors.code}</span>}
                  </div>
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="input-control" style={{ paddingLeft: '0.85rem', minHeight: '70px', resize: 'vertical' }} placeholder="Brief description of department focus areas" value={deptForm.description} onChange={e => setDeptForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Department Head</label>
                    <input className="input-control" style={{ paddingLeft: '0.85rem' }} placeholder="e.g. Dr. Name" value={deptForm.headName} onChange={e => setDeptForm(f => ({ ...f, headName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Accent Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {DEPT_COLORS.map(c => (
                        <button key={c} type="button" onClick={() => setDeptForm(f => ({ ...f, color: c }))} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: deptForm.color === c ? '3px solid #0f172a' : '2px solid transparent', cursor: 'pointer' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowDeptForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.6rem 1.5rem' }}>
                  <Save size={15} /> Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseForm && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Add Course to {showCourseForm}</h2>
              </div>
              <button className="btn-close-modal" onClick={() => setShowCourseForm(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label className="form-label">Course Name</label>
                  <input className={`input-control ${courseErrors.name ? 'input-error' : ''}`} style={{ paddingLeft: '0.85rem' }} placeholder="e.g. Data Science & ML" value={courseForm.name} onChange={e => { setCourseForm(f => ({ ...f, name: e.target.value })); setCourseErrors(er => ({ ...er, name: '' })); }} />
                  {courseErrors.name && <span className="field-error">{courseErrors.name}</span>}
                </div>
                <div>
                  <label className="form-label">Short Name</label>
                  <input className="input-control" style={{ paddingLeft: '0.85rem' }} placeholder="e.g. Data Science" value={courseForm.shortName} onChange={e => setCourseForm(f => ({ ...f, shortName: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Duration</label>
                    <input className={`input-control ${courseErrors.duration ? 'input-error' : ''}`} style={{ paddingLeft: '0.85rem' }} placeholder="e.g. 12 Months" value={courseForm.duration} onChange={e => { setCourseForm(f => ({ ...f, duration: e.target.value })); setCourseErrors(er => ({ ...er, duration: '' })); }} />
                    {courseErrors.duration && <span className="field-error">{courseErrors.duration}</span>}
                  </div>
                  <div>
                    <label className="form-label">Seats</label>
                    <input type="number" className="input-control" style={{ paddingLeft: '0.85rem' }} placeholder="60" value={courseForm.seats} onChange={e => setCourseForm(f => ({ ...f, seats: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="input-control" style={{ paddingLeft: '0.85rem', minHeight: '70px', resize: 'vertical' }} placeholder="Brief description of the course..." value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCourseForm(null)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.6rem 1.5rem' }}>
                  <Save size={15} /> Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dept Confirm */}
      {deleteDeptConfirm && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={26} color="#be123c" />
              </div>
              <h3 style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>Delete {deleteDeptConfirm.name}?</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                All courses under this department will also be deleted. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setDeleteDeptConfirm(null)}>Cancel</button>
                <button style={{ background: '#be123c', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' }} onClick={() => { onDeleteDept(deleteDeptConfirm.code); setDeleteDeptConfirm(null); }}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Confirm */}
      {deleteCourseConfirm && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={26} color="#be123c" />
              </div>
              <h3 style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>Remove "{deleteCourseConfirm.name}"?</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>This course will be permanently removed from the department.</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setDeleteCourseConfirm(null)}>Cancel</button>
                <button style={{ background: '#be123c', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' }} onClick={() => { onDeleteCourse(deleteCourseConfirm.id); setDeleteCourseConfirm(null); }}>
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
