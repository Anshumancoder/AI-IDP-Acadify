import { useState } from "react";
import { PRESET_USERS } from "../data/users";
import type { User } from "../types";
import "./login.css";

export default function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

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
        <div  className="brand">
          <div>Acadify Tracker</div>
        </div>
        <div className="label">Sign in to your account</div>
      </div>

      <div className="label">Email Address</div>
      <input
        className="input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="label" style={{ marginTop: 10 }}>
        Password
      </div>
      <input
        className="input"
        type="password"
        placeholder="Enter your password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />

      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}

      <div style={{ marginTop: 14 }}>
        <button
          className="button"
          onClick={handleLogin}
          style={{ width: "100%" }}
        >
          Sign In
        </button>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="label">Getting Started</div>
        <div className="ass-card-muted">
          Use the preset accounts:<br />
          Teacher: <b>teacher@acadify.com</b> / <b>teacher123</b><br />
          Student: <b>student@acadify.com</b> / <b>student123</b>
        </div>
      </div>
    </div>
  );
}
