import React from "react";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  const {userData, logout} = useAuth();
  function handleLogout(){
    logout();
    navigate("/login");
  }
  return(
    <div className="navbar-container">
      <h2 onClick={() => {navigate("/")}} className="name">CoWrite</h2>
      <div className="user-name">Hello {userData.name}!</div>
      <div className="green-button" onClick={handleLogout}>Logout</div>
    </div>
  )
}

export default Navbar;