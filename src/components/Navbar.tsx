import React from 'react';
import { AuthSession, Student } from '../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  Code2, 
  LogOut, 
  RotateCcw,
  Home,
  LayoutDashboard
} from 'lucide-react';

export type ActiveView = 'college-dashboard' | 'admin-dashboard' | 'student-profile';

interface NavbarProps {
  session: AuthSession;
  activeView: ActiveView;
  currentStudent: Student | null;
  onSelectView: (view: ActiveView) => void;
  onOpenAuth: (tab?: 'login' | 'register' | 'admin') => void;
  onOpenVivaModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  activeView,
  currentStudent,
  onSelectView,
  onOpenAuth,
  onOpenVivaModal,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Logo & College Branding */}
        <div 
          onClick={() => onSelectView('college-dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to College Landing Dashboard"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Attendify
              </span>
              <span className="hidden rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-indigo-700 border border-indigo-200 sm:inline-block">
                PRPCEM
              </span>
            </div>
            <p className="text-xs text-slate-500">Student Attendance Management System</p>
          </div>
        </div>

        {/* 3 Main View Tabs: College Portal | Admin Dashboard | Student Profile */}
        <div className="hidden lg:flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
          <button
            onClick={() => onSelectView('college-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'college-dashboard'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>College Portal</span>
          </button>

          <button
            onClick={() => onSelectView('admin-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'admin-dashboard'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Admin Dashboard</span>
          </button>

          <button
            onClick={() => onSelectView('student-profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'student-profile'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Student Profile</span>
          </button>
        </div>

        {/* Action Controls & Small Screen Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile view dropdown or quick toggle */}
          <div className="lg:hidden flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => onSelectView('college-dashboard')}
              title="College Portal"
              className={`p-1.5 rounded-md ${activeView === 'college-dashboard' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              <Home className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectView('admin-dashboard')}
              title="Admin Dashboard"
              className={`p-1.5 rounded-md ${activeView === 'admin-dashboard' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
            >
              <ShieldCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectView('student-profile')}
              title="Student Profile"
              className={`p-1.5 rounded-md ${activeView === 'student-profile' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              <UserCheck className="h-4 w-4" />
            </button>
          </div>

          {/* Viva Practical Guide Button */}
          <button
            onClick={onOpenVivaModal}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-900"
            title="Practical Exam & Viva Concept Guide"
          >
            <Code2 className="h-4 w-4 text-indigo-600" />
            <span className="hidden md:inline">Viva Guide</span>
          </button>

          {/* User Sign In / Account Info */}
          {session.role ? (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
              <div className="hidden text-right xl:block">
                <p className="text-xs font-bold text-slate-800">
                  {session.role === 'admin' ? 'Faculty Admin' : (currentStudent?.name || session.name || 'Shahid Ali')}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {session.role === 'admin' ? 'PRPCEM Staff' : (currentStudent?.rollNo || session.rollNo || 'CSE25F145')}
                </p>
              </div>

              <button
                onClick={() => onOpenAuth('login')}
                title="Switch Account"
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition-colors"
            >
              Sign In
            </button>
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
