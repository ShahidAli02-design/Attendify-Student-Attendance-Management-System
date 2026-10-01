import React from 'react';
import { Student, DailyAttendanceRecord, LeaveRequest } from '../types';
import { getAttendanceStats, getTodayDateString } from '../utils/storage';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  CheckCircle2, 
  XCircle, 
  LineChart as ChartIcon, 
  Download, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Award, 
  FileText, 
  Building2, 
  BellRing,
  Code2,
  Lock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface LandingDashboardProps {
  students: Student[];
  attendanceList: DailyAttendanceRecord[];
  leaves: LeaveRequest[];
  onOpenLogin: (tab?: 'login' | 'register' | 'admin') => void;
  onQuickEnterStudent: (rollNo: string) => void;
  onQuickEnterAdmin: () => void;
  onOpenVivaGuide: () => void;
}

export const LandingDashboard: React.FC<LandingDashboardProps> = ({
  students,
  attendanceList,
  leaves,
  onOpenLogin,
  onQuickEnterStudent,
  onQuickEnterAdmin,
  onOpenVivaGuide,
}) => {
  const stats = getAttendanceStats(students, attendanceList, getTodayDateString());
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Hero Institutional Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 h-64 w-96 bg-gradient-to-bl from-blue-100/60 via-indigo-50/40 to-transparent pointer-events-none rounded-tr-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-blue-50/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
              <Award className="h-3.5 w-3.5 text-blue-600" />
              P. R. Pote Patil College of Engineering & Management
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Autonomous Institute · Amravati
            </span>
            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {todayStr}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Campus Student Attendance <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              Management & Analytics Portal
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Attendify provides unified real-time attendance tracking for undergraduate engineering students and faculty administration. Check exam eligibility thresholds, monitor 7-session trends, and download verified attendance cards.
          </p>

          {/* Quick Viva & Practical Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenVivaGuide}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
            >
              <Code2 className="h-4 w-4 text-indigo-600" />
              <span>Explore College Practical & Viva Guide</span>
            </button>
            <span className="text-xs text-slate-500">
              • Built with React 19, Recharts & Python API
            </span>
          </div>
        </div>
      </div>

      {/* 2. Campus Today Overview Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{stats.totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">Students (CSE / IT / AI)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 Engineering batches</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Present Today</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-800 font-mono">{stats.presentToday}</span>
            <span className="text-xs text-emerald-700 font-bold">({stats.overallRate}% Turnout)</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">Classroom attendance verified</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider">Absent Today</span>
            <XCircle className="h-5 w-5 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-800 font-mono">{stats.absentToday}</span>
            <span className="text-xs text-rose-700 font-semibold">Requires follow-up</span>
          </div>
          <p className="text-[11px] text-rose-700 mt-1 font-medium">Alerts sent to department mentors</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-indigo-900">
            <span className="text-xs font-bold uppercase tracking-wider">Exam Eligibility Rule</span>
            <Award className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-950 font-mono">75%</span>
            <span className="text-xs text-indigo-800 font-bold">Mandatory</span>
          </div>
          <p className="text-[11px] text-indigo-700 mt-1 font-medium">PRPCEM Academic Senate Norms</p>
        </div>
      </div>

      {/* 3. Two Core Portal Gateway Cards (Student vs Admin) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Select Your Access Portal</h2>
          <p className="text-xs text-slate-500">Sign in to your designated university dashboard or test with 1-click evaluation access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Student Portal */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Student Gateway
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Student Portal</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  View individual subject attendance breakdown (JavaScript, Data Structure, Python, IOT), interactive 7-session trend charts, exam clearance status, and download official attendance cards.
                </p>
              </div>

              {/* Feature bullets */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Subject-wise Breakdown</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>7-Session Line Chart</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Dispute Queue (FIFO)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Medical & OD Submissions</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-2.5 border-t border-slate-100 mt-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenLogin('login')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-[0.99]"
                >
                  <span>Student Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onOpenLogin('register')}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Create Account
                </button>
              </div>

              {/* 1-Click Evaluation shortcut */}
              <div className="rounded-xl bg-blue-50/70 p-3 text-xs border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">Practical Demo Profile:</span>
                  <span className="text-[11px] text-blue-700">Shahid Ali (CSE25F145 · 86% Overall)</span>
                </div>
                <button
                  onClick={() => onQuickEnterStudent('CSE25F145')}
                  className="shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors"
                >
                  Enter Directly →
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Faculty & Admin Portal */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Faculty Administration
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Admin Dashboard</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Real-time master attendance roll call, single-click Present/Absent toggles, student filtering by Roll No or Name, FIFO correction queue resolution, and institutional CSV reports.
                </p>
              </div>

              {/* Feature bullets */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Interactive Daily Roll Call</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Real-time Present/Absent Toggle</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Correction Queue (FIFO Desk)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Export CSV Sheets & Leaves</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-2.5 border-t border-slate-100 mt-6">
              <button
                onClick={() => onOpenLogin('admin')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-[0.99]"
              >
                <span>Faculty Admin Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* 1-Click Evaluation shortcut */}
              <div className="rounded-xl bg-emerald-50/70 p-3 text-xs border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">Practical Demo Admin:</span>
                  <span className="text-[11px] text-emerald-800">Faculty Coordinator (ADMIN01)</span>
                </div>
                <button
                  onClick={onQuickEnterAdmin}
                  className="shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors"
                >
                  Enter Directly →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Department Performance & Academic Notices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Department Performance Cards (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Academic Department Attendance</h3>
              <p className="text-xs text-slate-500">Live aggregated attendance across engineering branches.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">PRPCEM ERP</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { name: 'Computer Science & Engineering (CSE)', code: 'CSE', avg: 86, color: 'from-blue-600 to-indigo-600', students: 60 },
              { name: 'Information Technology (IT)', code: 'IT', avg: 88, color: 'from-emerald-600 to-teal-600', students: 30 },
              { name: 'Artificial Intelligence & Data Science (AI&DS)', code: 'AI&DS', avg: 84, color: 'from-indigo-600 to-purple-600', students: 20 },
              { name: 'Mechanical & Civil Engineering', code: 'MECH/CIVIL', avg: 81, color: 'from-amber-600 to-orange-600', students: 10 },
            ].map((dept, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{dept.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">({dept.students} Active Students)</span>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-sm">{dept.avg}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${dept.color}`}
                    style={{ width: `${dept.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Academic Notice Board (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-blue-600" />
              <h3 className="text-base font-black text-slate-900">Official Notice Board</h3>
            </div>
            <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
              Circulars
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3.5 space-y-1">
              <span className="font-mono text-[10px] font-bold text-blue-800">CIRCULAR #PRP-2026-04</span>
              <h4 className="text-xs font-bold text-slate-900">Mandatory 75% Attendance for Semester Exams</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Students with attendance falling below 75% will be debarred from writing practical and theory end-semester examinations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-600">CIRCULAR #PRP-2026-02</span>
              <h4 className="text-xs font-bold text-slate-900">Medical Certificate & OD Guidelines</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Medical leave and hackathon On-Duty (OD) applications must be submitted via Attendify within 3 working days with doctor or event proof.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-600">CIRCULAR #PRP-2026-01</span>
              <h4 className="text-xs font-bold text-slate-900">Python & AI Assistant Available</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Students can use the in-app Attendify AI Assistant to calculate target lectures needed for 75% or 90% attendance goals.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
