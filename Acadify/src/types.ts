import AssignmentCard from "./components/AssignmentCard";

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
  data?: string; // optional base64 data for the file
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  files: SubmissionFile[];
  score?: number;
  remarks?: string;
  content?: string; // optional content for text submissions
  marks?: null; // optional marks for grading
  feedback?: null; // optional feedback from teacher
  fileUrl?: string; // optional URL for file download
  fileName?: string; // optional name for the file
  fileData?: string; // optional base64 data for the file
  submissions?: string; // optional date of submission
}
