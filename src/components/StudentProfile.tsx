import React, { useState, useMemo } from 'react';
import { Student, DailyAttendanceRecord, LeaveRequest } from '../types';
import { calculateClassesNeeded, getStudentLast7SessionsTrend } from '../utils/storage';
import { downloadStudentCardPNG } from '../utils/downloadCard';
import { CardPreviewModal } from './CardPreviewModal';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  Download,
  TrendingUp,
  Check,
  ExternalLink,
  Eye,
  LineChart as LineChartIcon,
  Sparkles,
  CalendarDays,
  Award
} from 'lucide-react';

interface StudentProfileProps {
  student: Student;
  attendanceHistory: DailyAttendanceRecord[];
  leaves: LeaveRequest[];
  onOpenLeaveModal: () => void;
  onAskChatbot: (question: string) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  attendanceHistory,
  leaves,
  onOpenLeaveModal,
  onAskChatbot,
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'overview' | 'simulator' | 'history' | 'leaves'>('trends');
  const [simulatorTarget, setSimulatorTarget] = useState<number>(85);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Filter attendance records specific to this student
  const studentRecords = useMemo(() => {
    return attendanceHistory.filter(
      (record) => record.rollNo.toLowerCase() === student.rollNo.toLowerCase()
    );
  }, [attendanceHistory, student.rollNo]);

  // Student's leave applications
  const studentLeaves = useMemo(() => {
    return leaves.filter(
      (leave) => leave.rollNo.toLowerCase() === student.rollNo.toLowerCase()
    );
  }, [leaves, student.rollNo]);

  const isEligible = student.overallAttendance >= 75;

  // 7-session trend data generated for recharts
  const trendData = useMemo(() => {
    return getStudentLast7SessionsTrend(student, attendanceHistory);
  }, [student, attendanceHistory]);

  // 7-session analytics
  const trendStats = useMemo(() => {
    if (!trendData || trendData.length === 0) return { avg: 85, peak: 86, change: 0 };
    const percentages = trendData.map((t) => t.percentage);
    const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
    const peak = Math.max(...percentages);
    const change = percentages[percentages.length - 1] - percentages[0];
    return { avg, peak, change };
  }, [trendData]);

  // Direct PNG Card Download
  const handleDirectDownload = () => {
    downloadStudentCardPNG(student);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome with eligibility badge */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="absolute top-0 right-0 h-32 w-72 bg-gradient-to-l from-blue-100/50 to-transparent pointer-events-none rounded-tr-2xl" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-md text-2xl font-black">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{student.name}</h1>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {student.rollNo}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Award className="h-3 w-3" /> PRPCEM
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                {student.department} · {student.year} · <span className="font-semibold text-slate-800">Roll No: {student.rollNo}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenLeaveModal}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
            >
              <PlusCircle className="h-4 w-4 text-slate-500" />
              <span>Apply Leave</span>
            </button>

            {/* Preview & Print Modal Trigger */}
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs"
              title="Preview Official Attendance Card"
            >
              <Eye className="h-4 w-4 text-slate-500" />
              <span>Preview Card</span>
            </button>

            {/* Reliable Direct PNG Download */}
            <button
              onClick={handleDirectDownload}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all"
              title="Download official high-resolution attendance card PNG"
            >
              <Download className="h-4 w-4" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Card'}</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fadeIn">
            <Check className="h-4 w-4" /> Official Attendance Card PNG downloaded directly to your downloads!
          </div>
        )}
      </div>

      {/* Main Grid: Student Card + Recharts Line Chart & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 Cols): The Exact Requested Student Profile Card */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Exact Card specified in prompt */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden transition-all hover:shadow-md">
            {/* Card Header */}
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                <span className="font-extrabold tracking-wider text-xs uppercase text-slate-700">Student Profile</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500">PRPCEM-ERP</span>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-5 font-sans">
              {/* Student Demographics */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{student.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-700 font-mono">
                  <span className="text-slate-500 font-sans">Roll No:</span>
                  <span className="font-bold text-blue-700">{student.rollNo}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {student.department} - {student.year}
                </p>
                <p className="text-xs font-bold text-indigo-700 tracking-wider">
                  {student.college}
                </p>
              </div>

              {/* Attendance Section Divider */}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    Attendance
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Aggregate / Subject</span>
                </div>

                {/* Subject-wise listing (JavaScript, React, Python, Programming) */}
                <div className="mt-3 space-y-2.5">
                  {student.subjects.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-extrabold ${
                          sub.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {sub.percentage}%
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({sub.attended}/{sub.total})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Total Box */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200/90 shadow-2xs">
                  <span className="text-sm font-bold text-slate-800">Overall Attendance:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-black font-mono ${
                      student.overallAttendance >= 75 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {student.overallAttendance}%
                    </span>
                  </div>
                </div>
              </div>

              {/* University Status Notice */}
              <div className={`flex items-start gap-2.5 rounded-xl p-3.5 text-xs ${
                isEligible 
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-900' 
                  : 'border border-rose-200 bg-rose-50 text-rose-900'
              }`}>
                {isEligible ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <div>
                  <p className="font-bold">
                    {isEligible ? 'Eligible for End-Sem Examinations' : 'Attendance Shortage Notice'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-600 leading-relaxed">
                    {isEligible 
                      ? 'Attendance is above the mandatory 75% university threshold.'
                      : 'Attendance is below 75%. Meet Head of Department or submit medical certificate.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick AI Query Suggestion */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 p-4 text-xs shadow-2xs">
            <p className="font-bold text-indigo-950 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-600" /> Plan Your Classes with AI
            </p>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Ask our Python Assistant how many upcoming sessions you can miss or must attend:
            </p>
            <button
              onClick={() => onAskChatbot(`I have ${student.overallAttendance}% overall attendance at PRPCEM. How many classes do I need to reach 90%?`)}
              className="mt-2.5 inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
            >
              <span>Calculate target attendance formula</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

        </div>

        {/* Right Column (7 Cols): Recharts Line Chart + Detailed Analytics Tabs */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Tab Navigation */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex-1 rounded-lg py-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'trends'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="h-3.5 w-3.5 text-blue-600" />
              <span>7-Session Trends</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 rounded-lg py-2 transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Subject Details
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 rounded-lg py-2 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Goal Simulator
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 rounded-lg py-2 transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recent Logs
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`flex-1 rounded-lg py-2 transition-all ${
                activeTab === 'leaves'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leaves ({studentLeaves.length})
            </button>
          </div>

          {/* TAB: 7-Session Recharts Line Chart View (User Requirement) */}
          {activeTab === 'trends' && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">Attendance Percentage Trend</h3>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Last 7 Sessions
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous tracking vs. the university 75% examination eligibility benchmark.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block" />
                    <span>Attendance %</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-rose-600">
                    <span className="h-0.5 w-3 border-t-2 border-dashed border-rose-500 inline-block" />
                    <span>75% Criteria</span>
                  </div>
                </div>
              </div>

              {/* Recharts Line Chart Container */}
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="session" 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[40, 100]} 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const isAboveCutoff = data.percentage >= 75;
                          return (
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                              <p className="font-bold text-slate-900">{data.sessionLabel}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{data.date}</p>
                              <div className="pt-1 flex items-center justify-between gap-4">
                                <span className="text-slate-600 font-medium">Recorded Attendance:</span>
                                <span className={`font-mono font-black ${isAboveCutoff ? 'text-emerald-700' : 'text-rose-600'}`}>
                                  {data.percentage}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4 text-[11px]">
                                <span className="text-slate-500">Session Status:</span>
                                <span className={`font-bold ${data.status === 'Present' ? 'text-emerald-700' : 'text-rose-600'}`}>
                                  {data.status}
                                </span>
                              </div>
                              <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                                {isAboveCutoff ? '✓ Above 75% Exam Threshold' : '⚠️ Shortage Risk'}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine 
                      y={75} 
                      stroke="#ef4444" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ 
                        value: '75% Criteria', 
                        position: 'insideTopRight', 
                        fill: '#ef4444', 
                        fontSize: 10,
                        fontWeight: 700
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#2563eb" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#attendanceGradient)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">7-Session Peak</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{trendStats.peak}%</span>
                  <span className="text-[10px] text-emerald-700 font-bold block">Best Record</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Rolling Average</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{trendStats.avg}%</span>
                  <span className="text-[10px] text-blue-700 font-bold block">Consistent</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Net Trend</span>
                  <span className={`text-xl font-black font-mono ${trendStats.change >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {trendStats.change >= 0 ? `+${trendStats.change}%` : `${trendStats.change}%`}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium block">vs Session 1</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Cutoff Buffer</span>
                  <span className={`text-xl font-black font-mono ${student.overallAttendance >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {student.overallAttendance >= 75 
                      ? `+${student.overallAttendance - 75}%` 
                      : `-${75 - student.overallAttendance}%`}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium block">Over 75% limit</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-View: Subject Progress Bars & Faculty */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {student.subjects.map((sub) => {
                const neededFor75 = calculateClassesNeeded(sub.attended, sub.total, 75);
                return (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{sub.name}</h4>
                          <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {sub.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Faculty: {sub.faculty}</p>
                      </div>

                      <div className="text-right">
                        <span className={`text-xl font-black font-mono ${
                          sub.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {sub.percentage}%
                        </span>
                        <p className="text-xs text-slate-500 font-mono font-medium">
                          {sub.attended} / {sub.total} Classes
                        </p>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="mt-3.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/50">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          sub.percentage >= 75
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-rose-500 to-amber-500'
                        }`}
                        style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                      />
                    </div>

                    {/* Advisory message */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Threshold: 75%</span>
                      {sub.percentage < 75 ? (
                        <span className="text-rose-600 font-bold">
                          ⚠️ Attend next {neededFor75} lecture{neededFor75 > 1 ? 's' : ''} to reach 75%
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">
                          ✓ On track for exams
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub-View: Attendance Simulator */}
          {activeTab === 'simulator' && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Attendance Goal Calculator</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  See how many consecutive classes you must attend to achieve your target percentage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Target Percentage:</span>
                {[75, 80, 85, 90].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => setSimulatorTarget(percent)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      simulatorTarget === percent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 pt-2">
                {student.subjects.map((sub) => {
                  const needed = calculateClassesNeeded(sub.attended, sub.total, simulatorTarget);
                  const isAlreadyAbove = sub.percentage >= simulatorTarget;

                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                        <span className="ml-2 font-mono text-slate-500 font-semibold">({sub.percentage}%)</span>
                      </div>

                      <div>
                        {isAlreadyAbove ? (
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <Check className="h-4 w-4 text-emerald-600" /> Target Achieved
                          </span>
                        ) : (
                          <span className="font-semibold text-amber-800">
                            Must attend next <strong className="font-black text-slate-900">{needed}</strong> classes
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-blue-50/80 p-3.5 text-xs text-blue-900 border border-blue-200 font-mono">
                <strong>Formula:</strong> (attended + x) / (total + x) ≥ Target Ratio
              </div>
            </div>
          )}

          {/* Sub-View: History Logs */}
          {activeTab === 'history' && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Daily Attendance Records</h3>
                <span className="text-xs text-slate-500 font-mono font-bold">{studentRecords.length} records</span>
              </div>

              {studentRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No attendance records logged for this student yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {studentRecords.map((rec) => (
                    <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{rec.date}</span>
                          <span className="text-slate-500">· {rec.subject}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Marked at {rec.markedAt} by {rec.markedBy}</p>
                      </div>

                      <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                        rec.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rec.status === 'Absent'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-View: Leaves & OD */}
          {activeTab === 'leaves' && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Submitted Leave Applications</h3>
                <button
                  onClick={onOpenLeaveModal}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800"
                >
                  + New Application
                </button>
              </div>

              {studentLeaves.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No leave requests submitted.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {studentLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{leave.type} Leave</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : leave.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-slate-700">{leave.reason}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Duration: {leave.startDate} to {leave.endDate}</span>
                        <span>{leave.submittedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Official Attendance Card Preview & Print Modal */}
      <CardPreviewModal
        isOpen={isPreviewModalOpen}
        student={student}
        onClose={() => setIsPreviewModalOpen(false)}
      />

    </div>
  );
};
