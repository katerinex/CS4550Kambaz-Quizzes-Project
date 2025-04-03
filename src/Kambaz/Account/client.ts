// src/Kambaz/Account/client.ts
import axios from "axios";
// Safe access to environment variables with fallbacks
const getRemoteServer = () => {
  // First check for explicit environment variable
  if (import.meta.env.VITE_REMOTE_SERVER) {
    return import.meta.env.VITE_REMOTE_SERVER;
  }
  // Default to localhost in development
  return 'http://localhost:4000';
};
const REMOTE_SERVER = getRemoteServer();
console.log("API server URL:", REMOTE_SERVER);
// Configure axios with better defaults
const axiosWithCredentials = axios.create({
  withCredentials: true,
  baseURL: REMOTE_SERVER,
  timeout: 8000 // 8 second timeout
});
export const USERS_API = `${REMOTE_SERVER}/api/users`;
export const signin = async (credentials: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    return response.data;
  } catch (error) {
    console.error("Signin failed");
    throw error;
  }
};
export const signup = async (user: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
  } catch (error) {
    console.error("Signup failed");
    throw error;
  }
};
export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};
export const profile = async () => {
  try {
    // CHANGED FROM POST TO GET - this is the crucial fix
    const response = await axiosWithCredentials.get(`${USERS_API}/profile`);
    return response.data;
  } catch (error) {
    // This error is expected when not logged in
    throw error;
  }
};
export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};
export const findMyCourses = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return response.data;
};
export const createCourse = async (course: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return response.data;
};
export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};
export const findUsersByRole = async (role: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}?role=${role}`);
  return response.data;
};
export const findUsersByPartialName = async (name: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}?name=${name}`);
  return response.data;
};
export const findUserById = async (id: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${id}`);
  return response.data;
};
export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};
export const createUser = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}`, user);
  return response.data;
};
export const findCoursesForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/courses`);
  return response.data;
};
export const enrollIntoCourse = async (userId: string, courseId: string) => {
  // Add validation
  if (!userId || !courseId || courseId === "undefined") {
    console.error(`Invalid parameters for enrollment - userId: ${userId}, courseId: ${courseId}`);
    throw new Error("Both valid user ID and course ID are required for enrollment");
  }
  
  console.log(`Enrolling user ${userId} in course ${courseId}`);
  const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  // Add validation
  if (!userId || !courseId) {
    console.error(`Invalid parameters for unenrollment - userId: ${userId}, courseId: ${courseId}`);
    throw new Error("Both user ID and course ID are required for unenrollment");
  }
  
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};