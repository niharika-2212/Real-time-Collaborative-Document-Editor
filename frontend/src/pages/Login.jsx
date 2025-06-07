import React, { useState } from "react";
import image from "/CoWrite-1.png";
import "../styles/login.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-1">
        <h1>CoWrite</h1>
      </div>
      <div className="login-2">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Welcome Back!</h2>
            <p>Log In to your account</p>
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="green-button">
            Log In
          </button>
          <p>
            Are you new here?{" "}
            <Link className="redirect" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
        <img src={image} className="login-image" />
      </div>
    </div>
  );
}

export default Login;
