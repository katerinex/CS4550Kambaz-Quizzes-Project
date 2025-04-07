// src/Kambaz/Account/client.ts
import axios from "axios";

// Safe access to environment variables with better fallbacks
const getRemoteServer = () => {
  // First check for explicit environment variable
  if (import.meta.env.VITE_REMOTE_SERVER) {
    return import.meta.env.VITE_REMOTE_SERVER;
  }
  
  // For production builds, use window.location-based fallback
  if (import.meta.env.PROD) {
    // Extract origin from current URL for same-origin API calls in production
    // This helps when deployed without explicit env vars
    const isLocalHost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    if (!isLocalHost) {
      // Check if we're on Netlify pointing to Render
      if (window.location.hostname.includes('netlify')) {
        return 'https://kambaz-node-server-app-9l9f.onrender.com';
      }
    }
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
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Regular axios instance without credentials for token-based auth
const axiosInstance = axios.create({
  baseURL: REMOTE_SERVER,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request/response interceptors for debugging
axiosWithCredentials.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosWithCredentials.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
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

// Token-based authentication for environments where cookies don't work
export const tokenSignin = async (credentials: any) => {
  try {
    console.log("Attempting token-based signin");
    const response = await axiosInstance.post(`${REMOTE_SERVER}/api/users/token-signin`, credentials);
    // Store the user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    console.log("Token signin successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Token signin failed:", error);
    throw error;
  }
};

export const tokenSignup = async (user: any) => {
  try {
    console.log("Attempting token-based signup");
    const response = await axiosInstance.post(`${REMOTE_SERVER}/api/users/token-signup`, user);
    // Store the user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    console.log("Token signup successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Token signup failed:", error);
    throw error;
  }
};

// Add authentication check endpoint
export const checkAuth = async () => {
  try {
    // First try the session-based approach
    console.log("Checking authentication status via session...");
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/profile`);
    return { isAuthenticated: true, user: response.data };
  } catch (sessionError) {
    // If session check fails, look for user in localStorage
    console.log("Session auth check failed, checking localStorage...");
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("Found authenticated user in localStorage:", user.username);
        return { isAuthenticated: true, user };
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('currentUser');
      }
    }
    console.log("User is not authenticated");
    return { isAuthenticated: false, user: null };
  }
};

export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const signin = async (credentials: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    console.log("Signin response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signin failed:", error);
    throw error;
  }
};

export const signup = async (user: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    console.log("Signup response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const updateUser = async (user: any) => {
  try {
    // Try with credentials first
    try {
      const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
      console.log("Update user response:", response.data);
      return response.data;
    } catch (error) {
      // If that fails and we have a stored user, use token approach
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const response = await axiosInstance.put(`${USERS_API}/${user._id}`, user);
        // Update the stored user
        localStorage.setItem('currentUser', JSON.stringify({
          ...JSON.parse(storedUser),
          ...response.data
        }));
        return response.data;
      }
      throw error;
    }
  } catch (error) {
    console.error("Update user failed:", error);
    throw error;
  }
};

export const profile = async () => {
  try {
    console.log("Fetching user profile...");
    
    // Try session-based auth first
    try {
      const response = await axiosWithCredentials.get(`${USERS_API}/profile`);
      console.log("Profile response (session):", response.data);
      return response.data;
    } catch (sessionError) {
      // If session fails, try token-based auth
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("Profile response (token):", user);
        return user;
      }
      // If both fail, rethrow the original error
      throw sessionError;
    }
  } catch (error) {
    console.error("Profile fetch failed:", error);
    throw error;
  }
};

export const signout = async () => {
  try {
    // Clear localStorage user
    localStorage.removeItem('currentUser');
    
    // Also try to clear server session if possible
    try {
      const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
      console.log("Signout response:", response.data);
    } catch (error) {
      console.log("Server signout failed, but local token cleared");
    }
    return null;
  } catch (error) {
    console.error("Signout failed:", error);
    throw error;
  }
};

export const findMyCourses = async () => {
  try {
    console.log("Fetching current user's courses...");
    
    // Try with session auth first
    try {
      const response = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
      console.log("Find my courses response:", response.data);
      return response.data;
    } catch (sessionError) {
      // If that fails and we have a stored user, try a direct request with the user ID
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await axiosInstance.get(`${USERS_API}/${user._id}/courses`);
        return response.data;
      }
      throw sessionError;
    }
  } catch (error) {
    console.error("Find my courses failed:", error);
    throw error;
  }
};

export const createCourse = async (course: any) => {
  try {
    // Try with session auth first
    try {
      const response = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
      console.log("Create course response:", response.data);
      return response.data;
    } catch (sessionError) {
      // If that fails and we have a stored user, use a direct endpoint
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // This endpoint would need to be added to the backend
        const response = await axiosInstance.post(`${USERS_API}/${user._id}/new-course`, 
          { ...course, creator: user._id });
        return response.data;
      }
      throw sessionError;
    }
  } catch (error) {
    console.error("Create course failed:", error);
    throw error;
  }
};

export const findAllUsers = async () => {
  try {
    const response = await axiosWithCredentials.get(USERS_API);
    return response.data;
  } catch (error) {
    console.error("Find all users failed:", error);
    throw error;
  }
};

export const findUsersByRole = async (role: string) => {
  try {
    const response = await axiosWithCredentials.get(`${USERS_API}?role=${role}`);
    return response.data;
  } catch (error) {
    console.error(`Find users by role "${role}" failed:`, error);
    throw error;
  }
};

export const findUsersByPartialName = async (name: string) => {
  try {
    const response = await axiosWithCredentials.get(`${USERS_API}?name=${name}`);
    return response.data;
  } catch (error) {
    console.error(`Find users by name "${name}" failed:`, error);
    throw error;
  }
};

export const findUserById = async (id: string) => {
  try {
    const response = await axiosWithCredentials.get(`${USERS_API}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Find user by ID "${id}" failed:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Delete user "${userId}" failed:`, error);
    throw error;
  }
};

export const createUser = async (user: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}`, user);
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
    const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/courses`);
    console.log(`Found ${response.data?.length || 0} courses for user ${userId}`);
    // Validate the response
    if (!response.data) {
      console.warn("Empty response from courses endpoint");
      return [];
    }
    // If we got a non-array response, log it but return an empty array
    if (!Array.isArray(response.data)) {
      console.error("Expected array but got:", typeof response.data, response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error(`Find courses for user "${userId}" failed:`, error);
    throw error;
  }
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  // Add validation
  if (!userId || !courseId || courseId === "undefined") {
    console.error(`Invalid parameters for enrollment - userId: ${userId}, courseId: ${courseId}`);
    throw new Error("Both valid user ID and course ID are required for enrollment");
  }
  console.log(`Enrolling user ${userId} in course ${courseId}`);
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
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
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
    console.log("Unenrollment response:", response.status);
    return response.data;
  } catch (error) {
    console.error(`Unenrolling user "${userId}" from course "${courseId}" failed:`, error);
    throw error;
  }
};