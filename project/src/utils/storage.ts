import { User, Assignment, Submission, EduScore } from '../types';

// Predefined users
const PREDEFINED_USERS: User[] = [
  // Students
  { id: 's1', name: 'P Kashyap', email: 'kashyap@student.edu', role: 'student', class: 'X Fire' },
  { id: 's2', name: 'Edin George', email: 'edin@student.edu', role: 'student', class: 'X Air' },
  { id: 's3', name: 'Evaan B', email: 'evaan@student.edu', role: 'student', class: 'X Water' },
  
  // Teachers
  { id: 't1', name: 'Sharmistha Mukherjee', email: 'sharmistha@teacher.edu', role: 'teacher', class: 'X Fire' },
  { id: 't2', name: 'Latha Shree', email: 'latha@teacher.edu', role: 'teacher', class: 'X Air' },
  { id: 't3', name: 'Kavita Sharma', email: 'kavita@teacher.edu', role: 'teacher', class: 'X Water' },
  
  // Parents
  { id: 'p1', name: 'Kashyap Parent', email: 'kashyap.parent@parent.edu', role: 'parent', childId: 's1' },
  { id: 'p2', name: 'George Parent', email: 'george.parent@parent.edu', role: 'parent', childId: 's2' },
  { id: 'p3', name: 'B Parent', email: 'b.parent@parent.edu', role: 'parent', childId: 's3' },
];

export const initializeData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(PREDEFINED_USERS));
  }
  
  // Initialize assignments if not exists
  if (!localStorage.getItem('assignments')) {
    localStorage.setItem('assignments', JSON.stringify([]));
  }
  
  // Initialize submissions if not exists
  if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : PREDEFINED_USERS;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getAssignments = (): Assignment[] => {
  const assignments = localStorage.getItem('assignments');
  return assignments ? JSON.parse(assignments) : [];
};

export const saveAssignment = (assignment: Assignment) => {
  const assignments = getAssignments();
  const existingIndex = assignments.findIndex(a => a.id === assignment.id);
  
  if (existingIndex >= 0) {
    assignments[existingIndex] = assignment;
  } else {
    assignments.push(assignment);
  }
  
  localStorage.setItem('assignments', JSON.stringify(assignments));
};

export const getSubmissions = (): Submission[] => {
  const submissions = localStorage.getItem('submissions');
  return submissions ? JSON.parse(submissions) : [];
};

export const saveSubmission = (submission: Submission) => {
  const submissions = getSubmissions();
  const existingIndex = submissions.findIndex(s => s.id === submission.id);
  
  if (existingIndex >= 0) {
    submissions[existingIndex] = submission;
  } else {
    submissions.push(submission);
  }
  
  localStorage.setItem('submissions', JSON.stringify(submissions));
};

export const calculateEduScores = (): EduScore[] => {
  const submissions = getSubmissions();
  const assignments = getAssignments();
  const students = getUsers().filter(u => u.role === 'student');
  
  return students.map(student => {
    const studentSubmissions = submissions.filter(s => s.studentId === student.id && s.score !== undefined);
    const totalScore = studentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    const assignmentsCompleted = studentSubmissions.length;
    const maxPossibleScore = studentSubmissions.reduce((sum, s) => {
      const assignment = assignments.find(a => a.id === s.assignmentId);
      return sum + (assignment?.maxScore || 0);
    }, 0);
    
    const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    const averageScore = assignmentsCompleted > 0 ? totalScore / assignmentsCompleted : 0;
    
    return {
      studentId: student.id,
      studentName: student.name,
      studentClass: student.class || '',
      totalScore,
      maxPossibleScore,
      percentage,
      assignmentsCompleted,
      averageScore
    };
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};