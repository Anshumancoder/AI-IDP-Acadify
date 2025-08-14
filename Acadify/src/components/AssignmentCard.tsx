import React, { useState } from "react";
import "./AssignmentCard.css";

// Define the structure of each submission
interface Submission {
  studentName: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  grade?: number; // Optional grade property
}

// Define the props for the AssignmentCard component
interface AssignmentCardProps {
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  allowLate: boolean;
  submissions: Submission[];
  teacherId: string;
  id: string; // Assignment ID
  latePenaltyPercent: number;
  createdAt?: string; // Optional, defaults to current date
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  description,
  dueDate,
  maxMarks,
  allowLate,
  submissions,
  latePenaltyPercent,
  createdAt = new Date().toISOString(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [grading, setGrading] = useState<Record<string, number>>({}); // Tracks grades for submissions

  // Load grades from persistent storage
  React.useEffect(() => {
    const storedGrades = JSON.parse(localStorage.getItem("grades") || "{}");
    setGrading(storedGrades);
  }, []);

  // Handle grade change for a student
  const handleGradeChange = (studentName: string, grade: number) => {
    const updatedGrades = { ...grading, [studentName]: grade };
    setGrading(updatedGrades);
    // Save grades to localStorage
    localStorage.setItem("grades", JSON.stringify(updatedGrades));
  };

  // Handle card click to toggle visibility of details
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`assignment-card ${isOpen ? "open" : ""}`}
      onClick={handleClick}
    >
      <h3>{title}</h3>
      {isOpen && (
        <div className="assignment-details">
          <p>{description}</p>
          <div className="info-row">
            <div className="info-box">Due: {dueDate}</div>
            <div className="info-box">Max: {maxMarks}</div>
            <div className="info-box">{allowLate ? "Late allowed" : "No late"}</div>
            <div className="info-box">Penalty: {latePenaltyPercent}% per day</div>
            <div className="info-box">Created: {new Date(createdAt).toLocaleDateString()}</div>
          </div>
          <h4>Submissions:</h4>
          {submissions.length > 0 ? (
            <ul>
              {submissions.map((sub, index) => (
                <li key={index} className="submission-item">
                  <div className="submission-header">
                    <strong>{sub.studentName}</strong>
                    {sub.grade !== undefined && sub.grade !== null && (
                      <span className="submission-grade">
                        Grade: {sub.grade} / {maxMarks}
                      </span>
                    )}
                  </div>

                  {/* Grade input field */}
                  <div className="grading">
                    <label htmlFor={`grade-${sub.studentName}`}>Grade: </label>
                    <input
                      id={`grade-${sub.studentName}`}
                      type="number"
                      min={0}
                      max={maxMarks}
                      value={grading[sub.studentName] || sub.grade || 0}
                      onChange={(e) => handleGradeChange(sub.studentName, parseInt(e.target.value))}
                    />
                  </div>

                  <a
                    href={sub.fileUrl}
                    download
                    className="file-link"
                    onClick={(e) => e.stopPropagation()} // Prevent click from triggering card toggle
                  >
                    📎 {sub.fileName} ({sub.fileSize})
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-submissions">No submissions yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
