// Role type to handle roles more flexibly
export type Role = "teacher" | "student";

export interface User {
  id: string;
  role: Role;
  email: string;
  password: string;
  name: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string (yyyy-mm-dd)
  maxMarks: number;
  allowLate: boolean;
  latePenaltyPercent: number; // per day
  createdAt: string; // ISO
  teacherId: string; // ID of the teacher who created this assignment
}

export interface SubmissionFile {
  name: string;
  dataUrl: string; // base64 Data URL
  size: number; // bytes
  type: string; // mime
  data?: string; // Optional base64 data for the file (if you need both)
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  files: SubmissionFile[];
  score?: number; // Optional, might be set after grading
  remarks?: string; // Optional, feedback or comments from teacher
  content?: string; // Optional, for text-based submissions
  marks?: number | null; // Marks for grading, can be null initially
  feedback?: string | null; // Feedback for the student
  fileUrl?: string; // Optional URL for file download
  fileName?: string; // Optional name for the file to be downloaded
  fileData?: string; // Optional base64 data for the file (if needed)
  submissionDate?: string; // Optional submission date (if different from submittedAt)
}
