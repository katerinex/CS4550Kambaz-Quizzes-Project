// src/Kambaz/Courses/CourseForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Course } from "../types";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
}

const defaultCourse: Course = {
  _id: "",
  name: "",
  number: "",
  startDate: "",
  endDate: "",
  description: ""
};

const CourseForm: React.FC<CourseFormProps> = ({ 
  course = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Course>(course || defaultCourse);
  
  // Reset form when course prop changes
  useEffect(() => {
    setFormData(course || defaultCourse);
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Course Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter course name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Course Number</Form.Label>
        <Form.Control
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="Enter course number (e.g., CS5610)"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter course description"
          rows={3}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {course ? "Update Course" : "Add Course"}
        </Button>
      </div>
    </Form>
  );
};

export default CourseForm;