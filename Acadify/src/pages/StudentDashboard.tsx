import { useEffect, useState } from "react";
import type { Assignment, Submission, User } from "../types";
import { Storage } from "../utils/storage";

export default function StudentDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Load assignments & submissions
  useEffect(() => {
    setAssignments(Storage.getAssignments());
    setSubmissions(Storage.getSubmissions());
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handler = () => {
      setAssignments(Storage.getAssignments());
      setSubmissions(Storage.getSubmissions());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const submitAssignment = () => {
    if (!file || !selectedAssignment) return alert("Please select a file");

    const reader = new FileReader();
    reader.onload = () => {
      const newSubmission: Submission = {
        id: crypto.randomUUID(),
        assignmentId: selectedAssignment.id,
        studentId: user.id,
        studentName: user.name,
        fileName: file.name,
        fileData: reader.result as string, // store as base64
        submittedAt: new Date().toISOString(),
        files: [ // Add the files property as required by the Submission type
          {
            name: file.name,
            dataUrl: reader.result as string,
            size: file.size,
            type: file.type,
            data: reader.result as string, // optional, can be included if needed
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

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <img src="/favicon.svg" width="24" alt="logo" /> Acadify Tracker
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge">{user.name} • Student</span>
          <button className="button ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <h2>Student Dashboard</h2>

      <div className="grid assignments">
        {assignments.map(a => {
          const hasSubmitted = submissions.some(
            s => s.assignmentId === a.id && s.studentId === user.id
          );

          return (
            <div key={a.id} className="card">
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <p>Due: {a.dueDate}</p>

              {!hasSubmitted ? (
                <button
                  className="button"
                  onClick={() => setSelectedAssignment(a)}
                >
                  Submit Assignment
                </button>
              ) : (
                <span className="badge">Submitted</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for submission */}
      {selectedAssignment && (
        <div className="modal">
          <div className="modal-content">
            <h3>Submit: {selectedAssignment.title}</h3>
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="button" onClick={submitAssignment}>
                Submit
              </button>
              <button className="button ghost" onClick={() => setSelectedAssignment(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
