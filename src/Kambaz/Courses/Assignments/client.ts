// src/Kambaz/Courses/Assignments/client.ts

import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

export const createAssignment = async (assignment: any) => {
  const response = await axios.post(ASSIGNMENTS_API, assignment);
  return response.data;
};

export const findAllAssignments = async () => {
  const response = await axios.get(ASSIGNMENTS_API);
  return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const response = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
};

export const deleteAssignment = async (assignmentId: string) => {
  await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/assignments`);
  return response.data;
};