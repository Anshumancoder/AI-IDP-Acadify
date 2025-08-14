import Modal from "../components/Modal";
import { Storage } from "../utils/storage";

export default function ViewSubmissionsModal({ assignmentId, onClose }: { assignmentId: string; onClose: () => void; }) {
  const subs = Storage.byAssignment(assignmentId);

  return (
    <Modal title="Submissions" onClose={onClose}>
      {subs.length === 0 && <div className="card">No submissions yet.</div>}

      {subs.map((s) => (
        <div className="card" key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><b>{s.studentName}</b></div>
            <div className="ass-card-muted">{new Date(s.submittedAt).toLocaleString()}</div>
          </div>

          <div style={{ marginTop: 8 }}>
            {s.files.map((f) => (
              <a key={f.name} className="file-link" href={f.dataUrl} download={f.name}>
                ⬇ {f.name}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <input
              className="input"
              type="number"
              placeholder="Score"
              defaultValue={s.score ?? ""}
              onChange={(e) => {
                const all = Storage.getSubmissions();
                const idx = all.findIndex(x => x.id === s.id);
                if (idx >= 0) {
                  all[idx].score = Number(e.target.value);
                  Storage.saveSubmissions(all);
                }
              }}
              style={{ width: 120 }}
            />
            <input
              className="input"
              placeholder="Remarks"
              defaultValue={s.remarks ?? ""}
              onBlur={(e) => {
                const all = Storage.getSubmissions();
                const idx = all.findIndex(x => x.id === s.id);
                if (idx >= 0) {
                  all[idx].remarks = e.target.value;
                  Storage.saveSubmissions(all);
                }
              }}
            />
          </div>
        </div>
      ))}
    </Modal>
  );
}
