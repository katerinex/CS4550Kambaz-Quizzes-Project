// src/Kambaz/Enrollments/client.ts
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const enrollUserInCourse = async (user: string, course: string) => {
  const response = await axios.post(ENROLLMENTS_API, { user, course });
  return response.data;
};

export const unenrollUserFromCourse = async (user: string, course: string) => {
  await axios.delete(ENROLLMENTS_API, { data: { user, course } });
};

export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axios.get(`${REMOTE_SERVER}/api/users/${userId}/enrollments`);
  return response.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
    const response = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/enrollments`);
    return response.data;
}
