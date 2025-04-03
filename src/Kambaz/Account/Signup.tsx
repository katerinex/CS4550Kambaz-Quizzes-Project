// src/Kambaz/Account/Signup.tsx
// Adding better error handling to display errors to users
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Alert } from "react-bootstrap"; 

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const signup = async () => {
    // Clear any previous errors
    setError(null);
    
    // Basic validation
    if (!user.username || !user.password) {
      setError("Username and password are required");
      return;
    }
    
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      navigate("/Kambaz/Account/Profile");
    } catch (error: any) {
      // Display the error message from the server if available
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
      console.error("Signup failed:", error);
    }
  };
  
  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      
      <FormControl
        value={user.username || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser({ ...user, username: e.target.value })}
        className="wd-username mb-2"
        placeholder="username"
      />
      
      <FormControl
        value={user.password || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })}
        className="wd-password mb-2"
        placeholder="password"
        type="password"
      />
      
      <button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100">
        Sign up
      </button>
      
      <br />
      
      <Link to="/Kambaz/Account/Signin" className="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}

