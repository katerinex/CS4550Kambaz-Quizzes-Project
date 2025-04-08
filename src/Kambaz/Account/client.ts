// src/Kambaz/Account/client.ts
import axios from "axios";

// Safe access to environment variables with better fallbacks
const getRemoteServer = () => {
  // First check for explicit environment variable
  if (import.meta.env.VITE_REMOTE_SERVER) {
    console.log("Using VITE_REMOTE_SERVER:", import.meta.env.VITE_REMOTE_SERVER);
    return import.meta.env.VITE_REMOTE_SERVER;
  }
  
  // For production builds, use window.location-based fallback
  if (import.meta.env.PROD) {
    // Extract origin from current URL for same-origin API calls in production
    // This helps when deployed without explicit env vars
    const isLocalHost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    console.log("Hostname:", window.location.hostname);
    console.log("Is Netlify site:", window.location.hostname.includes('netlify'));
    
    if (!isLocalHost) {
      // Check if we're on Netlify pointing to Render
      if (window.location.hostname.includes('netlify')) {
        console.log("Detected Netlify host, using hardcoded Render URL");
        return 'https://kambaz-node-server-app-9l9f.onrender.com';
      }
    }
  }
  
  // Default to localhost in development
  console.log("Using default localhost API URL");
  return 'http://localhost:4000';
};

const REMOTE_SERVER = getRemoteServer();
console.log("API server URL:", REMOTE_SERVER);

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

// Add request/response interceptors for debugging
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log("Request with credentials:", config.withCredentials);
    console.log("Request headers:", config.headers);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    console.log("Response headers:", response.headers);
    
    // Log any Set-Cookie headers (though browsers typically hide these)
    if (response.headers['set-cookie']) {
      console.log("Set-Cookie header present");
    }
    
    return response;
  },
  error => {
    if (error.response) {
      console.error(`API Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Request configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Test connection to ensure server is reachable
export const testConnection = async () => {
  try {
    const response = await api.get(`${API_BASE}/test`);
    console.log("Connection test successful:", response.data);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
};

// Cookie-based authentication functions
export const checkAuth = async () => {
  try {
    console.log("Checking authentication status via session...");
    const response = await api.get(`${USERS_API}/profile`);
    console.log("Session auth response:", response.data);
    return { isAuthenticated: true, user: response.data };
  } catch (error) {
    console.log("User is not authenticated");
    return { isAuthenticated: false, user: null };
  }
};

export const signin = async (credentials: any) => {
  try {
    // Try connection test first
    await testConnection();
    
    // Then attempt signin
    const response = await api.post(`${USERS_API}/signin`, credentials, {
      withCredentials: true, // Explicitly ensure credentials are sent
    });
    
    console.log("Signin response:", response.data);
    
    // Verify the authentication immediately
    try {
      const authCheck = await api.get(`${API_BASE}/auth-status`);
      console.log("Auth check after signin:", authCheck.data);
    } catch (err) {
      console.warn("Auth check failed after signin:", err);
    }
    
    return response.data;
  } catch (error) {
    console.error("Signin failed:", error);
    throw error;
  }
};

export const signup = async (user: any) => {
  try {
    // Try connection test first
    await testConnection();
    
    const response = await api.post(`${USERS_API}/signup`, user, {
      withCredentials: true, // Explicitly ensure credentials are sent
    });
    
    console.log("Signup response:", response.data);
    
    // Verify the authentication immediately
    try {
      const authCheck = await api.get(`${API_BASE}/auth-status`);
      console.log("Auth check after signup:", authCheck.data);
    } catch (err) {
      console.warn("Auth check failed after signup:", err);
    }
    
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const updateUser = async (user: any) => {
  try {
    const response = await api.put(`${USERS_API}/${user._id}`, user);
    console.log("Update user response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update user failed:", error);
    throw error;
  }
};

export const profile = async () => {
  try {
    console.log("Fetching user profile...");
    const response = await api.get(`${USERS_API}/profile`);
    console.log("Profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Profile fetch failed:", error);
    throw error;
  }
};

export const signout = async () => {
  try {
    const response = await api.post(`${USERS_API}/signout`);
    console.log("Signout response:", response.data);
    return null;
  } catch (error) {
    console.error("Signout failed:", error);
    throw error;
  }
};

export const findMyCourses = async () => {
  try {
    console.log("Fetching current user's courses...");
    const response = await api.get(`${USERS_API}/current/courses`);
    console.log("Find my courses response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Find my courses failed:", error);
    throw error;
  }
};

export const createCourse = async (course: any) => {
  try {
    console.log(`Making request to: ${USERS_API}/current/courses`);
    const response = await api.post(`${USERS_API}/current/courses`, course);
    console.log("Create course response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Create course failed:", error);
    throw error;
  }
};

export const findAllUsers = async () => {
  try {
    const response = await api.get(USERS_API);
    return response.data;
  } catch (error) {
    console.error("Find all users failed:", error);
    throw error;
  }
};

export const findUsersByRole = async (role: string) => {
  try {
    const response = await api.get(`${USERS_API}?role=${role}`);
    return response.data;
  } catch (error) {
    console.error(`Find users by role "${role}" failed:`, error);
    throw error;
  }
};

export const findUsersByPartialName = async (name: string) => {
  try {
    const response = await api.get(`${USERS_API}?name=${name}`);
    return response.data;
  } catch (error) {
    console.error(`Find users by name "${name}" failed:`, error);
    throw error;
  }
};

export const findUserById = async (id: string) => {
  try {
    const response = await api.get(`${USERS_API}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Find user by ID "${id}" failed:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`${USERS_API}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Delete user "${userId}" failed:`, error);
    throw error;
  }
};

export const createUser = async (user: any) => {
  try {
    const response = await api.post(`${USERS_API}`, user);
    return response.data;
  } catch (error) {
    console.error("Create user failed:", error);
    throw error;
  }
};

export const findCoursesForUser = async (userId: string) => {
  if (!userId) {
    console.error("findCoursesForUser called with no userId");
    throw new Error("User ID is required");
  }
  console.log(`Fetching courses for user ${userId}`);
  
  try {
    console.log(`Making request to: ${USERS_API}/${userId}/courses`);
    const response = await api.get(`${USERS_API}/${userId}/courses`);
    console.log(`Found ${response.data?.length || 0} courses for user ${userId}`);
    return validateCoursesResponse(response.data);
  } catch (error) {
    console.error(`Find courses for user "${userId}" failed:`, error);
    throw error;
  }
};

// Helper to validate courses response
const validateCoursesResponse = (data: any) => {
  // Validate the response
  if (!data) {
    console.warn("Empty response from courses endpoint");
    return [];
  }
  // If we got a non-array response, log it but return an empty array
  if (!Array.isArray(data)) {
    console.error("Expected array but got:", typeof data, data);
    return [];
  }
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  // Add validation
  if (!userId || !courseId || courseId === "undefined") {
    console.error(`Invalid parameters for enrollment - userId: ${userId}, courseId: ${courseId}`);
    throw new Error("Both valid user ID and course ID are required for enrollment");
  }
  console.log(`Enrolling user ${userId} in course ${courseId}`);
  
  try {
    console.log(`Making request to: ${USERS_API}/${userId}/courses/${courseId}`);
    const response = await api.post(`${USERS_API}/${userId}/courses/${courseId}`);
    console.log("Enrollment response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Enrolling user "${userId}" in course "${courseId}" failed:`, error);
    throw error;
  }
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  // Add validation
  if (!userId || !courseId) {
    console.error(`Invalid parameters for unenrollment - userId: ${userId}, courseId: ${courseId}`);
    throw new Error("Both user ID and course ID are required for unenrollment");
  }
  console.log(`Unenrolling user ${userId} from course ${courseId}`);
  
  try {
    console.log(`Making request to: ${USERS_API}/${userId}/courses/${courseId}`);
    const response = await api.delete(`${USERS_API}/${userId}/courses/${courseId}`);
    console.log("Unenrollment response:", response.status);
    return response.data;
  } catch (error) {
    console.error(`Unenrolling user "${userId}" from course "${courseId}" failed:`, error);
    throw error;
  }
};