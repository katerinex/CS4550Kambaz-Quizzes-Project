

// src/Kambaz/Courses/Assignments/client.ts


import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

export const createAssignment = async (assignment: any) => {
  try {
    // Ensure published field is included
    const assignmentWithPublished = {
      ...assignment,
      published: assignment.published === true
    };
    
    console.log("Creating assignment with data:", assignmentWithPublished);
    const response = await axios.post(ASSIGNMENTS_API, assignmentWithPublished);
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
    // Ensure published field is properly set (not undefined)
    const assignmentWithPublished = {
      ...assignment,
      published: assignment.published === true
    };
    
    console.log("Updating assignment with data:", assignmentWithPublished);
    await axios.put(
      `${ASSIGNMENTS_API}/${assignment._id}`,
      assignmentWithPublished
    );
    
    // Verify the update went through by fetching the updated assignment
    const updatedAssignment = await findAssignmentById(assignment._id);
    console.log("Assignment after update:", updatedAssignment);
    
    return updatedAssignment;
  } catch (error) {
    console.error(`Error updating assignment ${assignment._id}:`, error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  try {
    await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  } catch (error) {
    console.error(`Error deleting assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const findAssignmentsForCourse = async (courseId: string) => {
  try {
    const response = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/assignments`);
    return response.data;
  } catch (error) {
    console.error(`Error finding assignments for course ${courseId}:`, error);
    throw error;
  }
};

export const toggleAssignmentPublishStatus = async (assignmentId: string, published: boolean) => {
  try {
    console.log(`Toggling assignment ${assignmentId} published status to ${published}`);
    const assignment = await findAssignmentById(assignmentId);
    
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    
    const updatedAssignment = {
      ...assignment,
      published: published
    };
    
    return await updateAssignment(updatedAssignment);
  } catch (error) {
    console.error(`Error toggling publish status for assignment ${assignmentId}:`, error);
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