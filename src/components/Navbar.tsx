import React from 'react';
import { AuthSession, Student } from '../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  Code2, 
  LogOut, 
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  session: AuthSession;
  currentStudent: Student | null;
  onSwitchRole: (role: 'student' | 'admin') => void;
  onOpenAuth: () => void;
  onOpenVivaModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  currentStudent,
  onSwitchRole,
  onOpenAuth,
  onOpenVivaModal,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Logo & College Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">Attendify</span>
              <span className="hidden rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-indigo-700 border border-indigo-200 sm:inline-block">
                PRPCEM
              </span>
            </div>
            <p className="text-xs text-slate-500">Student Attendance Management System</p>
          </div>
        </div>

        {/* Quick Role Switcher & Practical Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Viva Practical Guide Button */}
          <button
            onClick={onOpenVivaModal}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-900"
            title="Practical Exam & Viva Concept Guide"
          >
            <Code2 className="h-4 w-4 text-indigo-600" />
            <span className="hidden md:inline">Viva Concepts Guide</span>
            <span className="md:hidden">Viva</span>
          </button>

          {/* Role Indicator & Quick Switcher */}
          {session.role ? (
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1">
              <button
                onClick={() => onSwitchRole('student')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  session.role === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Student</span>
              </button>
              <button
                onClick={() => onSwitchRole('admin')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  session.role === 'admin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-500"
            >
              Sign In
            </button>
          )}

          {/* User profile / Log out */}
          {session.role && (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
              <div className="hidden text-right lg:block">
                <p className="text-xs font-bold text-slate-800">
                  {session.role === 'admin' ? 'Faculty Admin' : (currentStudent?.name || session.name || 'Shahid Ali')}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {session.role === 'admin' ? 'PRPCEM Staff' : (currentStudent?.rollNo || session.rollNo || 'CSE25F145')}
                </p>
              </div>

              <button
                onClick={onOpenAuth}
                title="Switch Account / Sign In"
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset demo data to initial state"
            className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
