// src/Kambaz/Courses/Assignments/client.ts
import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

// Helper function to format dates properly for API calls
const formatAssignment = (assignment: any) => {
  const formatted = { ...assignment };
  
  // Ensure published field is a boolean
  formatted.published = assignment.published === true;
  
  // Ensure group exists for UI grouping
  if (!formatted.group) {
    formatted.group = "Assignments";
  }
  
  // Convert empty strings to null for date fields
  if (formatted.dueDate === "") formatted.dueDate = null;
  if (formatted.availableFromDate === "") formatted.availableFromDate = null;
  if (formatted.availableUntilDate === "") formatted.availableUntilDate = null;
  
  return formatted;
};

export const createAssignment = async (assignment: any) => {
  try {
    console.log("Creating assignment with data:", assignment);
    const response = await axios.post(ASSIGNMENTS_API, formatAssignment(assignment));
    return response.data;
  } catch (error) {
    console.error("Error creating assignment:", error);
    throw error;
  }
};

export const findAllAssignments = async () => {
  try {
    const response = await axios.get(ASSIGNMENTS_API);
    return response.data;
  } catch (error) {
    console.error("Error finding all assignments:", error);
    throw error;
  }
};

export const findAssignmentById = async (assignmentId: string) => {
  try {
    const response = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error finding assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const updateAssignment = async (assignment: any) => {
  try {
    console.log("Updating assignment with data:", assignment);
    const formattedAssignment = formatAssignment(assignment);
    const response = await axios.put(
      `${ASSIGNMENTS_API}/${assignment._id}`,
      formattedAssignment
    );
    
    // Return the response data instead of making another API call
    return response.data;
  } catch (error) {
    console.error(`Error updating assignment ${assignment._id}:`, error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  try {
    await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const findAssignmentsForCourse = async (courseId: string) => {
  try {
    console.log(`Finding assignments for course: ${courseId}`);
    const response = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/assignments`);
    
    // Ensure each assignment has a group for proper UI display
    const assignments = response.data.map((a: any) => ({
      ...a,
      group: a.group || "Assignments" // Default group if none exists
    }));
    
    console.log(`Found ${assignments.length} assignments for course ${courseId}`);
    return assignments;
  } catch (error) {
    console.error(`Error finding assignments for course ${courseId}:`, error);
    throw error;
  }
};

export const togglePublishStatus = async (assignmentId: string) => {
  try {
    console.log(`Using toggle-publish endpoint for assignment ${assignmentId}`);
    const response = await axios.patch(`${ASSIGNMENTS_API}/${assignmentId}/toggle-publish`);
    console.log("Toggle publish response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error toggling publish status for assignment ${assignmentId}:`, error);
    throw error;
  }
};