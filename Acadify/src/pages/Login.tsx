import { useState } from "react";
import { PRESET_USERS } from "../data/users";
import type { User } from "../types";
import "./login.css";

export default function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher">("student");

  const handleLogin = () => {
    const match = PRESET_USERS.find(
      (u) => u.email === email && u.password === pw
    );

    if (!match) {
      setError("Invalid credentials");
      return;
    }

    onLogin(match);
  };

  return (
    <div className="login-wrap">
      <div className="center">
        <div className="brand">
          <div className="heading">Acadify Tracker</div>
        </div>
      </div>

      {/* User Type Toggle */}
      <div className="user-toggle">
        <button
          className={userType === "student" ? "active" : ""}
          onClick={() => setUserType("student")}
        >
          Student
        </button>
        <button
          className={userType === "teacher" ? "active" : ""}
          onClick={() => setUserType("teacher")}
        >
          Teacher
        </button>
      </div>

      {/* Email and Password Inputs */}
      <div className="label">Email Address</div><br></br>
      <input
        className="input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="label" style={{ marginTop: 10 }}>
        Password
      </div><br></br>
      <input
        className="input"
        type="password"
        placeholder="Enter your password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />

      {error && <div className="error">{error}</div>}<br></br>

      <div>
        <button className="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>

      {/* Getting Started Card */}
      <div className="card">
        <div className="label"> Use the preset accounts: </div>
        <div className="ass-card-muted"><br />
          Teacher: <b>teacher@acadify.com</b> / <b>teacher123</b><br />
          Student: <b>student@acadify.com</b> / <b>student123</b>
        </div>
      </div>
    </div>
  );
}
