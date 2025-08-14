import { useEffect, useMemo, useState } from "react";
import type { Assignment, User } from "../types";
import { Storage } from "../utils/storage";
import AssignmentCard from "../components/AssignmentCard";
import SubmitAssignmentModal from "./SubmitAssignmentModal";
import StatCard from "../components/StatCard";
import './CreateAssignmentModal.css'

export default function StudentDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>(Storage.getAssignments());
  const [submitFor, setSubmitFor] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setAssignments(Storage.getAssignments());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const stats = useMemo(() => {
    const subs = Storage.getSubmissions().filter(s => s.studentId === user.id);
    const completed = subs.length;
    const pending = Math.max(assignments.length - completed, 0);
    const avg = subs.length
      ? Math.round(subs.reduce((a, s) => a + (s.score ?? 0), 0) / subs.length)
      : 0;
    return { total: assignments.length, completed, pending, avg };
  }, [assignments, user.id]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand"><img src="/favicon.svg" width="24" /> Acadify Tracker</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge">{user.name} • Student</span>
          <button className="button ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <h2 style={{ margin: "6px 0 8px" }}>Student Dashboard</h2>
      <div className="ass-card-muted">Welcome back, {user.name.split(" ")[0]}!</div>

      <div className="grid stats" style={{ marginTop: 16 }}>
        <StatCard label="Total Assignments" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Average Score" value={`${stats.avg}%`} />
      </div>

      {/* Overdue banner approximation */}
      <div className="card warn" style={{ marginTop: 16 }}>
        You might have overdue assignments. Please submit as soon as possible to avoid penalties.
      </div>

      <h3 style={{ margin: "18px 0 8px" }}>Pending Assignments</h3>
      <div className="grid assignments">
        {assignments.map((a) => (
          <AssignmentCard
            key={a.id}
            a={a} 
            footer={
              <button className="button" onClick={() => setSubmitFor(a.id)}>⬆ Submit Assignment</button>
            }       NNN   
          />
        ))}
        {assignments.length === 0 && <div className="card">No assignments yet.</div>}
      </div>

      {submitFor && <SubmitAssignmentModal assignmentId={submitFor} student={user} onClose={() => setSubmitFor(null)} />}
    </div>
  );
}
