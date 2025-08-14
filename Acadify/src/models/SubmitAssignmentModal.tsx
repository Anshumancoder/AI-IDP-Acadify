import { useState } from "react";
import Modal from "../components/Modal";
import type { Assignment } from "../types"; // Import types from your types.ts
import { Storage } from "../utils/storage"; // Assuming you have a utility to handle the storage of assignments

interface CreateAssignmentModalProps {
  onClose: () => void;
  onCreate: (assignment: Assignment) => void;
}

export default function CreateAssignmentModal({
  onClose,
  onCreate,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [allowLate, setAllowLate] = useState<boolean>(false);
  const [latePenaltyPercent, setLatePenaltyPercent] = useState<number>(0);

  const handleCreateAssignment = () => {
    if (!title || !description || !dueDate || maxMarks <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const newAssignment: Assignment = {
      id: crypto.randomUUID(), // Generate a unique ID for the new assignment
      title,
      description,
      dueDate,
      maxMarks,
      allowLate,
      latePenaltyPercent,
      createdAt: new Date().toISOString(), // Current date when the assignment is created
      teacherId: "teacher-id", // You can replace this with the actual teacher's ID
    };

    // Assuming you store the assignments somewhere
    Storage.addAssignment(newAssignment);

    // Pass the new assignment to the parent component
    onCreate(newAssignment);

    // Close the modal after creating the assignment
    onClose();
  };

  return (
    <Modal title="Create Assignment" onClose={onClose}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className="input"
          placeholder="Enter assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="input"
          placeholder="Enter assignment description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          className="input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxMarks">Max Marks</label>
        <input
          id="maxMarks"
          type="number"
          className="input"
          placeholder="Enter max marks"
          value={maxMarks}
          onChange={(e) => setMaxMarks(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="allowLate">Allow Late Submissions</label>
        <input
          id="allowLate"
          type="checkbox"
          checked={allowLate}
          onChange={() => setAllowLate(!allowLate)}
        />
      </div>

      {allowLate && (
        <div className="form-group">
          <label htmlFor="latePenaltyPercent">Late Penalty (%)</label>
          <input
            id="latePenaltyPercent"
            type="number"
            className="input"
            placeholder="Enter late penalty percentage"
            value={latePenaltyPercent}
            onChange={(e) => setLatePenaltyPercent(Number(e.target.value))}
          />
        </div>
      )}

      <div className="form-actions">
        <button className="button ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="button" onClick={handleCreateAssignment}>
          Create Assignment
        </button>
      </div>
    </Modal>
  );
}
