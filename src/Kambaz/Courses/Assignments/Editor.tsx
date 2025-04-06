// src/Kambaz/Courses/Assignments/Editor.tsx

import { useState, useEffect } from "react";
import { Form, FormControl, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import * as client from "./client";

const AssignmentEditor = () => {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);
  const assignment = assignments.find((a: any) => a._id === aid);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<any>(
    assignment || {
      title: "",
      description: "",
      points: 0,
      dueDate: "",
      availableFromDate: "",
      availableUntilDate: "",
      course: cid,
      published: false
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
        published: false
      });
    }
  }, [assignment, cid, aid]);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setError(null);
      if (assignment) {
        await client.updateAssignment(formData);
        dispatch(updateAssignment(formData));
      } else {
        const createdAssignment = await client.createAssignment({
          ...formData,
          _id: `A${Date.now()}`
        });
        dispatch(addAssignment(createdAssignment));
      }
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
      setError("Failed to save assignment. Please try again.");
    }
  };
  
  return (
    <div id="wd-assignment-editor" className="p-4">
      <h2>
        <span>{cid}</span>
        <span> &gt; Assignments &gt; </span>
        <span>{formData.title || "New Assignment"}</span>
      </h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Assignment Name</Form.Label>
          <FormControl 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Assignment Description</Form.Label>
          <FormControl 
            as="textarea" 
            rows={5} 
            value={formData.description || ""} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Points</Form.Label>
          <FormControl 
            type="number" 
            min="0"
            value={formData.points || 0} 
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Due</Form.Label>
          <FormControl 
            type="datetime-local" 
            value={formData.dueDate || ""} 
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Available from</Form.Label>
          <FormControl 
            type="datetime-local" 
            value={formData.availableFromDate || ""} 
            onChange={(e) => setFormData({ ...formData, availableFromDate: e.target.value })} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Available until</Form.Label>
          <FormControl 
            type="datetime-local" 
            value={formData.availableUntilDate || ""} 
            onChange={(e) => setFormData({ ...formData, availableUntilDate: e.target.value })} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Published (visible to students)"
            checked={formData.published || false}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          />
          <Form.Text className="text-muted">
            Students can only see assignments that are published.
          </Form.Text>
        </Form.Group>
        
        <div className="mt-4">
          <Button variant="secondary" className="me-2" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!formData.title?.trim()}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AssignmentEditor;