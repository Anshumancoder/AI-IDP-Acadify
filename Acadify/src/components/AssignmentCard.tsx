import React, { useState } from "react";
import "./AssignmentCard.css";

// Define the structure of each submission
interface Submission {
  studentName: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
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
  createdAt = new Date().toISOString(), // Default to current date if not provided
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`assignment-card ${isOpen ? "open" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
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
            <div className="info-box">Created At: {createdAt}</div>
          </div>
          <h4>Submissions:</h4>
          <ul>
            {submissions.map((sub, index) => (
              <li key={index}>
                <strong>{sub.studentName}</strong>
                <br />
                <a
                  href={sub.fileUrl}
                  download
                  className="file-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  📎 {sub.fileName} ({sub.fileSize})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
