// src/Kambaz/Account/Signin.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client"; 
import { Form, Button, FormControl } from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    const user = await client.signin(credentials); // Use client.signin
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div
      id="wd-signin-screen"
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <div style={{ width: "300px" }}>
        <h1 className="text-center">Sign in</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <FormControl
              defaultValue={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              placeholder="username"
              id="wd-username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <FormControl
              defaultValue={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="password"
              type="password"
              id="wd-password"
            />
          </Form.Group>

          <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-3">
            Sign in
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