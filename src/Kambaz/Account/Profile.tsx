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
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchProfile = () => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
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
  }, [currentUser, navigate]);

  return (
    <div className="wd-profile-screen p-4">
      <h3>Profile</h3>
      {profile && (
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <FormControl
              defaultValue={profile.username}
              id="wd-username"
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <FormControl
              defaultValue={profile.password}
              id="wd-password"
              type="password"
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <FormControl
              defaultValue={profile.firstName}
              id="wd-firstname"
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <FormControl
              defaultValue={profile.lastName}
              id="wd-lastname"
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Date of Birth</Form.Label>
            <FormControl
              defaultValue={profile.dob}
              id="wd-dob"
              type="date"
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <FormControl
              defaultValue={profile.email}
              id="wd-email"
              type="email"
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <FormControl
              as="select"
              defaultValue={profile.role}
              id="wd-role"
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
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