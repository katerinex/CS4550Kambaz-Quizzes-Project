// src/Kambaz/Account/Users.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PeopleTable from "../Courses/People/Table";
import * as client from "./client";
import { FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const { uid } = useParams();

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
    fetchUsers(); // Refresh the user list after creating a new user
  };

  useEffect(() => {
    if (uid) {
      const fetchUser = async () => {
        const user = await client.findUserById(uid);
        setUsers([user]);
      };
      fetchUser();
    } else {
      fetchUsers();
    }
  }, [uid]);

  return (
    <div className="container">
      <h1>Users</h1>
      <button
        onClick={createUser}
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Users
      </button>
      <FormControl
        type="text"
        placeholder="Search by name"
        value={name}
        onChange={(e) => filterUsersByName(e.target.value)}
      />
      <FormControl
        as="select"
        value={role}
        onChange={(e) => filterUsersByRole(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Instructor</option>
        <option value="ADMIN">Admin</option>
      </FormControl>
      <PeopleTable users={users} />
    </div>
  );
}
