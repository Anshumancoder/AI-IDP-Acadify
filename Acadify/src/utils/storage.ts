import type { Assignment, Submission, User } from "../types";

const ASSIGNMENTS_KEY = "acadify.assignments";
const SUBMISSIONS_KEY = "acadify.submissions";
const SESSION_KEY = "acadify.session";

export const Storage = {
  getAssignments(): Assignment[] {
    return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "[]");
  },
  saveAssignments(list: Assignment[]) {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(list));
  },
  addAssignment(a: Assignment) {
    const all = Storage.getAssignments();
    all.push(a);
    Storage.saveAssignments(all);
  },
  getSubmissions(): Submission[] {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]" );
  },
  saveSubmissions(list: Submission[]) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  },
  addSubmission(s: Submission) {
    const all = Storage.getSubmissions();
    all.push(s);
    Storage.saveSubmissions(all);
  },
  byAssignment(assignmentId: string): Submission[] {
    return Storage.getSubmissions().filter(s => s.assignmentId === assignmentId);
  },
  // simple session
  saveSession(u: User) { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); },
  getSession(): User | null { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } },
  clearSession() { localStorage.removeItem(SESSION_KEY); },
};
