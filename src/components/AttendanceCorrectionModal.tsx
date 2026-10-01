import React, { useState } from 'react';
import { Student, AttendanceCorrectionRequest, AttendanceStatus } from '../types';
import { getTodayDateString } from '../data/mockData';
import { 
  FileEdit, 
  Send, 
  X, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Clock
} from 'lucide-react';

interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  student: Student;
  onClose: () => void;
  onSubmitRequest: (request: AttendanceCorrectionRequest) => void;
  currentQueueSize: number;
}

export const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  isOpen,
  student,
  onClose,
  onSubmitRequest,
  currentQueueSize,
}) => {
  const [date, setDate] = useState<string>(getTodayDateString());
  const [subject, setSubject] = useState<string>('Data Structure');
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus>('Absent');
  const [requestedStatus, setRequestedStatus] = useState<AttendanceStatus>('Present');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify the exact reason for attendance correction.');
      return;
    }

    const newRequest: AttendanceCorrectionRequest = {
      id: `req-${Date.now()}`,
      rollNo: student.rollNo,
      studentName: student.name,
      department: student.department,
      date,
      subject,
      currentStatus,
      requestedStatus,
      reason: reason.trim(),
      status: 'Pending',
      submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    onSubmitRequest(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <FileEdit className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Request Attendance Correction</h3>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Queue (FIFO)
                </span>
              </div>
              <p className="text-xs text-slate-500">Submit attendance dispute for faculty review.</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Data Structure Context Banner */}
        <div className="mt-3.5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-indigo-900 space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>FIFO Attendance Queue Principle</span>
            </span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded text-indigo-700 border border-indigo-200">
              Queue Size: {currentQueueSize}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Requests are enqueued into a <strong>First In, First Out (FIFO)</strong> Queue. When faculty reviews requests, the oldest request at the <strong>Front</strong> is processed first.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          {/* Student Demographics Display */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Student Details</label>
            <div className="rounded-lg bg-slate-50 p-2.5 font-mono text-slate-800 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 font-sans">{student.name}</strong>
                <span className="text-blue-700 ml-2 font-bold">({student.rollNo})</span>
              </div>
              <span className="text-slate-500 text-[11px] font-sans">{student.department} · {student.year}</span>
            </div>
          </div>

          {/* Date & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Session Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="Data Structure">Data Structure (CS202)</option>
                <option value="JavaScript">JavaScript (CS201)</option>
                <option value="Python">Python (CS203)</option>
                <option value="IOT">IOT (CS204)</option>
              </select>
            </div>
          </div>

          {/* Current Status vs Requested Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Marked Status</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="Absent">Absent (Incorrectly Marked)</option>
                <option value="Late">Late</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Requested Status</label>
              <select
                value={requestedStatus}
                onChange={(e) => setRequestedStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:outline-none font-bold text-emerald-800"
              >
                <option value="Present">Present (Mark Correction)</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Dispute Reason / Clarification *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Was present in practical lab; roll call missed during code demo to faculty..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none placeholder-slate-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 shadow-xs transition-all active:scale-[0.99]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enqueue Request →</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
