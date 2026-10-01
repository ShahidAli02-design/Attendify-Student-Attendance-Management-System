import React, { useState, useEffect } from 'react';
import { 
  Student, 
  DailyAttendanceRecord, 
  LeaveRequest, 
  AttendanceCorrectionRequest,
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
  getStoredRequestsQueue,
  saveRequestsQueue,
  getStoredSession, 
  saveSession, 
  calculateOverallAttendance,
  resetToInitialDemoData,
  getTodayDateString
} from './utils/storage';
import { Navbar, ActiveView } from './components/Navbar';
import { LandingDashboard } from './components/LandingDashboard';
import { StudentProfile } from './components/StudentProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentAuth } from './components/StudentAuth';
import { ChatBot } from './components/ChatBot';
import { LeaveModal } from './components/LeaveModal';
import { AttendanceCorrectionModal } from './components/AttendanceCorrectionModal';
import { VivaCodeModal } from './components/VivaCodeModal';

export default function App() {
  // 1. Core Persistent State via localStorage
  const [session, setSession] = useState<AuthSession>(getStoredSession);
  const [students, setStudents] = useState<Student[]>(getStoredStudents);
  const [attendanceList, setAttendanceList] = useState<DailyAttendanceRecord[]>(getStoredAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(getStoredLeaves);
  
  // Data Structure: Queue of Attendance Correction Requests
  const [requestsQueue, setRequestsQueue] = useState<AttendanceCorrectionRequest[]>(getStoredRequestsQueue);

  // 2. Active View State: Defaults to College Dashboard so landing portal is always the first screen!
  const [activeView, setActiveView] = useState<ActiveView>('college-dashboard');

  // 3. UI Modals & Navigation state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register' | 'admin'>('login');
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);
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
    saveRequestsQueue(requestsQueue);
  }, [requestsQueue]);

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

  // View Navigation Handler (College Dashboard, Admin Dashboard, Student Profile)
  const handleSelectView = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'admin-dashboard' && session.role !== 'admin') {
      setSession({
        role: 'admin',
        name: 'Faculty Admin',
        email: 'admin@prpcem.ac.in',
      });
    } else if (view === 'student-profile' && session.role !== 'student') {
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

  // Switch active role (Student <-> Admin)
  const handleSwitchRole = (newRole: 'student' | 'admin') => {
    if (newRole === 'admin') {
      setSession({
        role: 'admin',
        name: 'Faculty Admin',
        email: 'admin@prpcem.ac.in',
      });
      setActiveView('admin-dashboard');
    } else {
      const targetRoll = currentStudent?.rollNo || 'CSE25F145';
      const target = students.find((s) => s.rollNo === targetRoll) || students[0];
      setSession({
        role: 'student',
        rollNo: target.rollNo,
        name: target.name,
        email: target.email,
      });
      setActiveView('student-profile');
    }
  };

  // Login handler
  const handleLoginSuccess = (newSession: AuthSession, targetStudent?: Student) => {
    setSession(newSession);
    setIsAuthModalOpen(false);
    if (newSession.role === 'admin') {
      setActiveView('admin-dashboard');
    } else {
      setActiveView('student-profile');
    }
  };

  // Student registration handler
  const handleRegisterStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
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
    setActiveView('student-profile');
  };

  const handleQuickEnterAdmin = () => {
    setSession({
      role: 'admin',
      name: 'Faculty Admin',
      email: 'admin@prpcem.ac.in',
    });
    setActiveView('admin-dashboard');
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

  // Student submits attendance correction request -> added to REAR of queue (enqueue)
  const handleSubmitCorrectionRequest = (request: AttendanceCorrectionRequest) => {
    setRequestsQueue((prev) => [...prev, request]);
  };

  // Admin processes FRONT request in FIFO order (dequeue)
  const handleProcessNextRequest = (action: 'Approved' | 'Rejected', remarks?: string) => {
    // Find the oldest pending request (Front of Queue)
    const frontIndex = requestsQueue.findIndex((req) => req.status === 'Pending');
    if (frontIndex === -1) return;

    const frontReq = requestsQueue[frontIndex];

    // If approved, update student's attendance to Present
    if (action === 'Approved') {
      handleToggleStatus(frontReq.rollNo, frontReq.requestedStatus, frontReq.date, frontReq.subject);
    }

    // Update queue element state
    setRequestsQueue((prev) => {
      const copy = [...prev];
      copy[frontIndex] = {
        ...copy[frontIndex],
        status: action,
        remarks: remarks || (action === 'Approved' ? 'Attendance corrected to Present by Faculty Admin' : 'Dispute rejected by Faculty'),
        processedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        processedBy: 'Faculty Admin',
      };
      return copy;
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
    if (window.confirm('Reset all demo data (students, attendance, leaves, correction queue) to fresh initial state?')) {
      resetToInitialDemoData();
      setStudents(getStoredStudents());
      setAttendanceList(getStoredAttendance());
      setLeaves(getStoredLeaves());
      setRequestsQueue(getStoredRequestsQueue());
      setSession({ role: null });
      setActiveView('college-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        session={session}
        activeView={activeView}
        currentStudent={currentStudent}
        onSelectView={handleSelectView}
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
            1. Admin Dashboard if activeView === 'admin-dashboard'
            2. Student Profile if activeView === 'student-profile'
            3. Landing Dashboard (College Portal Overview) if activeView === 'college-dashboard'
        */}
        {activeView === 'admin-dashboard' ? (
          <AdminDashboard
            students={students}
            attendanceList={attendanceList}
            leaves={leaves}
            requestsQueue={requestsQueue}
            onToggleStatus={handleToggleStatus}
            onBulkMark={handleBulkMark}
            onSelectStudentProfile={(student) => {
              setSession({
                role: 'student',
                rollNo: student.rollNo,
                name: student.name,
                email: student.email,
              });
              setActiveView('student-profile');
            }}
            onAddNewStudent={(newStudent) => setStudents((prev) => [newStudent, ...prev])}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
            onProcessNextRequest={handleProcessNextRequest}
          />
        ) : activeView === 'student-profile' && currentStudent ? (
          <StudentProfile
            student={currentStudent}
            attendanceHistory={attendanceList}
            leaves={leaves}
            requestsQueue={requestsQueue}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            onOpenCorrectionModal={() => setIsCorrectionModalOpen(true)}
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
              onClick={() => handleSelectView('college-dashboard')}
              className="text-slate-600 hover:text-blue-700 font-medium"
            >
              College Portal
            </button>
            <span>·</span>
            <button 
              onClick={() => handleSelectView('admin-dashboard')}
              className="text-slate-600 hover:text-emerald-700 font-medium"
            >
              Admin Dashboard
            </button>
            <span>·</span>
            <button 
              onClick={() => setIsVivaModalOpen(true)} 
              className="text-blue-700 hover:underline font-semibold"
            >
              Practical Viva Guide
            </button>
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

      {/* Attendance Correction Modal (Data Structure: Queue enqueue) */}
      {currentStudent && (
        <AttendanceCorrectionModal
          isOpen={isCorrectionModalOpen}
          student={currentStudent}
          onClose={() => setIsCorrectionModalOpen(false)}
          onSubmitRequest={handleSubmitCorrectionRequest}
          currentQueueSize={requestsQueue.filter((r) => r.status === 'Pending').length}
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
