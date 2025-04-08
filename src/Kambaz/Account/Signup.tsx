// src/Kambaz/Account/Signup.tsx
import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Form, Button, FormControl, Alert } from "react-bootstrap";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (field: string, value: string) => {
    setUser({
      ...user,
      [field]: value
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const signup = async () => {
    // Clear any previous errors
    setError(null);
    setLoading(true);
    
    // Basic validation
    if (!user.username || !user.password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      // Only use session-based signup
      console.log("Attempting signup...");
      const currentUser = await client.signup(user);
      
      if (currentUser) {
        dispatch(setCurrentUser(currentUser));
        navigate("/Kambaz/Account/Profile");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error: any) {
      // Display the error message from the server if available
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="wd-signup-screen d-flex justify-content-center align-items-center vh-100"
    >
      <div style={{ width: "300px" }}>
        <h1 className="text-center">Sign up</h1>
        
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <FormControl
              value={user.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              className="wd-username"
              placeholder="username"
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <FormControl
              value={user.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className="wd-password"
              placeholder="password"
              type="password"
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>First Name (Optional)</Form.Label>
            <FormControl
              value={user.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First name"
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Last Name (Optional)</Form.Label>
            <FormControl
              value={user.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Last name"
              disabled={loading}
            />
          </Form.Group>
          
          <Button 
            onClick={signup} 
            className="wd-signup-btn btn btn-primary mb-3 w-100"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </Form>
        
        <div className="text-center">
          <Link to="/Kambaz/Account/Signin" className="wd-signin-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}