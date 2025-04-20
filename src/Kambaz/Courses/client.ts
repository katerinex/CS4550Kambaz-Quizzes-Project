// src/Kambaz/Courses/client.ts

import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const axiosWithCredentials = axios.create({ 
  withCredentials: true,
  // Add longer timeout for slower connections
  timeout: 10000 
});

export const findAllCourses = async () => {
  try {
    console.log("Fetching all courses");
    const response = await axiosWithCredentials.get(COURSES_API);
    console.log(`Found ${response.data.length} courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

export const findCourseById = async (courseId: string) => {
  try {
    console.log(`Fetching course with ID: ${courseId}`);
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
};

export const createCourse = async (course: any) => {
  try {
    console.log("Creating course:", course);
    const response = await axiosWithCredentials.post(COURSES_API, course);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const updateCourse = async (course: any) => {
  try {
    console.log(`Updating course ${course._id}:`, course);
    const response = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${course._id}:`, error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    console.log(`Deleting course: ${courseId}`);
    const response = await axiosWithCredentials.delete(`${COURSES_API}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    throw error;
  }
};

// Module-related operations
export const findModulesForCourse = async (courseId: string) => {
  try {
    console.log(`Fetching modules for course: ${courseId}`);
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
    console.log(`Found ${response.data.length} modules for course ${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error);
    throw error;
  }
};

export const createModuleForCourse = async (courseId: string, module: any) => {
  try {
    console.log(`Creating module for course ${courseId}:`, module);
    const response = await axiosWithCredentials.post(
      `${COURSES_API}/${courseId}/modules`, 
      module
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating module for course ${courseId}:`, error);
    throw error;
  }
};

// Assignment-related operations
export const findAssignmentsForCourse = async (courseId: string) => {
  try {
    console.log(`Fetching assignments for course: ${courseId}`);
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/assignments`);
    console.log(`Found ${response.data.length} assignments for course ${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching assignments for course ${courseId}:`, error);
    throw error;
  }
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  try {
    console.log(`Creating assignment for course ${courseId}:`, assignment);
    const response = await axiosWithCredentials.post(
      `${COURSES_API}/${courseId}/assignments`,
      assignment
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating assignment for course ${courseId}:`, error);
    throw error;
  }
};