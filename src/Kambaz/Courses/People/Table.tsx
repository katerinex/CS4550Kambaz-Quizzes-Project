// src/Kambaz/Courses/People/Table.tsx
import { useState, useEffect } from "react";
import { Table, Button, Form, FormControl, Modal, Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import * as client from "./client";
import { FaUserCircle, FaSort, FaFilter } from "react-icons/fa";
import PeopleDetails from "./Details"; 
import { useSelector } from "react-redux";

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
  const { cid } = useParams<{ cid?: string }>();
  const [users, setUsers] = useState<User[]>(usersProp);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<string>("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get current user from Redux store
  const { user: currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Check if user is faculty/admin
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const fetchUsers = async () => {
    if (!cid) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const fetchedUsers = await client.findUsersForCourse(cid);
      
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
        applyFiltersAndSort(fetchedUsers, roleFilter, sortField, sortDirection);
      } else {
        setUsers([]);
        setFilteredUsers([]);
        setError("Failed to load users. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (userList: User[], role: string, sortBy: string, direction: "asc" | "desc") => {
    // First apply role filter
    let result = [...userList];
    
    // Apply role filter
    if (role !== "ALL") {
      result = result.filter(user => user.role === role);
    }
    
    // Then sort the filtered list
    result.sort((a, b) => {
      let valueA: string;
      let valueB: string;
      
      // Determine which field to sort by
      switch (sortBy) {
        case "firstName":
          valueA = a.firstName || '';
          valueB = b.firstName || '';
          break;
        case "lastName":
          valueA = a.lastName || '';
          valueB = b.lastName || '';
          break;
        case "username":
          valueA = a.username || '';
          valueB = b.username || '';
          break;
        case "role":
          valueA = a.role || '';
          valueB = b.role || '';
          break;
        default:
          valueA = a.lastName || '';
          valueB = b.lastName || '';
      }
      
      // Apply sort direction
      if (direction === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    
    setFilteredUsers(result);
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    applyFiltersAndSort(users, role, sortField, sortDirection);
  };

  const handleSort = (field: string) => {
    // If clicking the same field, toggle direction
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    applyFiltersAndSort(users, roleFilter, field, newDirection);
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.username || !newUser.firstName || !newUser.lastName) {
        alert("Please fill in all required fields");
        return;
      }
      
      if (cid) {
        const createdUser = await client.createUser({ ...newUser, course: cid });
        const updatedUsers = [...users, createdUser];
        setUsers(updatedUsers);
        applyFiltersAndSort(updatedUsers, roleFilter, sortField, sortDirection);
        
        // Reset form
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
      setError("Failed to create user. Please try again.");
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        await client.updateUser(editingUser);
        const updatedUsers = users.map((user) => 
          (user._id === editingUser._id ? editingUser : user)
        );
        setUsers(updatedUsers);
        applyFiltersAndSort(updatedUsers, roleFilter, sortField, sortDirection);
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
        setError("Failed to update user. Please try again.");
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
      const updatedUsers = users.filter((user) => user._id !== userToDelete);
      setUsers(updatedUsers);
      applyFiltersAndSort(updatedUsers, roleFilter, sortField, sortDirection);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Initial data load
  useEffect(() => {
    if (usersProp.length === 0) {
      fetchUsers();
    } else {
      setUsers(usersProp);
      applyFiltersAndSort(usersProp, roleFilter, sortField, sortDirection);
    }
  }, [cid]);

  // Helper to render sort icon
  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return <FaSort className={`ms-1 ${sortDirection === "asc" ? "text-primary" : "text-danger"}`} />;
    }
    return <FaSort className="ms-1 text-secondary" />;
  };

  return (
    <div>
      {/* Only render PeopleDetails if user is faculty/admin */}
      {isFaculty && <PeopleDetails fetchUsers={fetchUsers} />}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>People</h2>
        
        {/* Role filter dropdown for all users */}
        <div className="d-flex align-items-center">
          <FaFilter className="me-2" />
          <Form.Select 
            value={roleFilter}
            onChange={(e) => handleRoleFilterChange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admins</option>
            <option value="TA">Teaching Assistants</option>
          </Form.Select>
        </div>
      </div>
      
      {/* Show error message if any */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      
      {/* Only show Add User form for faculty/admin */}
      {isFaculty && (
        <Form className="mb-4 p-3 border rounded bg-light">
          <h5>Add New User</h5>
          <div className="row">
            <Form.Group className="col-md-3 mb-2">
              <Form.Label>Username</Form.Label>
              <FormControl
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="col-md-3 mb-2">
              <Form.Label>First Name</Form.Label>
              <FormControl
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="col-md-3 mb-2">
              <Form.Label>Last Name</Form.Label>
              <FormControl
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="col-md-3 mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
                <option value="TA">Teaching Assistant</option>
              </Form.Select>
            </Form.Group>
          </div>
          <Button 
            variant="primary" 
            onClick={handleCreateUser}
            className="mt-2"
          >
            Add User
          </Button>
        </Form>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th onClick={() => handleSort("lastName")} style={{ cursor: 'pointer' }}>
                Name {renderSortIcon("lastName")}
              </th>
              <th onClick={() => handleSort("username")} style={{ cursor: 'pointer' }}>
                Username {renderSortIcon("username")}
              </th>
              <th onClick={() => handleSort("role")} style={{ cursor: 'pointer' }}>
                Role {renderSortIcon("role")}
              </th>
              {isFaculty && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="wd-full-name text-nowrap">
                    {isFaculty ? (
                      <Link
                        to={`/Kambaz/Account/Users/${user._id}`}
                        className="text-decoration-none"
                      >
                        <FaUserCircle className="me-2 fs-4 text-secondary" />
                        <span className="wd-first-name">{user.firstName}</span>{" "}
                        <span className="wd-last-name">{user.lastName}</span>
                      </Link>
                    ) : (
                      <>
                        <FaUserCircle className="me-2 fs-4 text-secondary" />
                        <span className="wd-first-name">{user.firstName}</span>{" "}
                        <span className="wd-last-name">{user.lastName}</span>
                      </>
                    )}
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
                      <Form.Select
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, role: e.target.value })
                        }
                      >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TA">Teaching Assistant</option>
                      </Form.Select>
                    ) : (
                      user.role
                    )}
                  </td>
                  {isFaculty && (
                    <td className="text-nowrap">
                      {editingUser && editingUser._id === user._id ? (
                        <>
                          <Button 
                            variant="success" 
                            onClick={handleUpdateUser}
                            className="me-2 btn-sm"
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setEditingUser(null)}
                            className="btn-sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => setEditingUser(user)}
                            className="me-2 btn-sm"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(user._id)}
                            className="btn-sm"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isFaculty ? 4 : 3} className="text-center">
                  {roleFilter !== "ALL" 
                    ? `No users with role "${roleFilter}" found in this course.` 
                    : "No users found in this course."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      
      {/* Only render delete modal for faculty/admin */}
      {isFaculty && (
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
      )}
    </div>
  );
}