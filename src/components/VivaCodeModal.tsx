import React, { useState } from 'react';
import { Code2, X, Check, Copy, Layers } from 'lucide-react';

interface VivaCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaCodeModal: React.FC<VivaCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'js' | 'react' | 'python' | 'storage'>('queue');
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>College Practical & Viva Concept Guide</span>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 border border-indigo-200">
                  Data Structures & Web
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Detailed explanations of Data Structures (Queue FIFO), React, and JavaScript concepts.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 pt-2 overflow-x-auto">
          {[
            { id: 'queue', label: '⭐ Data Structure: Queue (FIFO)' },
            { id: 'js', label: '1. JS: Functions, Arrays & Objects' },
            { id: 'react', label: '2. React: Components, Hooks & DOM' },
            { id: 'python', label: '3. Python: Analytics & Algorithms' },
            { id: 'storage', label: '4. LocalStorage & Persistence' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          {/* TAB: DATA STRUCTURE: QUEUE (FIFO) */}
          {activeTab === 'queue' && (
            <div className="space-y-6">
              
              {/* Viva Golden Statement Box */}
              <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/80 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-950">
                    Viva Answer for Examiner
                  </h3>
                </div>
                <blockquote className="rounded-lg bg-white p-3 border border-indigo-200 text-xs font-bold text-slate-900 leading-relaxed italic">
                  “A Queue data structure is used to manage attendance correction requests using the FIFO (First In, First Out) principle.”
                </blockquote>
                <p className="text-[11px] text-slate-600">
                  When a student notices an attendance discrepancy, they submit a correction request which is <strong>enqueued</strong> at the rear. The faculty admin processes requests one by one from the <strong>front</strong> using <strong>dequeue()</strong>, ensuring fair, chronological resolution without starvation.
                </p>
              </div>

              {/* ASCII Diagram & Conceptual Operations */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <span>Queue Pipeline & Core Operations</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(`// Queue Implementation (FIFO - First In, First Out)
export class Queue<T> {
  private items: T[] = [];

  // 1. enqueue(): Add new request to rear
  enqueue(item: T): void {
    this.items.push(item);
  }

  // 2. dequeue(): Process & remove oldest request from front
  dequeue(): T | undefined {
    return this.items.shift();
  }

  // 3. peek(): View next in line without removing
  peek(): T | undefined {
    return this.items[0];
  }

  // 4. isEmpty(): Check if any requests are pending
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // 5. size(): Total requests currently queued
  size(): number {
    return this.items.length;
  }
}`, 'ts-queue')}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedKey === 'ts-queue' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'ts-queue' ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Visual Representation */}
                <pre className="rounded-lg bg-slate-950 p-3.5 font-mono text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
{`          ATTENDANCE CORRECTION QUEUE (FIFO)
┌────────────────────────────────────────────────────────┐
│ FRONT: [Shahid Ali] → [Ahmed Khan] → [Rahul Patil] :REAR│
└────────────────────────────────────────────────────────┘
   ↑ (dequeue: Admin resolves)              ↑ (enqueue: Student submits)`}
                </pre>

                {/* Breakdown of Operations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <strong className="text-indigo-700 font-mono">enqueue(request)</strong>:
                    <p className="text-slate-600 mt-0.5">Called when student clicks "Request Attendance Correction". The dispute is pushed to the back (Rear) of the queue.</p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <strong className="text-emerald-700 font-mono">dequeue()</strong>:
                    <p className="text-slate-600 mt-0.5">Called when faculty clicks "[Process Next Request]". The oldest request at the Front is removed and its attendance is updated.</p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <strong className="text-blue-700 font-mono">peek()</strong>:
                    <p className="text-slate-600 mt-0.5">Inspects the request at the Front (Next In Line) to display student details, subject, and reason on Admin desk without deleting it.</p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <strong className="text-amber-700 font-mono">isEmpty()</strong>:
                    <p className="text-slate-600 mt-0.5">Returns true when size === 0. Disables the "Process Next Request" button and indicates all disputes have been settled.</p>
                  </div>
                </div>
              </div>

              {/* Python Implementation (For Viva) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Python Implementation (using collections.deque)</h3>
                  <button
                    onClick={() => handleCopy(`from collections import deque

class AttendanceRequestQueue:
    def __init__(self):
        self._queue = deque()

    def enqueue(self, request: dict):
        """Append to rear: O(1)"""
        self._queue.append(request)

    def dequeue(self) -> dict:
        """Pop from front (FIFO): O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._queue.popleft()

    def peek(self) -> dict:
        """Inspect front: O(1)"""
        if self.is_empty():
            return None
        return self._queue[0]

    def is_empty(self) -> bool:
        return len(self._queue) == 0

    def size(self) -> int:
        return len(self._queue)

# Demo:
q = AttendanceRequestQueue()
q.enqueue({"roll": "CSE25F145", "name": "Shahid Ali", "subject": "Data Structure"})
q.enqueue({"roll": "CSE25F146", "name": "Ahmed Khan", "subject": "Python"})

print("Next to process:", q.peek()["name"]) # Shahid Ali
processed = q.dequeue()
print("Processed:", processed["name"])       # Shahid Ali (FIFO)
print("Remaining in queue:", q.size())       # 1 (Ahmed Khan)`, 'py-queue')}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    {copiedKey === 'py-queue' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'py-queue' ? 'Copied' : 'Copy Python'}</span>
                  </button>
                </div>

                <pre className="rounded-lg bg-slate-950 p-3 font-mono text-emerald-300 overflow-x-auto text-[11px]">
{`from collections import deque

class AttendanceRequestQueue:
    def __init__(self):
        self._queue = deque()

    def enqueue(self, request):
        self._queue.append(request)    # O(1) rear insert

    def dequeue(self):
        return self._queue.popleft()   # O(1) front remove (FIFO)

    def peek(self):
        return self._queue[0] if not self.is_empty() else None

    def is_empty(self):
        return len(self._queue) == 0`}
                </pre>
              </div>

            </div>
          )}

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
                    <strong className="text-slate-900">StudentProfile.tsx:</strong> Renders the iconic student card, 7-session line chart, progress bars, and dispute submission.
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <strong className="text-slate-900">AdminDashboard.tsx:</strong> Renders live counters (120/104/16), roll table, and FIFO Queue desk.
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <strong className="text-slate-900">AttendanceCorrectionModal:</strong> Form to enqueue attendance correction requests.
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
                    <li><strong className="text-slate-800">useMemo:</strong> Optimizes search filtering, Recharts trend data, and Queue instantiation without unnecessary re-renders.</li>
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
                  <li><code>attendify_students_v2</code>: All student profiles with their enrolled subjects and historical grades.</li>
                  <li><code>attendify_attendance_v2</code>: Day-by-day attendance marked by date and roll number.</li>
                  <li><code>attendify_requests_queue_v2</code>: FIFO Queue containing pending attendance correction disputes.</li>
                  <li><code>attendify_leaves_v2</code>: Student leave applications and OD permissions.</li>
                  <li><code>attendify_session_v2</code>: Active user role (Student vs Admin) and current active student.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">PRPCEM Practical Assessment Guide · Queue (FIFO)</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 font-bold text-white hover:bg-indigo-500 transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
