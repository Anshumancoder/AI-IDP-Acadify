export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  class?: string;
  childId?: string; // For parents
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  teacherId: string;
  teacherName: string;
  allowLateSubmission: boolean;
  createdAt: string;
  attachments?: FileAttachment[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  content: string;
  attachments: FileAttachment[];
  submittedAt: string;
  isLate: boolean;
  score?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  data: string; // Base64 encoded data
  size: number;
}

export interface EduScore {
  studentId: string;
  studentName: string;
  studentClass: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  assignmentsCompleted: number;
  averageScore: number;
}