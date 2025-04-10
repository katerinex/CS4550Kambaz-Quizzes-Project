// src/Kambaz/Account/Profile.tsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Form, Button, FormControl } from "react-bootstrap";
import * as client from "./client"; 

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.accountReducer); // Changed from currentUser to user

  const fetchProfile = () => {
    if (!user) return navigate("/Kambaz/Account/Signin");
    setProfile(user);
  };

  const signout = () => {
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  useEffect(() => {
    fetchProfile();
  }, [user, navigate]); // Changed from currentUser to user

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  return (
    <div className="wd-profile-screen p-4">
      <h3>Profile</h3>
      {profile && (
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <FormControl
              value={profile.username || ""}
              id="wd-username"
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <FormControl
              value={profile.password || ""}
              id="wd-password"
              type="password"
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <FormControl
              value={profile.firstName || ""}
              id="wd-firstname"
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <FormControl
              value={profile.lastName || ""}
              id="wd-lastname"
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Date of Birth</Form.Label>
            <FormControl
              value={profile.dob || ""}
              id="wd-dob"
              type="date"
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <FormControl
              value={profile.email || ""}
              id="wd-email"
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <FormControl
              as="select"
              value={profile.role || "USER"}
              id="wd-role"
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </FormControl>
          </Form.Group>
          <Button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
            id="wd-update-profile"
          >
            Update
          </Button>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </Form>
      )}
    </div>
  );
}