import React, { useState } from 'react';
import { Student, AuthSession } from '../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  BadgeCheck, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StudentAuthProps {
  students: Student[];
  onLoginSuccess: (session: AuthSession, targetStudent?: Student) => void;
  onRegisterStudent: (newStudent: Student) => void;
  isOpen: boolean;
  onClose?: () => void;
  defaultTab?: 'login' | 'register' | 'admin';
}

export const StudentAuth: React.FC<StudentAuthProps> = ({
  students,
  onLoginSuccess,
  onRegisterStudent,
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(defaultTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [defaultTab, isOpen]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('CSE25F145');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('CSE');
  const [regYear, setRegYear] = useState('2nd Year');
  const [regCollege, setRegCollege] = useState('PRPCEM');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('ADMIN01');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Error/Success state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedId = loginIdentifier.trim().toLowerCase();
    const student = students.find(
      (s) => s.rollNo.toLowerCase() === trimmedId || s.email.toLowerCase() === trimmedId
    );

    if (!student) {
      setErrorMsg('No student found with this Roll Number or Email. Please check or register a new account.');
      return;
    }

    if (student.password && student.password !== loginPassword.trim()) {
      setErrorMsg('Incorrect password. For testing, use "password123".');
      return;
    }

    onLoginSuccess(
      {
        role: 'student',
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
      },
      student
    );
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      (adminUsername.trim().toUpperCase() === 'ADMIN01' || adminUsername.trim().toLowerCase() === 'admin@prpcem.ac.in') &&
      adminPassword.trim() === 'admin123'
    ) {
      onLoginSuccess({
        role: 'admin',
        name: 'Faculty Admin',
        email: 'admin@prpcem.ac.in',
      });
    } else {
      setErrorMsg('Invalid admin credentials. Use "ADMIN01" and password "admin123".');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regRollNo.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const existing = students.find(
      (s) => s.rollNo.toUpperCase() === regRollNo.trim().toUpperCase()
    );
    if (existing) {
      setErrorMsg(`A student with Roll Number ${regRollNo.toUpperCase()} is already registered.`);
      return;
    }

    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: regName.trim(),
      rollNo: regRollNo.trim().toUpperCase(),
      email: regEmail.trim().toLowerCase(),
      department: regDepartment,
      year: regYear,
      college: regCollege.trim() || 'PRPCEM',
      password: regPassword,
      subjects: [
        { id: `sub-${Date.now()}-1`, name: 'JavaScript', code: 'CS201', faculty: 'Prof. A. Kulkarni', attended: 16, total: 20, percentage: 80 },
        { id: `sub-${Date.now()}-2`, name: 'Data Structure', code: 'CS202', faculty: 'Dr. S. Mehta', attended: 15, total: 18, percentage: 83 },
        { id: `sub-${Date.now()}-3`, name: 'Python', code: 'CS203', faculty: 'Prof. V. Sharma', attended: 21, total: 25, percentage: 84 },
        { id: `sub-${Date.now()}-4`, name: 'IOT', code: 'CS204', faculty: 'Prof. R. Deshmukh', attended: 22, total: 25, percentage: 88 },
      ],
      overallAttendance: 84,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegisterStudent(newStudent);
    setSuccessMsg('Account created successfully! Loading your Student Profile...');

    setTimeout(() => {
      onLoginSuccess(
        {
          role: 'student',
          rollNo: newStudent.rollNo,
          name: newStudent.name,
          email: newStudent.email,
        },
        newStudent
      );
    }, 600);
  };

  const quickFillShahid = () => {
    setLoginIdentifier('CSE25F145');
    setLoginPassword('password123');
    setActiveTab('login');
  };

  const quickFillAhmed = () => {
    setLoginIdentifier('CSE25F146');
    setLoginPassword('password123');
    setActiveTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* Header Ribbon */}
        <div className="border-b border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Attendify Portal</h3>
                <p className="text-xs text-slate-500">P. R. Pote Patil College of Engineering & Management</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Demo Fill Buttons for practical examiners */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-blue-50/80 p-2 text-xs border border-blue-200">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Quick Demo:
            </span>
            <button
              type="button"
              onClick={quickFillShahid}
              className="rounded bg-blue-600 hover:bg-blue-700 px-2 py-0.5 font-bold text-white transition-colors"
            >
              Shahid Ali (86%)
            </button>
            <button
              type="button"
              onClick={quickFillAhmed}
              className="rounded bg-rose-100 hover:bg-rose-200 border border-rose-300 px-2 py-0.5 font-bold text-rose-800 transition-colors"
            >
              Ahmed Khan (64%)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="rounded bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 font-bold text-white transition-colors"
            >
              Admin Portal
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex rounded-lg border border-slate-200 bg-slate-200/70 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Student Login
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Create Account
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty Admin
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <BadgeCheck className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Student Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleStudentLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email / Roll No.
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. CSE25F145 or student email"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">Default: CSE25F145 (Shahid Ali)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">Default: password123</p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.99]"
            >
              <span>Login to Student Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-600">New student? </span>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create Account option
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Create Account (Student Registration) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Shahid Ali"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="e.g. CSE25F145"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 uppercase placeholder-slate-400 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College Email *
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@prpcem.ac.in"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department *
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="IT">IT (Information Tech)</option>
                  <option value="AI&DS">AI & Data Science</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="ENTC">ENTC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Year *
                </label>
                <select
                  value={regYear}
                  onChange={(e) => setRegYear(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College
                </label>
                <input
                  type="text"
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="PRPCEM"
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500"
              >
                <BadgeCheck className="h-4 w-4" />
                <span>Create Account → View Student Profile</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-600">Already registered? </span>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Admin Login */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Faculty & Admin Access
              </p>
              <p className="mt-1 text-slate-600 text-[11px]">
                Admins can mark attendance, inspect real-time statistics, search students, and manage leave records.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username / ID
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="ADMIN01"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500 font-mono">Demo ID: ADMIN01</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500 font-mono">Demo Password: admin123</p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Enter Admin Dashboard</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
