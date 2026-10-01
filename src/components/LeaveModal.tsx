import React, { useState } from 'react';
import { Student, LeaveRequest } from '../types';
import { getTodayDateString } from '../data/mockData';
import { FileText, Send, X, AlertCircle } from 'lucide-react';

interface LeaveModalProps {
  isOpen: boolean;
  student: Student;
  onClose: () => void;
  onSubmitLeave: (leave: LeaveRequest) => void;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  student,
  onClose,
  onSubmitLeave,
}) => {
  const [type, setType] = useState<'Medical' | 'Personal' | 'Academic OD'>('Medical');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify the valid reason or medical ailment.');
      return;
    }

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      rollNo: student.rollNo,
      studentName: student.name,
      department: student.department,
      type,
      startDate,
      endDate,
      reason: reason.trim(),
      status: 'Pending',
      submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    onSubmitLeave(newLeave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Submit Attendance Condonation / Leave</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Student Details</label>
            <div className="rounded-lg bg-slate-50 p-2.5 font-mono text-slate-700 border border-slate-200">
              <span className="font-bold text-slate-900">{student.name}</span> ({student.rollNo}) · {student.department}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Leave Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Medical">Medical Leave (Viral, hospitalization, doctor advice)</option>
              <option value="Academic OD">Academic On-Duty (OD) (Hackathon, Technical Conference)</option>
              <option value="Personal">Personal Leave / Emergency</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Reason / Medical Notes</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State reason, hospital or event name..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none placeholder-slate-400"
            />
          </div>

          <div className="rounded-lg bg-indigo-50/70 p-2.5 text-indigo-900 border border-indigo-200 text-[11px]">
            * Note: Approved leaves update faculty attendance rolls in the Admin portal automatically upon approval.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit to Faculty</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
