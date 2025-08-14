export default function RoleToggle({
  role,
  setRole,
}: {
  role: "student" | "teacher";
  setRole: (r: "student" | "teacher") => void;
}) {
  return (
    <div className="role-switch">
      <button className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>Student</button>
      <button className={role === "teacher" ? "active" : ""} onClick={() => setRole("teacher")}>Teacher</button>
    </div>
  );
}
