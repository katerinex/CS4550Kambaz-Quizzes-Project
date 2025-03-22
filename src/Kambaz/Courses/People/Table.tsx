// src/Kambaz/Courses/People/Table.tsx
import { useState, useEffect } from "react";
import { Table, Button, Form, FormControl, Modal } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import * as client from "./client";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details"; 

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  course?: string;
}

interface PeopleTableProps {
  users?: User[];
}

export default function PeopleTable({ users: usersProp = [] }: PeopleTableProps) {
  const { cid } = useParams<{ cid?: string }>(); // Make cid optional
  const [users, setUsers] = useState<User[]>(usersProp);
  const [newUser, setNewUser] = useState<User>({
    _id: "",
    username: "",
    firstName: "",
    lastName: "",
    role: "STUDENT",
    course: cid,
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");

  const fetchUsers = async () => {
    try {
      if (cid) {
        const fetchedUsers = await client.findUsersForCourse(cid);
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (cid) {
        const createdUser = await client.createUser({ ...newUser, course: cid });
        setUsers([...users, createdUser]);
        setNewUser({
          _id: "",
          username: "",
          firstName: "",
          lastName: "",
          role: "STUDENT",
          course: cid,
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        await client.updateUser(editingUser);
        setUsers(users.map((user) => (user._id === editingUser._id ? editingUser : user)));
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await client.deleteUser(userToDelete);
      setUsers(users.filter((user) => user._id !== userToDelete));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    if (!usersProp || usersProp.length === 0) {
      fetchUsers();
    }
  }, [cid, usersProp]);

  return (
    <div>
      <PeopleDetails fetchUsers={fetchUsers} /> {/* Pass fetchUsers as a prop */}
      <h2>People</h2>
      <Form className="mb-3">
        <Form.Group className="mb-2">
          <FormControl
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <FormControl
            placeholder="First Name"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <FormControl
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={handleCreateUser}>
          Add User
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <Link
                  to={`/Kambaz/Account/Users/${user._id}`}
                  className="text-decoration-none"
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </Link>
              </td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <FormControl
                    value={editingUser.username}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, username: e.target.value })
                    }
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <FormControl
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, firstName: e.target.value })
                    }
                  />
                ) : (
                  user.firstName
                )}
              </td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <FormControl
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, lastName: e.target.value })
                    }
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <Form.Select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                  </Form.Select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <>
                    <Button variant="success" onClick={handleUpdateUser}>
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}