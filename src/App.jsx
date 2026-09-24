import React, { useState } from 'react';
import Login from './components/Login';
import DepartmentSelect from './components/DepartmentSelect';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DemoAnalyticsDashboard from './components/DemoAnalyticsDashboard';
import HeadDashboard from './components/HeadDashboard';
import SeniorManagerDashboard from './components/SeniorManagerDashboard';
import SeniorAdvisorDashboard from './components/SeniorAdvisorDashboard';
import AdvisorDashboard from './components/AdvisorDashboard';
import DemoTracker from './components/DemoTracker';
import UserManagement from './components/UserManagement';
import CourseManagement from './components/CourseManagement';
import CourseRoadmap from './components/CourseRoadmap';
import StudentDetailModal from './components/StudentDetailModal';
import CounsellingModal from './components/CounsellingModal';
import AssignAdvisorModal from './components/AssignAdvisorModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Users, Briefcase, Building, CheckCircle } from 'lucide-react';
import {
  INITIAL_STUDENTS,
  RECRUITMENT_DRIVES,
  INITIAL_DEMOS,
  MOCK_USERS,
  DEPARTMENTS,
  COURSES
} from './data/mockData';

import EmployeeEntryDashboard from './components/EmployeeEntryDashboard';
import CareerHub from './components/CareerHub';

export default function App() {
  // Session & Nav state
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('demo-analytics');

  // Application Data (localStorage-backed)
  const [students, setStudents] = useLocalStorage('lasak_students', INITIAL_STUDENTS);
  const [demos, setDemos] = useLocalStorage('lasak_demos', INITIAL_DEMOS);
  const [staffUsers, setStaffUsers] = useLocalStorage('lasak_staff', MOCK_USERS);
  const [departments, setDepartments] = useLocalStorage('lasak_departments', DEPARTMENTS);
  const [courses, setCourses] = useLocalStorage('lasak_courses', COURSES);

  const [recruitmentDrives] = useState(RECRUITMENT_DRIVES);

  // Modals state
  const [detailModalStudent, setDetailModalStudent] = useState(null);
  const [counsellingModalStudent, setCounsellingModalStudent] = useState(null);
  const [assignModalStudent, setAssignModalStudent] = useState(null);

  // --- Auth Handlers ---
  const handleLoginSuccess = (user) => {
    const liveUser = staffUsers.find(u => u.id === user.id) || user;
    setCurrentUser(liveUser);
    setSelectedDepartment('MECH'); // Default department selection
    setActiveTab('demo-analytics');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedDepartment(null);
    setDetailModalStudent(null);
    setCounsellingModalStudent(null);
    setAssignModalStudent(null);
  };

  // --- Department Handlers ---
  const handleSelectDepartment = (deptCode) => setSelectedDepartment(deptCode);

  // --- Student Handlers ---
  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudentStatus = (studentId, newStatus, managerNote) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updatedNotes = [...(s.counsellingNotes || [])];
          if (managerNote && managerNote.trim()) {
            updatedNotes.push({
              id: `note-mgr-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              author: currentUser ? currentUser.name : 'Admissions Manager',
              text: managerNote,
              type: 'Manager Decision'
            });
          }
          return { ...s, status: newStatus, counsellingNotes: updatedNotes };
        }
        return s;
      })
    );
  };

  const handleSaveCounsellingNote = (studentId, newNoteObj, newCounsellingStatus) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            counsellingStatus: newCounsellingStatus,
            counsellingNotes: [...(s.counsellingNotes || []), newNoteObj]
          };
        }
        return s;
      })
    );
  };

  const handleAssignAdvisor = (studentId, advisorId, advisorName) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            assignedAdvisorId: advisorId,
            assignedAdvisorName: advisorName,
            counsellingStatus: s.counsellingStatus === 'None' ? 'Active' : s.counsellingStatus
          };
        }
        return s;
      })
    );
  };

  // --- Demo Handlers ---
  const handleLogDemo = (newDemo) => {
    setDemos(prev => [newDemo, ...prev]);
  };

  const handleUpdateDemoStatus = (demoId, newStatus) => {
    setDemos(prev => prev.map(d => d.id === demoId ? { ...d, status: newStatus } : d));
  };

  // --- User Management Handlers ---
  const handleAddUser = (newUser) => {
    setStaffUsers(prev => [...prev, newUser]);
  };

  const handleEditUser = (updatedUser) => {
    setStaffUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleToggleUserStatus = (userId) => {
    setStaffUsers(prev =>
      prev.map(u => u.id === userId
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
      )
    );
  };

  const handleDeleteUser = (userId) => {
    setStaffUsers(prev => prev.filter(u => u.id !== userId));
  };

  // --- Course / Dept Handlers ---
  const handleAddDept = (newDept) => {
    setDepartments(prev => [...prev, newDept]);
  };

  const handleDeleteDept = (deptCode) => {
    setDepartments(prev => prev.filter(d => d.code !== deptCode));
    setCourses(prev => prev.filter(c => c.dept !== deptCode));
  };

  const handleAddCourse = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // ===== SCREENS =====

  // SCREEN 1: Login
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // SCREEN 2: Department Selection (skip if already selected)
  if (!selectedDepartment) {
    return (
      <DepartmentSelect
        user={currentUser}
        onSelectDepartment={handleSelectDepartment}
      />
    );
  }

  // SCREEN 3: Dashboard views shared across navigation menu items
  const renderTabContent = () => {
    switch (activeTab) {
      case 'demo-analytics':
        return <DemoAnalyticsDashboard currentUser={currentUser} />;

      case 'employee':
        return <EmployeeEntryDashboard currentUser={currentUser} />;

      case 'career':
        return (
          <CareerHub
            recruitmentDrives={recruitmentDrives}
            courses={courses}
            students={students}
            currentUser={currentUser}
            onUpdateStudentStatus={handleUpdateStudentStatus}
            onAddStudent={handleAddStudent}
          />
        );

      case 'course-management':
        window.location.href = 'https://course-managemnet.vercel.app/';
        return null;

      case 'user-management':
        return (
          <UserManagement
            staffUsers={staffUsers}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onToggleStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
          />
        );

      default:
        return <DemoAnalyticsDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Header
        user={currentUser}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={handleSelectDepartment}
        onLogout={handleLogout}
      />

      <div className="app-main-layout">
        <Sidebar
          user={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="app-content">
          {renderTabContent()}
        </main>
      </div>

      {/* Global Modals */}
      {detailModalStudent && (
        <StudentDetailModal
          student={detailModalStudent}
          currentUser={currentUser}
          onClose={() => setDetailModalStudent(null)}
          onUpdateStatus={handleUpdateStudentStatus}
          canManageStatus={
            currentUser.roleCode === 'HEAD_ADMISSIONS' ||
            currentUser.roleCode === 'SR_MANAGER'
          }
        />
      )}

      {counsellingModalStudent && (
        <CounsellingModal
          student={counsellingModalStudent}
          currentUser={currentUser}
          authorName={currentUser.name}
          onClose={() => setCounsellingModalStudent(null)}
          onSaveNote={handleSaveCounsellingNote}
        />
      )}

      {assignModalStudent && (
        <AssignAdvisorModal
          student={assignModalStudent}
          staffUsers={staffUsers}
          onClose={() => setAssignModalStudent(null)}
          onAssign={handleAssignAdvisor}
        />
      )}
    </div>
  );
}
