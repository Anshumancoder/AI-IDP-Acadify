import { useEffect, useState } from "react";
import type {Assignment, User, Submission } from "../types";
import { Storage } from "../utils/storage";
import AssignmentCard from "../components/AssignmentCard";

export default function TeacherDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const handler = () => refreshData();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const refreshData = () => {
    setAssignments(Storage.getAssignments());
    const allSubs = Storage.getSubmissions() || [];
    const grouped: Record<string, Submission[]> = {};
    allSubs.forEach(sub => {
      if (!grouped[sub.assignmentId]) grouped[sub.assignmentId] = [];
      grouped[sub.assignmentId].push(sub);
    });
    setSubmissions(grouped);
  };

  const createAssignment = () => {
    if (!title.trim() || !dueDate.trim()) return alert("Please fill all fields");

    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      title,
      description: desc,
      dueDate,
      teacherId: user.id,
      maxMarks: 100,
      allowLate: false,
      latePenaltyPercent: 0,
      createdAt: new Date().toISOString(),
    };

    Storage.addAssignment(newAssignment);
    refreshData();
    setTitle("");
    setDesc("");
    setDueDate("");
    setShowModal(false);
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/favicon.svg" width="28" alt="logo" />
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Acadify Tracker</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={badgeStyle}>{user.name} • Teacher</span>
          <button style={ghostButton} onClick={onLogout}>Logout</button>
        </div>
      </div>

      <button style={mainButton} onClick={() => setShowModal(true)}>+ Create Assignment</button>

      {showModal && (
        <div style={modalBackdropStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: 10 }}>Create New Assignment</h3>
            <input
              style={inputStyle}
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              style={{ ...inputStyle, height: "80px" }}
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <input
              style={inputStyle}
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button style={mainButton} onClick={createAssignment}>Create</button>
              <button style={ghostButton} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>All Assignments</h3>
      <div style={gridStyle}>
        {assignments.map(a => (
          <div key={a.id} style={{ background: "#1e1e1e", borderRadius: "8px", padding: "10px" }}>
            <AssignmentCard
              id={a.id}
              title={a.title}
              description={a.description}
              dueDate={a.dueDate}
              teacherId={a.teacherId}
              maxMarks={a.maxMarks}
              allowLate={a.allowLate}
              latePenaltyPercent={a.latePenaltyPercent}
              createdAt={a.createdAt}
              submissions={(submissions[a.id] || []).map((s) => ({
                studentName: s.studentName,
                fileName: s.files && s.files[0] ? s.files[0].name : "",
                fileUrl: s.files && s.files[0] ? s.files[0].dataUrl : "",
                fileSize: s.files && s.files[0] ? ((s.files[0].size / 1024).toFixed(1) + " KB") : "0 KB",
              }))}
            />

            <h4 style={{ marginTop: "10px" }}>Submissions:</h4>
            {submissions[a.id] && submissions[a.id].length > 0 ? (
              <ul>
                {submissions[a.id].map((s, i) => (
                  <li key={i} style={{ fontSize: "0.9rem", margin: "6px 0" }}>
                    <strong>{s.studentName}</strong>
                    {s.files && s.files.length > 0 ? (
                      <ul style={{ marginTop: 4 }}>
                        {s.files.map((f, idx) => (
                          <li key={idx}>
                            <a
                              href={f.dataUrl}
                              download={f.name}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#4CAF50" }}
                            >
                              📎 {f.name} ({(f.size / 1024).toFixed(1)} KB)
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "0.85rem", color: "#aaa" }}>No files</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "#aaa" }}>No submissions yet.</p>
            )}
          </div>
        ))}
        {assignments.length === 0 && <div style={emptyCard}>No assignments yet.</div>}
      </div>
    </div>
  );
}

/* Styles remain same as your original */
const containerStyle: React.CSSProperties = {
  background: "#121212",
  color: "#fff",
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "Arial, sans-serif"
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px"
};

const badgeStyle: React.CSSProperties = {
  background: "#1f1f1f",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "0.9rem"
};

const mainButton: React.CSSProperties = {
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const ghostButton: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #555",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};

const modalBackdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  background: "#1e1e1e",
  padding: 20,
  borderRadius: 8,
  width: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
};

const inputStyle: React.CSSProperties = {
  background: "#2a2a2a",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "6px",
  padding: "8px",
  marginBottom: "10px",
  width: "100%"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "15px",
  marginTop: "10px"
};

const emptyCard: React.CSSProperties = {
  background: "#1e1e1e",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  color: "#aaa"
};
