import { useEffect, useState } from "react";
import type { Assignment, Submission, User } from "../types";
import { Storage } from "../utils/storage";
import "./TeacherDashboard.css";

export default function TeacherDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);  // For the Create Assignment Modal
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [grade, setGrade] = useState<number | string>("");
  const [newAssignment, setNewAssignment] = useState<Assignment>({
    title: "",
    description: "",
    dueDate: "",
    maxMarks: 100,
    id: "",
    allowLate: false,
    latePenaltyPercent: 0,
    createdAt: "",
    teacherId: user.id,
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAssignments(Storage.getAssignments());
    const allSubmissions = Storage.getSubmissions() || [];
    const grouped: Record<string, Submission[]> = {};
    allSubmissions.forEach(sub => {
      if (!grouped[sub.assignmentId]) grouped[sub.assignmentId] = [];
      grouped[sub.assignmentId].push(sub);
    });
    setSubmissions(grouped);
  };

  const handleGradeSubmission = (assignmentId: string, submissionId: string, grade: number) => {
    const updatedSubmissions = submissions[assignmentId].map(sub => {
      if (sub.id === submissionId) {
        sub.grade = grade;
      }
      return sub;
    });

    setSubmissions({
      ...submissions,
      [assignmentId]: updatedSubmissions,
    });

    // Optionally, you can store the updated submissions back into storage
    Storage.saveSubmissions(updatedSubmissions);
    setGrade(""); // Reset grade input field
  };

  const openGradingModal = (assignmentId: string, submissionId: string) => {
    setSelectedAssignmentId(assignmentId);
    setSelectedSubmissionId(submissionId);
    setGrade(""); // Reset grade input field
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCreateModal(false);  // Close the Create Assignment modal
  };

  const openCreateAssignmentModal = () => {
    setCreateModal(true);
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      const newId = crypto.randomUUID();  // Generate a unique ID for the new assignment
      const assignmentToCreate = { ...newAssignment, id: newId };
      Storage.addAssignment(assignmentToCreate);
      setAssignments(Storage.getAssignments());
      closeModal();
    } else {
      alert("Please provide a title and due date for the assignment.");
    }
  };

  // Calculate total assignments and total graded assignments
  const totalAssignments = assignments.length;
  const totalGradedAssignments = Object.values(submissions).flat().filter(sub => sub.grade !== undefined).length;

  return (
    <div className="container">
      <div className="header">
        <div className="brand">Acadify Tracker</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge">{user.name} • Teacher</span>
          <button className="button ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <h2>Teacher Dashboard</h2>

      {/* Stats Cards */}
      <div className="status-cards">
        <div className="status-card">
          <div className="status-title">Total Assignments</div>
          <div className="status-value">{totalAssignments}</div>
        </div>
        <div className="status-card">
          <div className="status-title">Assignments Graded</div>
          <div className="status-value">{totalGradedAssignments}</div>
        </div>
      </div>

      {/* Create Assignment Button */}
      <button style={{ width: "200px", textAlign: "left"}} className="button" onClick={openCreateAssignmentModal}>Create Assignment</button>

      <h3>Assignments</h3>

      <div className="grid assignments">
        {assignments.map((assignment) => {
          const submissionList = submissions[assignment.id] || [];
          return (
            <div key={assignment.id} className="card">
              <h3
                className="assignment-title"
                onClick={() => setSelectedAssignmentId(selectedAssignmentId === assignment.id ? null : assignment.id)}
              >
                {assignment.title}
              </h3>

              <div className={`assignment-details ${selectedAssignmentId === assignment.id ? "show" : ""}`}>
                <p>{assignment.description}</p>
                <p>Due: {assignment.dueDate}</p>
                <div className="time-remaining">{submissionList.length} Submissions</div>

                {submissionList.length > 0 && (
                  <div>
                    {submissionList.map(sub => (
                      <div key={sub.id} className="submission-item">
                        <p><strong>{sub.studentName}</strong> - {sub.fileName}</p>
                        <p>Status: {sub.grade === undefined ? "Not Graded" : `Graded: ${sub.grade}`}</p>
                        <button
                          style={{textAlign: "center", alignItems: "center"}}
                          id="submission-grade-button"
                          className="button ghost"
                          onClick={() => openGradingModal(assignment.id, sub.id)}
                        >
                          Grade
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grading Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Grading Submission</h3>
              <button className="close-button" onClick={closeModal}>X</button>
            </div>
            <input
              type="number"
              placeholder="Enter Grade"
              value={grade}
              onChange={e => setGrade(e.target.value)}
              min={0}
              max={100}
            />
            <button
              className="button"
              onClick={() => handleGradeSubmission(selectedAssignmentId!, selectedSubmissionId!, Number(grade))}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {createModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Create Assignment</h3>
              <button className="close-button" onClick={closeModal}>X</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              />
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max Marks"
                value={newAssignment.maxMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
              />
              <button className="button" onClick={handleCreateAssignment}>Create Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
