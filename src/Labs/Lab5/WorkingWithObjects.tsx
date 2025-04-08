// src/Labs/Lab5/WorkingWithObjects.tsx
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: "MOD001",
    name: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    course: "Web Programming",
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(ASSIGNMENT_API_URL);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const fetchModule = async () => {
    try {
      const response = await axios.get(MODULE_API_URL);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching module:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const fetchModuleName = async () => {
    try {
      const response = await axios.get(`${MODULE_API_URL}/name`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching module name:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateTitle = async () => {
    try {
      const response = await axios.get(`${ASSIGNMENT_API_URL}/title/${assignment.title}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating title:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateModuleName = async () => {
    try {
      const response = await axios.get(`${MODULE_API_URL}/name/${module.name}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating module name:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateModuleDescription = async () => {
    try {
      const response = await axios.get(`${MODULE_API_URL}/description/${module.description}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating module description:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateAssignmentScore = async () => {
    try {
      const response = await axios.get(`${ASSIGNMENT_API_URL}/score/${assignment.score}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating assignment score:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateAssignmentCompleted = async () => {
    try {
      const response = await axios.get(`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating assignment completed status:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {result && (
        <div className="mt-2 mb-2">
          <h5>Result:</h5>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      <h4>Module Object</h4>
      <button id="wd-retrieve-module" className="btn btn-primary me-2" onClick={fetchModule}>
        Get Module
      </button>
      <button id="wd-retrieve-module-name" className="btn btn-primary" onClick={fetchModuleName}>
        Get Module Name
      </button>
      
      <h4>Assignment Object</h4>
      <button id="wd-retrieve-assignment" className="btn btn-primary" onClick={fetchAssignment}>
        Get Assignment
      </button>
      
      <h4>Edit Module</h4>
      <FormControl 
        className="w-75 mb-2" 
        value={module.name} 
        onChange={(e) => setModule({ ...module, name: e.target.value })} 
      />
      <button className="btn btn-primary" onClick={updateModuleName}>
        Update Module Name
      </button>
      
      <FormControl 
        className="w-75 mb-2 mt-2" 
        value={module.description} 
        onChange={(e) => setModule({ ...module, description: e.target.value })} 
      />
      <button className="btn btn-primary" onClick={updateModuleDescription}>
        Update Module Description
      </button>

      <h4>Edit Assignment</h4>
      <FormControl 
        type="number" 
        className="w-75 mb-2" 
        value={assignment.score} 
        onChange={(e) => setAssignment({ ...assignment, score: parseInt(e.target.value, 10) })} 
      />
      <button className="btn btn-primary" onClick={updateAssignmentScore}>
        Update Assignment Score
      </button>
      
      <div className="form-check mt-2">
        <input 
          type="checkbox" 
          className="form-check-input" 
          checked={assignment.completed} 
          onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })} 
        />
        <label className="form-check-label">Completed</label>
      </div>
      <button className="btn btn-primary mt-2" onClick={updateAssignmentCompleted}>
        Update Assignment Completed
      </button>

      <FormControl
         className="w-75 mb-2 mt-2"
         value={assignment.title}
         onChange={(e) => setAssignment({...assignment, title: e.target.value})}
      />
      <button className="btn btn-primary mt-2" onClick={updateTitle}>
        Update Assignment Title
      </button>

      <hr />
    </div>
  );
}