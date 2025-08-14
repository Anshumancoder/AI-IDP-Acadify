import type { ReactNode } from "react";

export default function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>{title}</h3>
          <button className="button ghost" onClick={onClose}>✕</button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
