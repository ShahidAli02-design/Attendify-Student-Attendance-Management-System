export interface SubjectAttendance {
  id: string;
  name: string;
  code: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: string;
  college: string;
  password?: string;
  avatarUrl?: string;
  subjects: SubjectAttendance[];
  overallAttendance: number;
  phone?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface DailyAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  rollNo: string;
  studentName: string;
  subject: string;
  status: AttendanceStatus;
  markedAt: string;
  markedBy: string;
}

export interface LeaveRequest {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  type: 'Medical' | 'Personal' | 'Academic OD';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  remarks?: string;
}

export type UserRole = 'student' | 'admin' | null;

export interface AuthSession {
  role: UserRole;
  rollNo?: string;
  name?: string;
  email?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
}
