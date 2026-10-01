import React, { useState } from 'react';
import { Student } from '../types';
import { downloadStudentCardPNG } from '../utils/downloadCard';
import { Download, Printer, X, CheckCircle2, AlertTriangle, GraduationCap, ShieldCheck } from 'lucide-react';

interface CardPreviewModalProps {
  isOpen: boolean;
  student: Student;
  onClose: () => void;
}

export const CardPreviewModal: React.FC<CardPreviewModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isEligible = student.overallAttendance >= 75;

  const handleDownload = () => {
    downloadStudentCardPNG(student);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Official Student Attendance Card</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable/Exportable Card Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-md overflow-hidden" id="printable-card">
            
            {/* Card Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700 font-extrabold text-xl shadow-xs">
                    PR
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight">
                      P. R. POTE PATIL COLLEGE OF ENGINEERING & MANAGEMENT
                    </h2>
                    <p className="text-[11px] text-blue-100 font-medium">
                      Autonomous Institute · Affiliated to University · Amravati, Maharashtra
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-blue-600/60 pt-2 text-[11px] font-mono text-amber-200 font-semibold">
                <span>OFFICIAL ATTENDANCE RECORD</span>
                <span>ACADEMIC YEAR 2025-26</span>
              </div>
            </div>

            {/* Student Bio & Summary */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-2xl shadow-xs">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                    <p className="font-mono text-xs font-bold text-blue-700">Roll No: {student.rollNo}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {student.department} · {student.year} · {student.college}
                    </p>
                  </div>
                </div>

                <div className={`rounded-xl p-3.5 text-right border ${
                  isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <span className="text-[11px] font-bold text-slate-600 block uppercase">Overall Attendance</span>
                  <span className={`text-3xl font-black font-mono ${
                    isEligible ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {student.overallAttendance}%
                  </span>
                  <span className={`block text-[11px] font-bold ${
                    isEligible ? 'text-emerald-800' : 'text-rose-800'
                  }`}>
                    {isEligible ? '✓ Eligible for Exams' : '⚠️ Shortage Notice'}
                  </span>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Subject-Wise Attendance Details
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Code</th>
                        <th className="py-2.5 px-3">Faculty</th>
                        <th className="py-2.5 px-3 text-center">Attended/Total</th>
                        <th className="py-2.5 px-3 text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {student.subjects.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/60">
                          <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{sub.code}</td>
                          <td className="py-2 px-3 text-slate-600">{sub.faculty}</td>
                          <td className="py-2 px-3 font-mono text-center text-slate-700">{sub.attended}/{sub.total}</td>
                          <td className={`py-2 px-3 text-right font-mono font-bold ${
                            sub.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {sub.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card Footer Signature & Seal */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">Digital Seal of Examination Section</p>
                  <p>Certified by Attendify PRPCEM</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Dr. S. R. Deshmukh</p>
                  <p className="text-[10px]">Dean of Academics</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            {downloadSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Card downloaded successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG Card</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
