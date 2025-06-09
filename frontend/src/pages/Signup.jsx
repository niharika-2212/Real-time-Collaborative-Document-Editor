import React, { useState } from "react";
import "../styles/login.css";
import { Link, Navigate } from "react-router-dom";
import image from "/CoWrite-1.png";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
      // alert("Signup successful!");
      navigate("/");
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
    
  }

  return (
    <div className="login-container">
      <div className="login-1">
        <h1>CoWrite</h1>
      </div>
      <div className="login-2">
        <img src={image} className="login-image" />
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Create a new account!</h2>
            <p>Sign Up to continue</p>
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
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
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
          <button type="submit" className={loading ? "green-button disabled" : "green-button"}>
            {loading ? "Signing Up" : "Sign up"}
          </button>
          <p>
            Are you new here?{" "}
            <Link className="redirect" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
