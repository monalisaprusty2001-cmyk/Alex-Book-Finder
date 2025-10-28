import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // 👈 We'll create this next

function LoginPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Please enter your name or email.");
      return;
    }
    localStorage.setItem("alex_user", trimmed);
    navigate("/search");
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100">
      <div className="login-card p-5 shadow">
        <h2 className="text-center mb-3 fw-bold text-light">📚 Alex’s Book Finder</h2>
        <p className="text-center text-light mb-4">
          Login to start exploring amazing books!
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              className="form-control form-control-lg"
              placeholder="Enter your name or email"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button className="btn btn-login btn-lg" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
