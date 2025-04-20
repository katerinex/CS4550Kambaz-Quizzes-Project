// src/Kambaz/Courses/Modules/client.ts

import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

export const findAllModules = async () => {
  const response = await axiosWithCredentials.get(MODULES_API);
  return response.data;
};

export const findModuleById = async (moduleId: string) => {
  const response = await axiosWithCredentials.get(`${MODULES_API}/${moduleId}`);
  return response.data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

export const updateModule = async (module: any) => {
  const { data } = await axiosWithCredentials.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const findLessonsForModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.get(`${MODULES_API}/${moduleId}/lessons`);
  return response.data;
};