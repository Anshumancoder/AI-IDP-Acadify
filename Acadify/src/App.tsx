import type { User } from "./types";
import { useState } from "react";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === "teacher") {
    return (
      <TeacherDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <StudentDashboard
      user={currentUser}
      onLogout={handleLogout}
    />
  );
}
