export default function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
  return (
    <div className="card kpi">
      <div className="icon">{icon ?? "📘"}</div>
      <div>
        <div className="label">{label}</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
      </div>
    </div>
  );
}
