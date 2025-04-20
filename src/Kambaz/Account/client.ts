// src/Kambaz/Account/client.ts
import axios from "axios";

// Safe access to environment variables with better fallbacks
const getRemoteServer = () => {
  if (import.meta.env.VITE_REMOTE_SERVER) {
    return import.meta.env.VITE_REMOTE_SERVER;
  }
  
  if (import.meta.env.PROD) {
    const isLocalHost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    if (!isLocalHost && window.location.hostname.includes('netlify')) {
      return 'https://kambaz-node-server-app-9l9f.onrender.com';
    }
  }
  
  return 'http://localhost:4000';
};

const REMOTE_SERVER = getRemoteServer();

// Define consistent API URL constants
export const API_BASE = `${REMOTE_SERVER}/api`;
export const USERS_API = `${API_BASE}/users`;
export const COURSES_API = `${API_BASE}/courses`;

// Configure axios with better defaults - only using cookie-based auth
const api = axios.create({
  withCredentials: true,
  baseURL: REMOTE_SERVER,
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cookie-based authentication functions
export const checkAuth = async () => {
  try {
    const response = await api.get(`${USERS_API}/profile`);
    return { isAuthenticated: true, user: response.data };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
};

export const signin = async (credentials: any) => {
  try {
    const response = await api.post(`${USERS_API}/signin`, credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (user: any) => {
  try {
    const response = await api.post(`${USERS_API}/signup`, user, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (user: any) => {
  try {
    const response = await api.put(`${USERS_API}/${user._id}`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const profile = async () => {
  try {
    const response = await api.get(`${USERS_API}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signout = async () => {
  try {
    await api.post(`${USERS_API}/signout`);
    return null;
  } catch (error) {
    throw error;
  }
};

export const findMyCourses = async () => {
  try {
    const response = await api.get(`${USERS_API}/current/courses`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (course: any) => {
  try {
    const response = await api.post(`${USERS_API}/current/courses`, course);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findAllUsers = async () => {
  try {
    const response = await api.get(USERS_API);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findUsersByRole = async (role: string) => {
  try {
    const response = await api.get(`${USERS_API}?role=${role}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findUsersByPartialName = async (name: string) => {
  try {
    const response = await api.get(`${USERS_API}?name=${name}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (id: string) => {
  try {
    const response = await api.get(`${USERS_API}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`${USERS_API}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user: any) => {
  try {
    const response = await api.post(`${USERS_API}`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findCoursesForUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  try {
    const response = await api.get(`${USERS_API}/${userId}/courses`);
    return validateCoursesResponse(response.data);
  } catch (error) {
    throw error;
  }
};

// Helper to validate courses response
const validateCoursesResponse = (data: any) => {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    return [];
  }
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  if (!userId || !courseId || courseId === "undefined") {
    throw new Error("Both valid user ID and course ID are required for enrollment");
  }
  
  try {
    const response = await api.post(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  if (!userId || !courseId) {
    throw new Error("Both user ID and course ID are required for unenrollment");
  }
  
  try {
    const response = await api.delete(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};