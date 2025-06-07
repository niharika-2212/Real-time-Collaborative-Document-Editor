import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

// Create the AuthContext and hook
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // setting current user
  const [token, setToken] = useState(null); // setting token
  const [loading, setLoading] = useState(true); // loading element
  const [userData, setUserData] = useState(null); // setting user data
  // Track Firebase Auth state
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const idToken = await user.getIdToken();
      setCurrentUser(user);
      setToken(idToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      try {
        // ✅ Fetch user data from your backend
        const res = await axios.get(`http://localhost:5000/user/login`);
        setUserData(res.data.user); // save MongoDB user info
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    } else {
      setCurrentUser(null);
      setToken(null);
      setUserData(null); // clear userData
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  });

  return unsubscribe;
}, []);


  // Signup function (only sends `fullname`)
  const signup = async (email, password, name) => {
    // creates user on firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // 

    const idToken = await userCredential.user.getIdToken();
    axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

    const res = await axios.post("http://localhost:5000/user/signup", {
      name, // No uid/email here!
    });
    setUserData(res.data); 


    return userCredential.user;
  };

  // Login function
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const idToken = await userCredential.user.getIdToken();
    axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

    // Optional: hit login API to get user info from DB
    const res = await axios.get("http://localhost:5000/user/login");
    setUserData(res.data.user); // Set user data from the response
    return userCredential.user;
  };

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userData,
    token,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};