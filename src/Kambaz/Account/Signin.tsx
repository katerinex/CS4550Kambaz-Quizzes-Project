// src/Kambaz/Account/Signin.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { Form, Button, FormControl, Alert } from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setCredentials({
      ...credentials,
      [field]: value
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const signin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First try a simple test connection to verify the server is reachable
      try {
        await fetch(`${import.meta.env.VITE_REMOTE_SERVER || 'http://localhost:4000'}/api/test`, {
          method: 'GET',
          mode: 'cors',
        });
      } catch (testError) {
        console.error("Server connection test failed:", testError);
        throw new Error("Cannot connect to server. Please ensure the backend is running.");
      }

      let user;

      // First try normal session-based authentication
      try {
        console.log("Attempting session-based authentication...");
        user = await client.signin(credentials);
      } catch (sessionError) {
        console.log("Session authentication failed, trying token authentication...");
        // If that fails, try token-based authentication
        user = await client.tokenSignin(credentials);
      }
      
      if (user) {
        dispatch(setCurrentUser(user));
        navigate("/Kambaz/Dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      
      // More descriptive error messages
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          setError("Invalid username or password");
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection or try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(error.message || "An error occurred during sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="wd-signin-screen"
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <div style={{ width: "300px" }}>
        <h1 className="text-center">Sign in</h1>
        
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={signin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <FormControl
              value={credentials.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="username"
              id="wd-username"
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <FormControl
              value={credentials.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="password"
              type="password"
              id="wd-password"
              disabled={loading}
            />
          </Form.Group>
          
          <Button 
            type="submit" 
            id="wd-signin-btn" 
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>
        
        <div className="text-center">
          <Link id="wd-signup-link" to="/Kambaz/Account/Signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}