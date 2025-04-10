// src/Kambaz/Courses/Assignments/AssignmentsPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  setAssignments, 
  deleteAssignment, 
  updateAssignment 
} from "./reducer";
import { 
  Button, 
  Form, 
  InputGroup, 
  Dropdown, 
  Modal, 
  Alert 
} from "react-bootstrap";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEllipsisV,
  FaCheck,
  FaCalendarAlt
} from "react-icons/fa";
import * as client from "./client";
import { formatDate } from "./dateUtils";
import EditAssignmentDatesModal from "./EditAssignmentDatesModal";
import "./AssignmentsPage.css";

const AssignmentsPage = () => {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [showAssignmentDatesModal, setShowAssignmentDatesModal] = useState(false);
  // Add state for group deletion
  const [showGroupDeleteModal, setShowGroupDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  
  // Get assignments from Redux store
  const assignments = useSelector((state: any) => 
    state.assignmentsReducer.assignments || []);
  
  // Get current user from Redux store
  const { user } = useSelector((state: any) => state.accountReducer);
  const isFaculty = user?.role === "FACULTY" || user?.role === "ADMIN";
  
  // Fetch assignments for this course
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (cid) {
        console.log("Fetching assignments for course:", cid);
        const fetchedAssignments = await client.findAssignmentsForCourse(cid);
        dispatch(setAssignments(fetchedAssignments || []));
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing assignment dates
  const handleEditAssignmentDates = () => {
    setShowAssignmentDatesModal(true);
  };
  
  // Handle assignment deletion
  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (assignmentToDelete) {
      try {
        await client.deleteAssignment(assignmentToDelete);
        dispatch(deleteAssignment(assignmentToDelete));
        setShowDeleteModal(false);
        setAssignmentToDelete(null);
      } catch (error) {
        console.error("Error deleting assignment:", error);
        setError("Failed to delete assignment. Please try again.");
      }
    }
  };
  
  // Handle toggling publish status
  const handleTogglePublish = async (assignment: any) => {
    try {
      const updatedAssignment = { 
        ...assignment, 
        published: !assignment.published 
      };
      
      await client.updateAssignment(updatedAssignment);
      dispatch(updateAssignment(updatedAssignment));
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setError("Failed to update assignment status. Please try again.");
    }
  };
  
  // Handle deleting a group
  const handleGroupDeleteClick = (groupName: string) => {
    setGroupToDelete(groupName);
    setShowGroupDeleteModal(true);
  };
  
  const confirmGroupDelete = async () => {
    if (groupToDelete) {
      try {
        // This would normally involve a backend call to delete the group
        // For now, we'll just log the action
        console.log(`Deleting group: ${groupToDelete}`);
        
        // In a real implementation, you'd delete the group from the database
        // and update the assignments to move them to another group
        
        // Close the modal and reset state
        setShowGroupDeleteModal(false);
        setGroupToDelete(null);
      } catch (error) {
        console.error("Error deleting group:", error);
        setError("Failed to delete group. Please try again.");
      }
    }
  };
  
  // State for group editing
  const [showGroupEditModal, setShowGroupEditModal] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  
  // Handle editing a group
  const handleGroupEdit = (groupName: string) => {
    setGroupToEdit(groupName);
    setNewGroupName(groupName);
    setShowGroupEditModal(true);
  };
  
  // Confirm group edit
  const confirmGroupEdit = async () => {
    if (groupToEdit && newGroupName.trim()) {
      try {
        // This would normally involve a backend call to update the group name
        console.log(`Renaming group from "${groupToEdit}" to "${newGroupName}"`);
        
        // In a real implementation, you'd update the group in the database
        // and update the assignments to use the new group name
        
        // Close the modal and reset state
        setShowGroupEditModal(false);
        setGroupToEdit(null);
        setNewGroupName("");
      } catch (error) {
        console.error("Error updating group:", error);
        setError("Failed to update group. Please try again.");
      }
    }
  };
  
  // Handle publishing all assignments in a group
  const handleGroupPublish = (groupName: string) => {
    // Implementation for publishing all assignments in a group would go here
    alert(`Publish all in group: ${groupName}`);
  };
  
  // Filter assignments based on search term
  const filteredAssignments = assignments.filter((assignment: any) => 
    assignment.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determine visible assignments based on user role
  const visibleAssignments = isFaculty 
    ? filteredAssignments 
    : filteredAssignments.filter((assignment: any) => assignment.published);
  
  // Group assignments by module
  const groupedAssignments = visibleAssignments.reduce((groups: any, assignment: any) => {
    const module = assignment.group || "Assignments";
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(assignment);
    return groups;
  }, {});

  // Initialize when component mounts
  useEffect(() => {
    fetchAssignments();
  }, [cid]);
  
  // Function to create a new assignment by navigating to the editor page
  const handleCreateAssignment = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments/new`);
  };
  
  // Add support for keyboard navigation and accessibility
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  
  return (
    <div className="assignments-page p-4">
      {/* Header with search and buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="search-container" style={{ width: '300px' }}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search for Assignments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for assignments"
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </div>
        
        <div className="action-buttons d-flex align-items-center">
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => {}} 
            aria-label="Add group"
          >
            <FaPlus className="me-1" /> Group
          </Button>
          
          <Button 
            variant="success" 
            className="me-2"
            onClick={handleCreateAssignment}
            aria-label="Add assignment"
          >
            <FaPlus className="me-1" /> Assignment
          </Button>
          
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="btn-outline-secondary">
              <FaEllipsisV />
            </Dropdown.Toggle>
            
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={handleEditAssignmentDates}>
                Edit Assignment Dates
              </Dropdown.Item>
              <Dropdown.Item onClick={() => {}}>
                Assignment Groups Weight
              </Dropdown.Item>
              <Dropdown.Item onClick={() => {}}>
                Commons Favorites
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="assignments-container">
          {/* Render assignment groups from state */}
          {Object.entries(groupedAssignments).map(([groupName, groupAssignments]: [string, any]) => (
            <div key={groupName} className="assignment-group mb-4">
              <div className="assignment-group-header d-flex align-items-center justify-content-between p-3 bg-light"
                   tabIndex={0}
                   role="button"
                   aria-expanded="true"
                   aria-controls={`${groupName.toLowerCase().replace(/\s+/g, '-')}-content`}
                   onKeyPress={(e) => handleKeyPress(e, () => {})}>
                <h6 className="m-0 d-flex align-items-center">
                  <span className="discussion-toggle me-2">▼</span>
                  {groupName}
                </h6>
                {/* Group options menu - Added back with more options */}
                {isFaculty && (
                  <Dropdown className="group-dropdown">
                    <Dropdown.Toggle variant="link" id={`dropdown-group-${groupName}`} className="btn-sm text-muted">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" className="dropdown-menu-higher-z">
                      <Dropdown.Item onClick={() => handleGroupEdit(groupName)}>
                        <FaEdit className="me-2" /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleGroupPublish(groupName)}>
                        <FaCheck className="me-2" /> Publish All
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleGroupDeleteClick(groupName)}>
                        <FaTrash className="me-2" /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
              
              <div className="assignment-items" id={`${groupName.toLowerCase().replace(/\s+/g, '-')}-content`}>
                {groupAssignments.map((assignment: any) => (
                  <div key={assignment._id} className="assignment-item p-3 border-top d-flex">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <i className="icon-assignment me-2"></i>
                        <div>
                          <h6 className="mb-0">{assignment.title}</h6>
                          <div className="text-muted small">
                            {assignment.module || "Module"} | {assignment.points || 0} pts
                            {assignment.dueDate && (
                              <span className="ms-2">
                                <FaCalendarAlt className="me-1" />
                                Due: {formatDate(assignment.dueDate, { includeTime: true })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="assignment-icons d-flex align-items-center">
                      <div className="icons">
                        {assignment.published && (
                          <FaCheck className="text-success me-2" />
                        )}
                      </div>
                      {isFaculty && (
                        <Dropdown className="dropdown-wrapper">
                          <Dropdown.Toggle variant="link" id={`dropdown-${assignment._id}`} className="btn-sm text-muted dropdown-toggle-fixed">
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end" className="dropdown-menu-higher-z">
                            <Dropdown.Item onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`)}>
                              <FaEdit className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTogglePublish(assignment)}>
                              <FaCheck className="me-2" /> {assignment.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteClick(assignment._id)}>
                              <FaTrash className="me-2" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty state when no assignments exist */}
      {!loading && visibleAssignments.length === 0 && (
        <div className="alert alert-info">
          <p className="mb-0">
            {isFaculty 
              ? "No assignments found. Use the '+Assignment' button to create your first assignment."
              : "No assignments have been created for this course yet."
            }
          </p>
        </div>
      )}
      
      {/* Assignment Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Group Delete Confirmation Modal */}
      <Modal show={showGroupDeleteModal} onHide={() => setShowGroupDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{groupToDelete}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGroupDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmGroupDelete}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Assignment Dates Modal */}
      <EditAssignmentDatesModal 
        show={showAssignmentDatesModal} 
        onHide={() => setShowAssignmentDatesModal(false)} 
        assignments={assignments}
      />
      
      {/* Group Edit Modal */}
      <Modal show={showGroupEditModal} onHide={() => setShowGroupEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit group: {groupToEdit}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setShowGroupEditModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmGroupEdit}
            disabled={!newGroupName.trim() || newGroupName === groupToEdit}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignmentsPage;