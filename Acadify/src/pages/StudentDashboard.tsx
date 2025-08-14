import { useEffect, useState } from "react";
import type { Assignment, Submission, User } from "../types";
import { Storage } from "../utils/storage";
import "./studentDashboard.css";

export default function StudentDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [grades, setGrades] = useState<Record<string, Record<string, number>>>({}); // Track grades

  // Load assignments, submissions, and grades
  useEffect(() => {
    setAssignments(Storage.getAssignments());
    setSubmissions(Storage.getSubmissions());
    const storedGrades = JSON.parse(localStorage.getItem("grades") || "{}");
    setGrades(storedGrades);
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handler = () => {
      setAssignments(Storage.getAssignments());
      setSubmissions(Storage.getSubmissions());
      const storedGrades = JSON.parse(localStorage.getItem("grades") || "{}");
      setGrades(storedGrades);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const submitAssignment = (assignment: Assignment) => {
    if (!file || !assignment) return alert("Please select a file");

    const reader = new FileReader();
    reader.onload = () => {
      const newSubmission: Submission = {
        id: crypto.randomUUID(),
        assignmentId: assignment.id,
        studentId: user.id,
        studentName: user.name,
        fileName: file.name,
        fileData: reader.result as string, // store as base64
        submittedAt: new Date().toISOString(),
        files: [
          {
            name: file.name,
            dataUrl: reader.result as string,
            size: file.size,
            type: file.type,
            data: reader.result as string,
          }
        ],
      };

      Storage.addSubmission(newSubmission);
      setSubmissions(Storage.getSubmissions());
      setFile(null);
      setSelectedAssignment(null);
    };
    reader.readAsDataURL(file);
  };

  const getTimeRemaining = (dueDate: string) => {
    const timeDiff = new Date(dueDate).getTime() - new Date().getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysRemaining < 0) return "Due date passed";
    if (daysRemaining === 0) return "Due tomorrow";
    return `${daysRemaining} days remaining`;
  };

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          Acadify Tracker
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge">{user.name} • Student</span>
          <button className="button ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <h2>Student Dashboard</h2>

      <div className="status-cards">
        <div className="status-card">
          <div className="status-title">Total Assignments</div>
          <div className="status-value">{assignments.length}</div>
        </div>
        <div className="status-card">
          <div className="status-title">Total Submissions</div>
          <div className="status-value">{submissions.length}</div>
        </div>
      </div><br></br>

            <p style={{ fontSize: "40px" }}>Assignments:</p>

      <div className="grid assignments">
        {assignments.map((a) => {
          const hasSubmitted = submissions.some(
            (s) => s.assignmentId === a.id && s.studentId === user.id
          );
          const timeRemaining = getTimeRemaining(a.dueDate);
          const grade = grades[a.id]?.[user.id]; // Retrieve grade from storage

          return (
            <div key={a.id} className="card">
              <h3
                className="assignment-title"
                onClick={() => setSelectedAssignment(selectedAssignment?.id === a.id ? null : a)}
              >
                {a.title}
              </h3>

              <div
                className={`assignment-details ${selectedAssignment?.id === a.id ? "show" : ""}`}
              >
                <p>{a.description}</p>
                <p>Due: {a.dueDate}</p>
                <div className={`time-remaining ${timeRemaining === "Due tomorrow" ? "due-tomorrow" : ""}`}>
                  {timeRemaining}
                </div>

                {!hasSubmitted ? (
                  <div>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <button
                      className="button"
                      onClick={() => submitAssignment(a)} // Submit the selected assignment
                    >
                      Submit Assignment
                    </button>
                  </div>
                ) : (
                  <span style={{ marginTop: "50px" }} className="badge">
                    Submitted
                  </span>
                )}

                {/* Display grade if it exists */}
                {hasSubmitted && grade !== undefined && (
                  <div style={{ marginTop: "20px" }}>
                    <p className="badge">Grade: {grade} / {a.maxMarks}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

