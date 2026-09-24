/**
 * Security & Role-Based Access Control (RBAC) Utility
 * 
 * Enforces Core Access Rules:
 * 1. Each Career Advisor must ONLY access students assigned to them (assigned_advisor == current_advisor).
 * 2. Identity & session context verification prior to data disclosure.
 * 3. Access denied enforcement without revealing partial details for unauthorized records.
 * 4. Prohibition of cross-advisor leaderboards/comparisons for individual advisors.
 * 5. Elevated access for Senior Managers & Admins.
 * 6. Audit logging for unauthorized access attempts.
 */

const AUDIT_LOGS_KEY = 'lasak_audit_logs';

/**
 * Get stored audit logs from localStorage
 */
export function getAuditLogs() {
  try {
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read audit logs:', err);
    return [];
  }
}

/**
 * Log an access attempt to audit trail
 */
export function logAccessAttempt({ user, studentId, action = 'VIEW_STUDENT', granted = false, reason = '' }) {
  try {
    const logs = getAuditLogs();
    const newLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Unknown User',
      userRole: user?.role || 'Guest',
      userRoleCode: user?.roleCode || 'GUEST',
      studentId: studentId || 'N/A',
      action,
      granted,
      reason: reason || (granted ? 'Access Granted: Advisor portfolio match / Elevated Role' : 'Access Denied: Student not in advisor portfolio')
    };

    const updatedLogs = [newLog, ...logs].slice(0, 200); // Keep last 200 logs
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updatedLogs));
    return newLog;
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

/**
 * Check if current user has elevated role (Admin, Head of Admissions, Senior Manager, Senior Career Advisor)
 */
export function isElevatedRole(user) {
  if (!user) return false;
  const elevatedRoleCodes = ['HEAD_ADMISSIONS', 'SR_MANAGER', 'SR_CAREER_ADVISOR', 'ADMIN'];
  return elevatedRoleCodes.includes(user.roleCode);
}

/**
 * Check if current user is an individual Career Advisor
 */
export function isCareerAdvisor(user) {
  if (!user) return false;
  return user.roleCode === 'CAREER_ADVISOR';
}

/**
 * Core Access Verification Function
 * Checks whether current user is authorized to access a specific student/candidate record.
 */
export function canAccessStudent(student, user) {
  if (!user || !student) return false;

  // Senior Managers / Admins / SR Advisors have elevated cross-portfolio access
  if (isElevatedRole(user)) {
    return true;
  }

  // Individual Career Advisor: STRICT check matching assigned advisor ID or Name
  const isAssigned = (
    (student.assignedAdvisorId && student.assignedAdvisorId === user.id) ||
    (student.assignedAdvisorName && student.assignedAdvisorName === user.name)
  );

  if (!isAssigned) {
    // Log unauthorized access attempt for audit compliance
    logAccessAttempt({
      user,
      studentId: student.id,
      action: 'VIEW_STUDENT_PROFILE',
      granted: false,
      reason: `UNAUTHORIZED_ACCESS_ATTEMPT: Advisor ${user.name} (${user.id}) attempted to access candidate ${student.id} assigned to ${student.assignedAdvisorName || 'another advisor'}`
    });
  }

  return isAssigned;
}

/**
 * Filter students list according to advisor's RBAC scope
 */
export function filterStudentsForUser(students = [], user, departmentFilter = null) {
  if (!user) return [];

  // Elevated users see all students (optionally filtered by department)
  if (isElevatedRole(user)) {
    if (departmentFilter && departmentFilter !== 'ALL') {
      return students.filter(s => s.dept === departmentFilter);
    }
    return students;
  }

  // Individual Career Advisor sees ONLY assigned students
  return students.filter(s => {
    const isAssigned = (
      (s.assignedAdvisorId && s.assignedAdvisorId === user.id) ||
      (s.assignedAdvisorName && s.assignedAdvisorName === user.name)
    );
    const matchesDept = !departmentFilter || departmentFilter === 'ALL' || s.dept === departmentFilter;
    return isAssigned && matchesDept;
  });
}

/**
 * Polite, security-compliant Access Denied Message
 * Obfuscates all candidate details to maintain strict data segregation.
 */
export function getAccessDeniedMessage(studentId) {
  return {
    title: 'Access Denied — Restricted Candidate Record',
    message: `You do not have authorization to view candidate details for ID: ${studentId || 'Requested Record'}.`,
    subtext: 'Under institutional RBAC policies, Career Advisors may only access candidates directly assigned to their personal portfolio.',
    auditNote: 'This access attempt has been logged in the security audit trail for compliance review.'
  };
}
