import React, { useState, useEffect } from 'react';
import { 
  Student, 
  DailyAttendanceRecord, 
  LeaveRequest, 
  AuthSession, 
  AttendanceStatus 
} from './types';
import { 
  getStoredStudents, 
  saveStudents, 
  getStoredAttendance, 
  saveAttendance, 
  getStoredLeaves, 
  saveLeaves, 
  getStoredSession, 
  saveSession, 
  calculateOverallAttendance,
  resetToInitialDemoData,
  getTodayDateString
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { LandingDashboard } from './components/LandingDashboard';
import { StudentProfile } from './components/StudentProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentAuth } from './components/StudentAuth';
import { ChatBot } from './components/ChatBot';
import { LeaveModal } from './components/LeaveModal';
import { VivaCodeModal } from './components/VivaCodeModal';

export default function App() {
  // 1. Core Persistent State via localStorage
  const [session, setSession] = useState<AuthSession>(getStoredSession);
  const [students, setStudents] = useState<Student[]>(getStoredStudents);
  const [attendanceList, setAttendanceList] = useState<DailyAttendanceRecord[]>(getStoredAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(getStoredLeaves);

  // 2. UI Modals & Navigation state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register' | 'admin'>('login');
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [chatbotExternalQuery, setChatbotExternalQuery] = useState<string | null>(null);

  // Sync to localStorage whenever state updates
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveAttendance(attendanceList);
  }, [attendanceList]);

  useEffect(() => {
    saveLeaves(leaves);
  }, [leaves]);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  // Determine current active student
  const currentStudent = React.useMemo(() => {
    if (!session.rollNo) {
      return students.find((s) => s.rollNo === 'CSE25F145') || students[0] || null;
    }
    return students.find((s) => s.rollNo.toUpperCase() === session.rollNo?.toUpperCase()) || students[0] || null;
  }, [session.rollNo, students]);

  // Switch active role (Student <-> Admin)
  const handleSwitchRole = (newRole: 'student' | 'admin') => {
    if (newRole === 'admin') {
      setSession({
        role: 'admin',
        name: 'Faculty Admin',
        email: 'admin@prpcem.ac.in',
      });
    } else {
      const targetRoll = currentStudent?.rollNo || 'CSE25F145';
      const target = students.find((s) => s.rollNo === targetRoll) || students[0];
      setSession({
        role: 'student',
        rollNo: target.rollNo,
        name: target.name,
        email: target.email,
      });
    }
  };

  // Login handler
  const handleLoginSuccess = (newSession: AuthSession, targetStudent?: Student) => {
    setSession(newSession);
    setIsAuthModalOpen(false);
  };

  // Student registration handler
  const handleRegisterStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    // Also create initial attendance record for today
    const newRecord: DailyAttendanceRecord = {
      id: `att-${Date.now()}`,
      date: getTodayDateString(),
      rollNo: newStudent.rollNo,
      studentName: newStudent.name,
      subject: 'All Subjects',
      status: 'Present',
      markedAt: '09:00 AM',
      markedBy: 'Faculty Admin',
    };
    setAttendanceList((prev) => [newRecord, ...prev]);
  };

  // Quick evaluation logins from Landing Dashboard
  const handleQuickEnterStudent = (rollNo: string) => {
    const student = students.find((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase()) || students[0];
    setSession({
      role: 'student',
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
    });
  };

  const handleQuickEnterAdmin = () => {
    setSession({
      role: 'admin',
      name: 'Faculty Admin',
      email: 'admin@prpcem.ac.in',
    });
  };

  // Admin marks single student attendance status (Present / Absent)
  const handleToggleStatus = (
    rollNo: string, 
    newStatus: AttendanceStatus, 
    date: string, 
    subject: string = 'All Subjects'
  ) => {
    setAttendanceList((prev) => {
      const existingIndex = prev.findIndex(
        (rec) => rec.rollNo.toUpperCase() === rollNo.toUpperCase() && rec.date === date
      );

      const targetStudent = students.find((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase());
      const studentName = targetStudent?.name || 'Student';

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          status: newStatus,
          markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return copy;
      } else {
        const newRecord: DailyAttendanceRecord = {
          id: `att-${Date.now()}-${rollNo}`,
          date,
          rollNo,
          studentName,
          subject,
          status: newStatus,
          markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          markedBy: 'Faculty Admin',
        };
        return [newRecord, ...prev];
      }
    });

    // Also adjust the student's overall attendance dynamically
    setStudents((prev) =>
      prev.map((s) => {
        if (s.rollNo.toUpperCase() === rollNo.toUpperCase()) {
          const delta = newStatus === 'Present' ? 1 : -1;
          const updatedSubjects = s.subjects.map((sub, idx) => {
            if (idx === 0 || subject === sub.name) {
              const newAttended = Math.max(0, Math.min(sub.total, sub.attended + delta));
              return {
                ...sub,
                attended: newAttended,
                percentage: Math.round((newAttended / sub.total) * 100),
              };
            }
            return sub;
          });

          return {
            ...s,
            subjects: updatedSubjects,
            overallAttendance: calculateOverallAttendance(updatedSubjects),
          };
        }
        return s;
      })
    );
  };

  // Admin bulk marks attendance (e.g. Mark All Present)
  const handleBulkMark = (status: AttendanceStatus, date: string, subject: string = 'All Subjects') => {
    students.forEach((student) => {
      handleToggleStatus(student.rollNo, status, date, subject);
    });
  };

  // Student submits leave request
  const handleSubmitLeave = (newLeave: LeaveRequest) => {
    setLeaves((prev) => [newLeave, ...prev]);
  };

  // Admin approves / rejects student leave
  const handleUpdateLeaveStatus = (leaveId: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status, remarks } : l))
    );
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Reset all demo data (students, attendance, leaves) to fresh initial state?')) {
      resetToInitialDemoData();
      setStudents(getStoredStudents());
      setAttendanceList(getStoredAttendance());
      setLeaves(getStoredLeaves());
      setSession({ role: null });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        session={session}
        currentStudent={currentStudent}
        onGoHome={() => setSession({ role: null })}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={(tab) => {
          setAuthDefaultTab(tab || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        
        {/* Render:
            1. Admin Dashboard if role === 'admin'
            2. Student Profile if role === 'student'
            3. Landing Dashboard (College Overview Gateway) if role === null
        */}
        {session.role === 'admin' ? (
          <AdminDashboard
            students={students}
            attendanceList={attendanceList}
            leaves={leaves}
            onToggleStatus={handleToggleStatus}
            onBulkMark={handleBulkMark}
            onSelectStudentProfile={(student) => {
              setSession({
                role: 'student',
                rollNo: student.rollNo,
                name: student.name,
                email: student.email,
              });
            }}
            onAddNewStudent={(newStudent) => setStudents((prev) => [newStudent, ...prev])}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
          />
        ) : session.role === 'student' && currentStudent ? (
          <StudentProfile
            student={currentStudent}
            attendanceHistory={attendanceList}
            leaves={leaves}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            onAskChatbot={(q) => setChatbotExternalQuery(q)}
          />
        ) : (
          <LandingDashboard
            students={students}
            attendanceList={attendanceList}
            leaves={leaves}
            onOpenLogin={(tab) => {
              setAuthDefaultTab(tab || 'login');
              setIsAuthModalOpen(true);
            }}
            onQuickEnterStudent={handleQuickEnterStudent}
            onQuickEnterAdmin={handleQuickEnterAdmin}
            onOpenVivaGuide={() => setIsVivaModalOpen(true)}
          />
        )}

      </main>

      {/* College Practical Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Attendify · PRPCEM (P. R. Pote Patil College of Engineering and Management)</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsVivaModalOpen(true)} 
              className="text-blue-700 hover:underline font-semibold"
            >
              Practical Code Concepts Guide
            </button>
            <span>·</span>
            <span>Browser LocalStorage Active</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Query Assistant */}
      <ChatBot
        currentStudent={currentStudent}
        externalQuery={chatbotExternalQuery}
        onClearExternalQuery={() => setChatbotExternalQuery(null)}
      />

      {/* Authentication & Create Account Modal */}
      <StudentAuth
        isOpen={isAuthModalOpen}
        students={students}
        defaultTab={authDefaultTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterStudent={handleRegisterStudent}
      />

      {/* Leave Application Modal */}
      {currentStudent && (
        <LeaveModal
          isOpen={isLeaveModalOpen}
          student={currentStudent}
          onClose={() => setIsLeaveModalOpen(false)}
          onSubmitLeave={handleSubmitLeave}
        />
      )}

      {/* College Viva & Code Guide Modal */}
      <VivaCodeModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />

    </div>
  );
}
