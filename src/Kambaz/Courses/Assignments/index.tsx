// src/Kambaz/Courses/Assignments/index.tsx
import { useState, useEffect } from "react";
import { 
  FaEdit, 
  FaPlus, 
  FaCheck,
  FaFileAlt,
  FaTrash,
  FaCalendarAlt
} from "react-icons/fa";
import { 
  Button, 
  Alert,
  Modal,
  Form
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addAssignment,
  updateAssignment,
  deleteAssignment,
  setAssignments,
} from "./reducer";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

interface AssignmentsProps {
  courseId: string | undefined;
}

interface Assignment {
  _id: string;
  title: string;
  name?: string;
  description?: string;
  course: string;
  dueDate?: string;
  points?: number;
  published?: boolean;
  availableFromDate?: string;
  availableUntilDate?: string;
}

export default function Assignments(props: AssignmentsProps) {
  const { courseId } = props;
  const { cid } = useParams<{ cid?: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  
  // Form states
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentPoints, setAssignmentPoints] = useState<number>(0);
  const [assignmentPublished, setAssignmentPublished] = useState(false);
  
  // Get current user from Redux store
  const { user } = useSelector((state: any) => state.accountReducer);
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();
  
  // Check if user is faculty/admin
  const isFaculty = user?.role === "FACULTY" || user?.role === "ADMIN";

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const courseIdToUse = courseId || cid;
      
      if (courseIdToUse) {
        console.log("Fetching assignments for course:", courseIdToUse);
        const fetchedAssignments = await coursesClient.findAssignmentsForCourse(
          courseIdToUse as string
        );
        console.log("Fetched assignments:", fetchedAssignments);
        
        // Make sure we have an array of assignments even if the API returns null or undefined
        const assignmentsArray = Array.isArray(fetchedAssignments) ? fetchedAssignments : [];
        dispatch(setAssignments(assignmentsArray));
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to fetch assignments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (assignment: Assignment | null = null) => {
    if (assignment) {
      setCurrentAssignment(assignment);
      setAssignmentName(assignment.title);
      setAssignmentDescription(assignment.description || "");
      setAssignmentDueDate(assignment.dueDate || "");
      setAssignmentPoints(assignment.points || 0);
      setAssignmentPublished(assignment.published || false);
    } else {
      setCurrentAssignment(null);
      setAssignmentName("");
      setAssignmentDescription("");
      setAssignmentDueDate("");
      setAssignmentPoints(0);
      setAssignmentPublished(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const courseIdToUse = courseId || cid;
    if (!courseIdToUse) return;
    
    try {
      setError(null);
      
      const assignmentData = {
        title: assignmentName,
        name: assignmentName,
        description: assignmentDescription,
        course: courseIdToUse,
        dueDate: assignmentDueDate,
        points: assignmentPoints,
        published: assignmentPublished,
      };
      
      if (currentAssignment) {
        // Update existing assignment
        const updatedAssignment = {
          ...assignmentData, 
          _id: currentAssignment._id,
          availableFromDate: currentAssignment.availableFromDate,
          availableUntilDate: currentAssignment.availableUntilDate
        };
        await assignmentsClient.updateAssignment(updatedAssignment);
        dispatch(updateAssignment(updatedAssignment));
      } else {
        // Create new assignment
        const newAssignment = await coursesClient.createAssignmentForCourse(
          courseIdToUse,
          { ...assignmentData, _id: `A${Date.now()}` }
        );
        dispatch(addAssignment(newAssignment));
      }
      
      setShowModal(false);
    } catch (error) {
      console.error("Error saving assignment:", error);
      setError("Failed to save assignment. Please try again.");
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await assignmentsClient.deleteAssignment(assignmentId);
      dispatch(deleteAssignment(assignmentId));
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setError("Failed to delete assignment. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "No due date";
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid, courseId]);

  // Debug information
  useEffect(() => {
    if (!loading) {
      console.log("User role:", user?.role);
      console.log("Is Faculty:", isFaculty);
      console.log("All assignments:", assignments);
      
      if (assignments && assignments.length > 0) {
        console.log("Published assignments:", 
          assignments.filter((a: Assignment) => a.published).length);
        console.log("Unpublished assignments:", 
          assignments.filter((a: Assignment) => !a.published).length);
      }
    }
  }, [loading, assignments, user]);

  // Determine visible assignments based on user role
  const visibleAssignments = isFaculty 
    ? assignments 
    : (assignments || []).filter((assignment: Assignment) => assignment.published === true);

  // Debug visible assignments
  useEffect(() => {
    console.log("Visible assignments for current user:", visibleAssignments);
  }, [visibleAssignments]);

  return (
    <div className="p-3">
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {isFaculty && (
            <div className="d-flex justify-content-end mb-3">
              <Button
                variant="danger"
                onClick={() => handleOpenModal()}
              >
                <FaPlus className="me-2" /> New Assignment
              </Button>
            </div>
          )}
          
          {visibleAssignments && visibleAssignments.length > 0 ? (
            <div className="list-group">
              {visibleAssignments.map((assignment: Assignment) => (
                <div 
                  key={assignment._id}
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center">
                      <FaFileAlt className="me-2 text-danger" />
                      <h6 className="mb-0">{assignment.title}</h6>
                      {assignment.published && isFaculty && (
                        <FaCheck className="text-success ms-2" />
                      )}
                    </div>
                    
                    {assignment.description && (
                      <div className="text-muted mt-1 small">
                        {assignment.description}
                      </div>
                    )}
                    
                    <div className="d-flex mt-2 text-muted small">
                      <div className="me-3">
                        <FaCalendarAlt className="me-1" />
                        {formatDate(assignment.dueDate)}
                      </div>
                      <div>
                        <strong>Points:</strong> {assignment.points || 0}
                      </div>
                    </div>
                  </div>
                  
                  {isFaculty && (
                    <div className="d-flex">
                      <Button 
                        variant="outline-primary" 
                        className="btn-sm me-2"
                        onClick={() => handleOpenModal(assignment)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="btn-sm"
                        onClick={() => handleDeleteAssignment(assignment._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No assignments found for this course. {isFaculty && "Create a new assignment to get started."}
            </div>
          )}
        </div>
      )}
      
      {/* Assignment Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAssignment ? "Edit Assignment" : "New Assignment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Assignment Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter assignment name"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter assignment description"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={assignmentDueDate}
                onChange={(e) => setAssignmentDueDate(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={assignmentPoints}
                onChange={(e) => setAssignmentPoints(Number(e.target.value))}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Published"
                checked={assignmentPublished}
                onChange={(e) => setAssignmentPublished(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!assignmentName.trim()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}