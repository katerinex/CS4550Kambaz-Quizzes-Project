// src/Kambaz/Courses/Assignments/Editor.tsx


import { useState, useEffect } from "react";
import { Form, FormControl, Button, Alert, Card, Tabs, Tab, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import * as client from "./client";
import {
  FaSave,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaPercentage,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import "./Editor.css";

const AssignmentEditor = () => {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);
  const assignment = assignments.find((a: any) => a._id === aid);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<any>(
    assignment || {
      title: "",
      description: "",
      points: 0,
      dueDate: "",
      availableFromDate: "",
      availableUntilDate: "",
      course: cid,
      published: false,
      submissionType: "online",
      groupAssignment: false,
      peerReviews: false,
      gradingType: "points",
      displayGrade: true
    }
  );
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (assignment) {
      setFormData(assignment);
    } else if (aid === 'new') {
      setFormData({
        title: "",
        description: "",
        points: 0,
        dueDate: "",
        availableFromDate: "",
        availableUntilDate: "",
        course: cid,
        published: false,
        submissionType: "online",
        groupAssignment: false,
        peerReviews: false,
        gradingType: "points",
        displayGrade: true
      });
    }
  }, [assignment, cid, aid]);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) {
      setError("Assignment name is required");
      return;
    }
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Make sure course ID is properly set
      const assignmentData = {
        ...formData,
        course: cid
      };
      
      if (aid !== 'new') {
        // Updating existing assignment
        const updatedAssignment = await client.updateAssignment(assignmentData);
        dispatch(updateAssignment(updatedAssignment));
      } else {
        // Creating new assignment
        // Generate a temporary ID if not present
        const newAssignment = {
          ...assignmentData,
          _id: assignmentData._id || `TEMP_${Date.now()}`
        };
        
        const createdAssignment = await client.createAssignment(newAssignment);
        dispatch(addAssignment(createdAssignment));
      }
      
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
      setError("Failed to save assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };
  
  return (
    <div id="wd-assignment-editor" className="assignment-editor p-4">
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="link" 
          className="p-0 me-2" 
          onClick={handleCancel}
        >
          <FaArrowLeft />
        </Button>
        <h2 className="mb-0">
          <span className="course-code">{cid}</span>
          <span className="text-muted mx-2">&gt;</span>
          <span className="text-muted">Assignments</span>
          <span className="text-muted mx-2">&gt;</span>
          <span>{formData.title || "New Assignment"}</span>
        </h2>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tabs
        id="assignment-editor-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
        className="mb-4"
      >
        <Tab eventKey="details" title="Details">
          <Card className="border">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Assignment Name</Form.Label>
                  <FormControl 
                    type="text" 
                    value={formData.title || ""} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="Assignment name"
                    required
                  />
                </Form.Group>
                
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        <FaPercentage className="me-2" />
                        Points
                      </Form.Label>
                      <FormControl 
                        type="number" 
                        min="0"
                        value={formData.points || 0} 
                        onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Assignment Group
                      </Form.Label>
                      <Form.Select
                        value={formData.group || ""}
                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                      >
                        <option value="">Assignments</option>
                        <option value="Old Assignments">Old Assignments</option>
                        <option value="Quizzes">Quizzes</option>
                        <option value="Projects">Projects</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Assignment Description</Form.Label>
                  <FormControl 
                    as="textarea" 
                    rows={6} 
                    value={formData.description || ""} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Explain what students need to do for this assignment"
                  />
                </Form.Group>
                
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaCalendarAlt className="me-2" />
                        Due
                      </Form.Label>
                      <FormControl 
                        type="datetime-local" 
                        value={formData.dueDate || ""} 
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="availability-section p-3 bg-light border rounded mb-4">
                  <h5 className="mb-3">Availability</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaClock className="me-1" />
                          Available from
                        </Form.Label>
                        <FormControl 
                          type="datetime-local" 
                          value={formData.availableFromDate || ""} 
                          onChange={(e) => setFormData({ ...formData, availableFromDate: e.target.value })} 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaClock className="me-1" />
                          Available until
                        </Form.Label>
                        <FormControl 
                          type="datetime-local" 
                          value={formData.availableUntilDate || ""} 
                          onChange={(e) => setFormData({ ...formData, availableUntilDate: e.target.value })} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                
                <Form.Group className="mb-4">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      id="published-checkbox"
                      checked={formData.published || false}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="me-2"
                    />
                    <Form.Label htmlFor="published-checkbox" className="mb-0">
                      {formData.published ? (
                        <>
                          <FaEye className="text-success me-2" />
                          Published (visible to students)
                        </>
                      ) : (
                        <>
                          <FaEyeSlash className="text-muted me-2" />
                          Unpublished (hidden from students)
                        </>
                      )}
                    </Form.Label>
                  </div>
                  <Form.Text className="text-muted ms-4">
                    Students can only see and submit assignments that are published.
                  </Form.Text>
                </Form.Group>
                
                <div className="d-flex mt-4">
                  <Button variant="secondary" className="me-2" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="d-flex align-items-center" 
                    disabled={!formData.title?.trim() || isSubmitting}
                  >
                    <FaSave className="me-2" />
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="grading" title="Grading">
          <Card className="border">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Grading Type</Form.Label>
                <Form.Select
                  value={formData.gradingType || "points"}
                  onChange={(e) => setFormData({ ...formData, gradingType: e.target.value })}
                >
                  <option value="points">Points</option>
                  <option value="percent">Percentage</option>
                  <option value="letter_grade">Letter Grade</option>
                  <option value="gpa_scale">GPA Scale</option>
                  <option value="pass_fail">Complete/Incomplete</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="display-grade"
                  label="Display grade as"
                  checked={formData.displayGrade || false}
                  onChange={(e) => setFormData({ ...formData, displayGrade: e.target.checked })}
                />
              </Form.Group>
              
              <div className="mt-4">
                <Button variant="secondary" className="me-2" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleSubmit} 
                  className="d-flex align-items-center" 
                  disabled={!formData.title?.trim() || isSubmitting}
                >
                  <FaSave className="me-2" />
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="submissions" title="Submissions">
          <Card className="border">
            <Card.Body>
              <h5 className="mb-3">Submission Type</h5>
              <Form.Group className="mb-3">
                <Form.Select
                  value={formData.submissionType || "online"}
                  onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                >
                  <option value="online">Online</option>
                  <option value="on_paper">On Paper</option>
                  <option value="external_tool">External Tool</option>
                  <option value="no_submission">No Submission</option>
                </Form.Select>
              </Form.Group>
              
              {formData.submissionType === "online" && (
                <div className="online-options p-3 bg-light border rounded mb-3">
                  <h6 className="mb-3">Online Entry Options</h6>
                  <Form.Group className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id="text-entry"
                      label="Text Entry"
                      checked={formData.allowTextEntry || false}
                      onChange={(e) => setFormData({ ...formData, allowTextEntry: e.target.checked })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id="file-upload"
                      label="File Uploads"
                      checked={formData.allowFileUpload || false}
                      onChange={(e) => setFormData({ ...formData, allowFileUpload: e.target.checked })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id="website-url"
                      label="Website URL"
                      checked={formData.allowWebsiteUrl || false}
                      onChange={(e) => setFormData({ ...formData, allowWebsiteUrl: e.target.checked })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id="media-recordings"
                      label="Media Recordings"
                      checked={formData.allowMediaRecordings || false}
                      onChange={(e) => setFormData({ ...formData, allowMediaRecordings: e.target.checked })}
                    />
                  </Form.Group>
                </div>
              )}
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="group-assignment"
                  label="This is a group assignment"
                  checked={formData.groupAssignment || false}
                  onChange={(e) => setFormData({ ...formData, groupAssignment: e.target.checked })}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="peer-reviews"
                  label="Require peer reviews"
                  checked={formData.peerReviews || false}
                  onChange={(e) => setFormData({ ...formData, peerReviews: e.target.checked })}
                />
              </Form.Group>
              
              <div className="mt-4">
                <Button variant="secondary" className="me-2" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleSubmit} 
                  className="d-flex align-items-center" 
                  disabled={!formData.title?.trim() || isSubmitting}
                >
                  <FaSave className="me-2" />
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      {/* Bottom Save Buttons - Visible on all tabs */}
      <div className="fixed-bottom p-3 bg-white border-top save-buttons">
        <div className="container d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmit} 
            className="d-flex align-items-center" 
            disabled={!formData.title?.trim() || isSubmitting}
          >
            <FaSave className="me-2" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditor;