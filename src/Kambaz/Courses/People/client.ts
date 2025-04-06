// src/Kambaz/Courses/People/client.ts
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findUsersForCourse = async (courseId: string) => {
  try {
    const response = await axios.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
  } catch (error) {
    console.error("Error in findUsersForCourse:", error);
    return [];
  }
};

export const createUser = async (user: any) => {
  const response = await axios.post(USERS_API, user);
  return response.data;
};

export const updateUser = async (user: any) => {
  await axios.put(`${USERS_API}/${user._id}`, user);
};

export const deleteUser = async (userId: string) => {
  await axios.delete(`${USERS_API}/${userId}`);
};

export const findUserById = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/${userId}`);
  return response.data;
};