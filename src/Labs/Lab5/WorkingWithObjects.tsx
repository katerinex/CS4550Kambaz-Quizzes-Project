//src/Labs/Lab5/WorkingWithObjects.tsx
import { useState } from "react";
import { FormControl } from "react-bootstrap";
//const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
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
    course: "Web Programming"
  });

  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

  const updateTitle = async () => {
    try {
      await fetch(`${ASSIGNMENT_API_URL}/title/${assignment.title}`);
      console.log("Title updated on server");
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const updateModuleName = async () => {
    try {
      await fetch(`${MODULE_API_URL}/name/${module.name}`);
      console.log("Module name updated on server");
    } catch (error) {
      console.error("Error updating module name:", error);
    }
  };

  const updateModuleDescription = async () => {
    try {
      await fetch(`${MODULE_API_URL}/description/${module.description}`);
      console.log("Module description updated on server");
    } catch (error) {
      console.error("Error updating module description:", error);
    }
  };

  const updateAssignmentScore = async () => {
    try {
      await fetch(`${ASSIGNMENT_API_URL}/score/${assignment.score}`);
      console.log("Assignment score updated on server");
    } catch (error) {
      console.error("Error updating assignment score:", error);
    }
  };

  const updateAssignmentCompleted = async () => {
    try {
      await fetch(`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`);
      console.log("Assignment completed status updated on server");
    } catch (error) {
      console.error("Error updating assignment completed status:", error);
    }
  };

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      
      <h4>Module Object</h4>
      <a id="wd-retrieve-module" className="btn btn-primary" href={MODULE_API_URL}>
        Get Module
      </a>
      <a id="wd-retrieve-module-name" className="btn btn-primary ms-2" href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a>
      
      <h4>Edit Module</h4>
      <FormControl 
        className="w-75 mb-2" 
        value={module.name} 
        onChange={(e) => setModule({ ...module, name: e.target.value })} 
      />
      <button className="btn btn-primary" onClick={updateModuleName}>Update Module Name</button>
      
      <FormControl 
        className="w-75 mb-2 mt-2" 
        value={module.description} 
        onChange={(e) => setModule({ ...module, description: e.target.value })} 
      />
      <button className="btn btn-primary" onClick={updateModuleDescription}>Update Module Description</button>

      <h4>Edit Assignment</h4>
      <FormControl 
        type="number" 
        className="w-75 mb-2" 
        value={assignment.score} 
        onChange={(e) => setAssignment({ ...assignment, score: parseInt(e.target.value, 10) })} 
      />
      <button className="btn btn-primary" onClick={updateAssignmentScore}>Update Assignment Score</button>
      
      <div className="form-check mt-2">
        <input 
          type="checkbox" 
          className="form-check-input" 
          checked={assignment.completed} 
          onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })} 
        />
        <label className="form-check-label">Completed</label>
      </div>
      <button className="btn btn-primary mt-2" onClick={updateAssignmentCompleted}>Update Assignment Completed</button>

      <FormControl
         className="w-75 mb-2 mt-2"
          value={assignment.title}
          onChange={(e) => setAssignment({...assignment, title: e.target.value})}
      />
      <button className = "btn btn-primary mt-2" onClick={updateTitle}> Update Assignment Title</button>

      <hr />
    </div>
  );
}