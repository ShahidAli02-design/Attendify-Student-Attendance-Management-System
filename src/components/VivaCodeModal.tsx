import React, { useState } from 'react';
import { Code2, X, Check, Copy } from 'lucide-react';

interface VivaCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaCodeModal: React.FC<VivaCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'js' | 'react' | 'python' | 'storage'>('js');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>College Practical & Viva Concept Guide</span>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 border border-indigo-200">
                  Attendify Exam Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Detailed explanations of practical concepts implemented across this application.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 pt-2">
          {[
            { id: 'js', label: '1. JS: Functions, Arrays & Objects' },
            { id: 'react', label: '2. React: Components, Hooks & DOM' },
            { id: 'python', label: '3. Python: Analytics & Algorithms' },
            { id: 'storage', label: '4. LocalStorage & Persistence' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          {/* Tab 1: JavaScript Concepts */}
          {activeTab === 'js' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Functions vs Arrow Functions</h3>
                  <button
                    onClick={() => handleCopy(`// Regular Function (Declaration)
function calculateOverallAttendance(subjects) {
  let attendedSum = 0, totalSum = 0;
  for (let s of subjects) {
    attendedSum += s.attended;
    totalSum += s.total;
  }
  return totalSum > 0 ? Math.round((attendedSum / totalSum) * 100) : 0;
}

// Arrow Function (concise, lexical this)
const handleToggleStatus = (rollNo, newStatus) => {
  setAttendanceList(prev => prev.map(rec => 
    rec.rollNo === rollNo ? { ...rec, status: newStatus } : rec
  ));
};`, 'js-funcs')}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    {copiedKey === 'js-funcs' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'js-funcs' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600">
                  <strong>Where used:</strong> Regular functions are used for core calculation algorithms (<code>calculateAttendance</code>, <code>loginStudent</code>). Arrow functions are used for concise callbacks in event handlers (<code>{'onClick={() => handleMark(...)}'}</code>).
                </p>
                <pre className="rounded-lg bg-slate-900 p-3 font-mono text-emerald-300 overflow-x-auto">
{`// 1. Array.filter() for Real-time Search
const filteredStudents = students.filter(student => 
  student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
);

// 2. Array.reduce() for Aggregate Attendance Calculation
const totalAttended = subjects.reduce((sum, curr) => sum + curr.attended, 0);

// 3. Array.map() for Rendering Rows & Updating Status
const updatedList = attendanceList.map(rec => 
  rec.rollNo === targetRoll ? { ...rec, status: 'Present' } : rec
);

// 4. Array.find() for Student Authentication
const student = students.find(s => s.rollNo === inputRollNo);`}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">JavaScript Objects & Data Modeling</h3>
                <p className="text-slate-600">
                  Student profiles are stored as JavaScript objects with nested subject arrays and calculated fields, maintaining structural integrity across sessions.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: React Concepts */}
          {activeTab === 'react' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">React Components & State Management</h3>
                <p className="text-slate-600">
                  Attendify is partitioned into clean, modular React functional components:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <strong className="text-slate-900">StudentProfile.tsx:</strong> Renders the iconic student card, progress bars, and exam eligibility criteria.
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <strong className="text-slate-900">AdminDashboard.tsx:</strong> Renders live counters (Total: 120, Present: 104, Absent: 16) and interactive roll table.
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <strong className="text-slate-900">StudentAuth.tsx:</strong> Handles student registration, login validation, and admin auth.
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <strong className="text-slate-900">ChatBot.tsx:</strong> Handles natural language questions via <code>/api/chat</code> API endpoint.
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-800">React Hooks Used:</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                    <li><strong className="text-slate-800">useState:</strong> Manages search queries, date pickers, form fields, active modal state.</li>
                    <li><strong className="text-slate-800">useEffect:</strong> Syncs state changes to <code>localStorage</code> and manages auto-scroll in chat.</li>
                    <li><strong className="text-slate-800">useMemo:</strong> Optimizes search filtering and attendance percentage calculations across 120 students without unnecessary re-renders.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">DOM Events & Event Delegation</h3>
                <p className="text-slate-600">
                  Events handled: <code>onSubmit</code> with <code>e.preventDefault()</code> for registration/login, <code>onChange</code> for instant search debounce, and <code>onClick</code> for instant status toggling between Present and Absent.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Python Concepts */}
          {activeTab === 'python' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Python Attendance Analytics Script</h3>
                  <button
                    onClick={() => handleCopy(`import pandas as pd

# Core Attendance Analytics Module
def analyze_student_records(records: list) -> dict:
    df = pd.DataFrame(records)
    
    # Calculate subject-wise percentage
    summary = df.groupby('Subject')['Status'].apply(
        lambda x: (x == 'Present').sum() / len(x) * 100
    ).to_dict()
    
    overall = (df['Status'] == 'Present').mean() * 100
    is_eligible = overall >= 75.0
    
    return {
        "overall_percentage": round(overall, 2),
        "subject_breakdown": summary,
        "exam_eligible": is_eligible
    }`, 'py-code')}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    {copiedKey === 'py-code' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'py-code' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600">
                  Students can present this Python logic to the examiner during practical examinations to demonstrate how backend data science or automated attendance reporting is implemented:
                </p>
                <pre className="rounded-lg bg-slate-900 p-3 font-mono text-emerald-300 overflow-x-auto">
{`# Attendify Target Attendance Formula:
def classes_needed_to_reach_target(attended: int, total: int, target: float = 0.75) -> int:
    """
    Mathematical Formula:
    (attended + x) / (total + x) >= target
    attended + x >= target * total + target * x
    x * (1 - target) >= target * total - attended
    x = ceil((target * total - attended) / (1 - target))
    """
    if (attended / total) >= target:
        return 0
    return max(0, int((target * total - attended) / (1 - target)) + 1)

# Example: Shahid Ali has 17/20 in JavaScript (85%):
print("Needed:", classes_needed_to_reach_target(17, 20, 0.75)) # Returns 0 (Eligible)`}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 4: LocalStorage & Persistence */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Browser Persistence Architecture</h3>
                <p className="text-slate-600">
                  As requested in the user prompt:
                  <em className="text-indigo-700 block my-1 font-semibold">
                    "Backend ki zarurat bhi nahi hai agar college practical ke liye hi hai. localStorage mein student account aur attendance data rakh denge, to refresh karne ke baad bhi data rahega."
                  </em>
                </p>
                <p className="text-slate-600">
                  Records are stored under structured keys:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 font-mono text-[11px]">
                  <li><code>attendify_students_v1</code>: All student profiles with their enrolled subjects and historical grades.</li>
                  <li><code>attendify_attendance_v1</code>: Day-by-day attendance marked by date and roll number.</li>
                  <li><code>attendify_leaves_v1</code>: Student leave applications and OD permissions.</li>
                  <li><code>attendify_session_v1</code>: Active user role (Student vs Admin) and current active student.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">PRPCEM Practical Assessment Guide</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-1.5 font-bold text-white hover:bg-blue-500 transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
