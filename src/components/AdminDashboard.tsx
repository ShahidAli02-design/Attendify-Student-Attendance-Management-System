import React, { useState, useMemo } from 'react';
import { Student, DailyAttendanceRecord, LeaveRequest, AttendanceCorrectionRequest, AttendanceStatus } from '../types';
import { getTodayDateString, getAttendanceStats } from '../utils/storage';
import { Queue } from '../utils/Queue';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Search, 
  Download, 
  Plus, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  attendanceList: DailyAttendanceRecord[];
  leaves: LeaveRequest[];
  requestsQueue: AttendanceCorrectionRequest[];
  onToggleStatus: (rollNo: string, newStatus: AttendanceStatus, date: string, subject?: string) => void;
  onBulkMark: (status: AttendanceStatus, date: string, subject?: string) => void;
  onSelectStudentProfile: (student: Student) => void;
  onAddNewStudent: (newStudent: Student) => void;
  onUpdateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
  onProcessNextRequest: (action: 'Approved' | 'Rejected', remarks?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  attendanceList,
  leaves,
  requestsQueue,
  onToggleStatus,
  onBulkMark,
  onSelectStudentProfile,
  onAddNewStudent,
  onUpdateLeaveStatus,
  onProcessNextRequest,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent' | 'LowAttendance'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  
  // Modals inside Admin
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'attendance' | 'queue' | 'leaves'>('attendance');

  // New Student form state
  const [newName, setNewName] = useState('');
  const [newRollNo, setNewRollNo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('CSE');
  const [newYear, setNewYear] = useState('2nd Year');

  // Initializing Queue Data Structure (FIFO)
  const pendingRequests = useMemo(() => {
    return requestsQueue.filter((r) => r.status === 'Pending');
  }, [requestsQueue]);

  const processedRequests = useMemo(() => {
    return requestsQueue.filter((r) => r.status !== 'Pending');
  }, [requestsQueue]);

  // Instantiating the canonical Queue class
  const correctionQueue = useMemo(() => {
    return new Queue<AttendanceCorrectionRequest>(pendingRequests);
  }, [pendingRequests]);

  const frontRequest = correctionQueue.peek();
  const queueSize = correctionQueue.size();
  const isQueueEmpty = correctionQueue.isEmpty();
  const rearRequest = correctionQueue.getRear();

  // Attendance map lookup
  const currentAttendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    attendanceList
      .filter((rec) => rec.date === selectedDate)
      .forEach((rec) => {
        map.set(rec.rollNo.toUpperCase(), rec.status);
      });
    return map;
  }, [attendanceList, selectedDate]);

  // Dynamic stats calculation matching user's spec:
  // "Total Students 120, Present Today 104, Absent Today 16"
  const stats = useMemo(() => {
    return getAttendanceStats(students, attendanceList, selectedDate);
  }, [students, attendanceList, selectedDate]);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Search Query filter (Roll No or Name)
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Department filter
      if (departmentFilter !== 'All' && student.department !== departmentFilter) {
        return false;
      }

      // 3. Status filter
      const currentStatus = currentAttendanceMap.get(student.rollNo.toUpperCase()) || 'Present';
      if (statusFilter === 'Present' && currentStatus !== 'Present') return false;
      if (statusFilter === 'Absent' && currentStatus !== 'Absent') return false;
      if (statusFilter === 'LowAttendance' && student.overallAttendance >= 75) return false;

      return true;
    });
  }, [students, searchQuery, departmentFilter, statusFilter, currentAttendanceMap]);

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Roll No', 'Name', 'Department', 'Year', 'Status', 'Overall %', 'Date'];
    const rows = filteredStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.department,
      s.year,
      currentAttendanceMap.get(s.rollNo.toUpperCase()) || 'Present',
      `${s.overallAttendance}%`,
      selectedDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PRPCEM_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRollNo.trim() || !newEmail.trim()) return;

    const student: Student = {
      id: `s-${Date.now()}`,
      name: newName.trim(),
      rollNo: newRollNo.trim().toUpperCase(),
      email: newEmail.trim().toLowerCase(),
      department: newDept,
      year: newYear,
      college: 'PRPCEM',
      password: 'password123',
      subjects: [
        { id: `sub-${Date.now()}-1`, name: 'JavaScript', code: 'CS201', faculty: 'Prof. A. Kulkarni', attended: 17, total: 20, percentage: 85 },
        { id: `sub-${Date.now()}-2`, name: 'Data Structure', code: 'CS202', faculty: 'Dr. S. Mehta', attended: 15, total: 18, percentage: 83 },
        { id: `sub-${Date.now()}-3`, name: 'Python', code: 'CS203', faculty: 'Prof. V. Sharma', attended: 22, total: 25, percentage: 88 },
        { id: `sub-${Date.now()}-4`, name: 'IOT', code: 'CS204', faculty: 'Prof. R. Deshmukh', attended: 21, total: 25, percentage: 84 },
      ],
      overallAttendance: 85,
      createdAt: getTodayDateString(),
    };

    onAddNewStudent(student);
    setShowAddStudentModal(false);
    setNewName('');
    setNewRollNo('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header matching User Request: "ADMIN DASHBOARD" */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
              Faculty Administration
            </span>
            <span className="text-xs text-slate-500">· Academic Year 2026</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">ADMIN DASHBOARD</h1>
          <p className="text-xs text-slate-600">
            P. R. Pote Patil College of Engineering and Management (PRPCEM)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs"
            title="Download CSV Attendance Sheet"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards: Total Students 120, Present 104, Absent 16, Correction Queue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Students */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{stats.totalStudents}</span>
            <span className="text-xs text-slate-500">Enrolled (CSE/IT)</span>
          </div>
        </div>

        {/* Metric 2: Present Today */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Present Today</span>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-800 font-mono">{stats.presentToday}</span>
            <span className="text-xs text-emerald-700 font-bold">({stats.overallRate}% Turnout)</span>
          </div>
        </div>

        {/* Metric 3: Absent Today */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-5 shadow-xs">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider">Absent Today</span>
            <XCircle className="h-5 w-5 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-800 font-mono">{stats.absentToday}</span>
            <span className="text-xs text-rose-700 font-medium">Requires follow-up</span>
          </div>
        </div>

        {/* Metric 4: Data Structure Feature - Correction Requests Queue (FIFO) */}
        <div 
          onClick={() => setActiveAdminTab('queue')}
          className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 p-5 shadow-xs cursor-pointer transition-all hover:border-indigo-400 group"
        >
          <div className="flex items-center justify-between text-indigo-900">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>Queue (FIFO)</span>
            </span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/70 text-indigo-800">
              Data Structure
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-900 font-mono">{queueSize}</span>
              <span className="text-xs text-indigo-700 font-bold">In Queue</span>
            </div>
            <span className="text-xs font-bold text-indigo-700 group-hover:text-indigo-900 underline flex items-center gap-0.5">
              <span>Open Queue</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Attendance Sheet vs Attendance Request Queue (FIFO) vs Leaves */}
      <div className="flex border-b border-slate-200 flex-wrap gap-1">
        <button
          onClick={() => setActiveAdminTab('attendance')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeAdminTab === 'attendance'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Daily Attendance Sheet & Marking ({filteredStudents.length} Students)
        </button>

        <button
          onClick={() => setActiveAdminTab('queue')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'queue'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Attendance Requests Queue (FIFO)</span>
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-black ${
            queueSize > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {queueSize}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('leaves')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeAdminTab === 'leaves'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Leave Applications ({leaves.filter((l) => l.status === 'Pending').length} Pending)
        </button>
      </div>

      {/* TAB 1: DAILY ATTENDANCE SHEET */}
      {activeAdminTab === 'attendance' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Date, Subject, Search, Status filter */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Date Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Attendance Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subject / Slot:
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All Subjects">All Subjects (Daily Roll Call)</option>
                  <option value="JavaScript">JavaScript (CS201)</option>
                  <option value="Data Structure">Data Structure (CS202)</option>
                  <option value="Python">Python (CS203)</option>
                  <option value="IOT">IOT (CS204)</option>
                </select>
              </div>

              {/* Search Bar */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Search Student:
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Roll No or Name..."
                    className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Filter by Status:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Students</option>
                  <option value="Present">Present Only</option>
                  <option value="Absent">Absent Only</option>
                  <option value="LowAttendance">Low Attendance (&lt; 75%)</option>
                </select>
              </div>

            </div>

            {/* Quick Bulk Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 text-xs">
              <span className="text-slate-600">
                Showing <strong className="text-slate-900">{filteredStudents.length}</strong> of {students.length} students
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Bulk Actions:</span>
                <button
                  onClick={() => onBulkMark('Present', selectedDate, selectedSubject)}
                  className="rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-bold text-emerald-800 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => onBulkMark('Absent', selectedDate, selectedSubject)}
                  className="rounded bg-rose-50 hover:bg-rose-100 border border-rose-300 px-2.5 py-1 text-xs font-bold text-rose-800 transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 font-mono">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Status ({selectedDate})</th>
                  <th className="py-3 px-4 text-center">Overall %</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No students found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const status = currentAttendanceMap.get(student.rollNo.toUpperCase()) || 'Present';
                    const isPresent = status === 'Present';
                    const isLowAttendance = student.overallAttendance < 75;

                    return (
                      <tr 
                        key={student.id} 
                        className={`transition-colors hover:bg-slate-50/80 ${
                          student.rollNo === 'CSE25F145' ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {/* Roll No */}
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {student.rollNo}
                          {student.rollNo === 'CSE25F145' && (
                            <span className="ml-2 text-[10px] text-blue-800 bg-blue-100 px-1 py-0.5 rounded font-sans font-medium">
                              (Demo Student)
                            </span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onSelectStudentProfile(student)}
                            className="font-bold text-slate-900 hover:text-blue-600 text-left transition-colors flex items-center gap-1.5"
                          >
                            <span>{student.name}</span>
                          </button>
                          <span className="text-[11px] text-slate-500">{student.email}</span>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {student.department} · {student.year}
                        </td>

                        {/* Status (Present / Absent) with 1-click toggle */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                            <button
                              type="button"
                              onClick={() => onToggleStatus(student.rollNo, 'Present', selectedDate, selectedSubject)}
                              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${
                                isPresent
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <Check className="h-3 w-3" />
                              <span>Present</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleStatus(student.rollNo, 'Absent', selectedDate, selectedSubject)}
                              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${
                                !isPresent
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <X className="h-3 w-3" />
                              <span>Absent</span>
                            </button>
                          </div>
                        </td>

                        {/* Overall % */}
                        <td className="py-3 px-4 text-center font-mono">
                          <span className={`font-bold ${
                            isLowAttendance ? 'text-rose-600' : 'text-emerald-700'
                          }`}>
                            {student.overallAttendance}%
                          </span>
                          {isLowAttendance && (
                            <span className="block text-[10px] text-rose-600 font-sans font-bold">
                              Shortage
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectStudentProfile(student)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <span>Profile</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: DATA STRUCTURE FEATURE: ATTENDANCE REQUESTS (FIFO QUEUE) */}
      {activeAdminTab === 'queue' && (
        <div className="space-y-5">
          
          {/* FIFO Queue Header & Visual Pipeline Card */}
          <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-indigo-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                    DATA STRUCTURE: QUEUE
                  </span>
                  <span className="text-xs font-bold text-indigo-900">FIFO (First In, First Out)</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">ATTENDANCE REQUESTS QUEUE</h3>
                <p className="text-xs text-slate-600">
                  Student correction requests are enqueued in FIFO order. Admin clicks <strong>[Process Next Request]</strong> to dequeue and resolve the request at the <strong>Front</strong>.
                </p>
              </div>

              {/* Main Process Button */}
              <button
                disabled={isQueueEmpty}
                onClick={() => onProcessNextRequest('Approved', 'Approved via FIFO Queue')}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Process Next Request (dequeue)</span>
              </button>
            </div>

            {/* Visual Queue Pipeline Display */}
            <div className="rounded-xl border border-indigo-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <span>Live Queue Visualizer</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  size() = {queueSize} · isEmpty() = {isQueueEmpty ? 'true' : 'false'}
                </span>
              </div>

              {isQueueEmpty ? (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="font-bold text-slate-700">Queue is Empty (isEmpty() === true)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">All attendance correction requests have been processed in FIFO order.</p>
                </div>
              ) : (
                <div className="overflow-x-auto py-2">
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="text-[11px] font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded border border-emerald-300">
                      FRONT (dequeue)
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />

                    {pendingRequests.map((req, idx) => {
                      const isFront = idx === 0;
                      const isRear = idx === pendingRequests.length - 1;

                      return (
                        <React.Fragment key={req.id}>
                          <div className={`rounded-xl border p-3 min-w-[200px] transition-all shadow-2xs ${
                            isFront 
                              ? 'border-indigo-500 bg-indigo-50/90 ring-2 ring-indigo-500/30' 
                              : isRear 
                              ? 'border-blue-300 bg-blue-50/60' 
                              : 'border-slate-200 bg-white'
                          }`}>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-mono font-bold text-blue-700">{req.rollNo}</span>
                              <span className={`px-1.5 py-0.2 rounded font-mono font-black text-[9px] ${
                                isFront ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {isFront ? 'NEXT (peek())' : isRear ? 'REAR (enqueue)' : `#${idx + 1}`}
                              </span>
                            </div>
                            <p className="font-bold text-slate-900 text-xs mt-1 truncate">{req.studentName}</p>
                            <p className="text-[11px] text-indigo-700 font-semibold">{req.subject}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{req.reason}</p>
                          </div>

                          {idx < pendingRequests.length - 1 && (
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}

                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="text-[11px] font-mono font-black text-blue-800 bg-blue-100 px-2 py-1 rounded border border-blue-300">
                      REAR (enqueue)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Front Element Details Card (peek()) */}
            {frontRequest && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                        Current Front Element: peek()
                      </h4>
                      <p className="text-[11px] text-slate-600">This request is the first in line and will be processed on the next dequeue operation.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onProcessNextRequest('Approved', 'Approved by Faculty Admin')}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve & Mark Present</span>
                    </button>
                    <button
                      onClick={() => onProcessNextRequest('Rejected', 'Insufficient proof of attendance')}
                      className="rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject & Dequeue</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3 border border-emerald-200 text-xs grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                    <strong className="text-slate-900">{frontRequest.studentName}</strong>
                    <span className="font-mono text-blue-700 ml-1 font-bold">({frontRequest.rollNo})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Subject & Date</span>
                    <strong className="text-slate-900">{frontRequest.subject}</strong>
                    <span className="text-slate-500 block text-[10px] font-mono">{frontRequest.date}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Clarification</span>
                    <p className="text-slate-700 italic">"{frontRequest.reason}"</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Exact Table requested in User Prompt:
              ATTENDANCE REQUESTS
              ┌──────┬─────────────┬───────────┐
              │ Roll │ Student     │ Status    │
              ├──────┼─────────────┼───────────┤
              │ 145  │ Shahid Ali  │ Pending   │
              │ 146  │ Ahmed Khan  │ Pending   │
              │ 147  │ Rahul Patil │ Pending   │
              └──────┴─────────────┴───────────┘
          */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  ATTENDANCE REQUESTS (QUEUE TABLE)
                </h4>
                <p className="text-[11px] text-slate-500">Ordered by arrival time (FIFO: Index 0 is Front, Index N is Rear)</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600">
                {pendingRequests.length} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-100/70 text-slate-700 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-4 font-mono">Queue Pos</th>
                    <th className="py-2.5 px-4 font-mono">Roll</th>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4">Dispute Reason</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Queue Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No pending requests in the queue.
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.map((req, index) => {
                      const isFront = index === 0;
                      const isRear = index === pendingRequests.length - 1;

                      return (
                        <tr 
                          key={req.id} 
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isFront ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          {/* Queue Position */}
                          <td className="py-3 px-4 font-mono">
                            {isFront ? (
                              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] border border-emerald-300">
                                FRONT (Next)
                              </span>
                            ) : isRear ? (
                              <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[10px] border border-blue-300">
                                REAR (#{index + 1})
                              </span>
                            ) : (
                              <span className="font-medium text-slate-600 text-[11px]">
                                Position #{index + 1}
                              </span>
                            )}
                          </td>

                          {/* Roll No */}
                          <td className="py-3 px-4 font-mono font-bold text-blue-700">
                            {req.rollNo}
                          </td>

                          {/* Student Name */}
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {req.studentName}
                          </td>

                          {/* Subject */}
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {req.subject}
                          </td>

                          {/* Dispute Reason */}
                          <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={req.reason}>
                            {req.reason}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                              {req.status}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-right">
                            {isFront ? (
                              <button
                                onClick={() => onProcessNextRequest('Approved', 'Approved by Faculty Admin')}
                                className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 text-[11px] shadow-2xs transition-colors"
                              >
                                Process Front
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Waiting in Queue
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Processed History Log */}
          {processedRequests.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Resolved Requests History (Dequeued Log)
                </h4>
                <span className="text-xs text-slate-500 font-mono">{processedRequests.length} resolved</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {processedRequests.map((req) => (
                  <div key={req.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{req.studentName}</strong>
                        <span className="font-mono text-blue-700">({req.rollNo})</span>
                        <span className="text-slate-500">· {req.subject}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">"{req.reason}"</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {req.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{req.processedAt || 'Processed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: LEAVES APPROVAL TAB */}
      {activeAdminTab === 'leaves' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Leave Applications</h3>
              <p className="text-xs text-slate-500">Review medical certificates and academic On-Duty (OD) permissions.</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">{leaves.length} total applications</span>
          </div>

          <div className="space-y-3">
            {leaves.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No leave applications found.</p>
            ) : (
              leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{leave.studentName}</span>
                        <span className="font-mono text-xs font-bold text-blue-700">{leave.rollNo}</span>
                        <span className="text-xs text-slate-500">({leave.department})</span>
                      </div>
                      <p className="text-xs font-bold text-indigo-700 mt-0.5">
                        Type: {leave.type} Leave · Duration: {leave.startDate} to {leave.endDate}
                      </p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      leave.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : leave.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {leave.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    "{leave.reason}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-slate-500">Submitted: {leave.submittedAt}</span>
                    
                    {leave.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateLeaveStatus(leave.id, 'Approved', 'Approved by Faculty Admin')}
                          className="rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1 font-bold text-white transition-colors"
                        >
                          Approve Leave
                        </button>
                        <button
                          onClick={() => onUpdateLeaveStatus(leave.id, 'Rejected', 'Insufficient medical proof')}
                          className="rounded-md bg-rose-600 hover:bg-rose-500 px-3 py-1 font-bold text-white transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Enroll New Student</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Kunal Deshmukh"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={newRollNo}
                  onChange={(e) => setNewRollNo(e.target.value)}
                  placeholder="e.g. CSE25F155"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 uppercase font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@prpcem.ac.in"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="AI&DS">AI & DS</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Save & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
