import Modal from "../components/Modal";
import type { Submission, SubmissionFile, User } from "../types";
import { Storage } from "../utils/storage";
import { useState } from "react";

export default function SubmitAssignmentModal({
  assignmentId,
  student,
  onClose,
}: {
  assignmentId: string;
  student: User;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<SubmissionFile[]>([]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files;
    if (!fl || fl.length === 0) return;
    const arr: SubmissionFile[] = [];
    for (const f of Array.from(fl)) {
      const dataUrl = await fileToDataUrl(f);
      arr.push({ name: f.name, dataUrl, size: f.size, type: f.type });
    }
    setFiles(arr);
  };

  const submit = () => {
    if (files.length === 0) return;
    const s: Submission = {
      id: crypto.randomUUID(),
      assignmentId,
      studentId: student.id,
      studentName: student.name,
      submittedAt: new Date().toISOString(),
      files,
    };
    Storage.addSubmission(s);
    onClose();
  };

  return (
    <Modal title="Submit Assignment" onClose={onClose}>
      <div className="card">
        <div className="label">Upload Files</div>
        <input className="file" type="file" multiple onChange={onFileChange} />
        {files.map((f) => (
          <div key={f.name} className="ass-card-muted">{f.name} ({Math.round(f.size / 1024)} KB)</div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button className="button ghost" onClick={onClose}>Cancel</button>
        <button className="button" onClick={submit}>Submit Assignment</button>
      </div>
    </Modal>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}
