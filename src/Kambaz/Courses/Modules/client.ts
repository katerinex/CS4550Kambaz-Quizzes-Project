// src/Kambaz/Courses/Modules/client.ts
import axios, { AxiosError } from 'axios';
import { Module } from './reducer';

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

// Fetch a single module by ID
export const findModule = async (moduleId: string): Promise<Module> => {
  try {
    const response = await axios.get(`${MODULES_API}/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching module ${moduleId}:`, error);
    throw error;
  }
};

// Update an existing module
export const updateModule = async (module: Module): Promise<Module> => {
  try {
    console.log('Client sending module update:', JSON.stringify(module, null, 2));
    const response = await axios.put(`${MODULES_API}/${module._id}`, module);
    console.log('Update module response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error updating module:', 
      axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// Delete a module
export const deleteModule = async (moduleId: string): Promise<void> => {
  try {
    await axios.delete(`${MODULES_API}/${moduleId}`);
  } catch (error) {
    console.error(`Error deleting module ${moduleId}:`, error);
    throw error;
  }
};

// Fetch all lessons for a module
export const findLessonsForModule = async (moduleId: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${MODULES_API}/${moduleId}/lessons`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lessons for module ${moduleId}:`, error);
    throw error;
  }
};

// Add a lesson to a module
export const createLessonForModule = async (moduleId: string, lesson: any): Promise<any> => {
  try {
    const response = await axios.post(`${MODULES_API}/${moduleId}/lessons`, lesson);
    return response.data;
  } catch (error) {
    console.error(`Error creating lesson for module ${moduleId}:`, error);
    throw error;
  }
};

// Update a lesson
export const updateLesson = async (lessonId: string, lesson: any): Promise<any> => {
  try {
    const response = await axios.put(`${REMOTE_SERVER}/api/lessons/${lessonId}`, lesson);
    return response.data;
  } catch (error) {
    console.error(`Error updating lesson ${lessonId}:`, error);
    throw error;
  }
};

// Delete a lesson
export const deleteLesson = async (lessonId: string): Promise<void> => {
  try {
    await axios.delete(`${REMOTE_SERVER}/api/lessons/${lessonId}`);
  } catch (error) {
    console.error(`Error deleting lesson ${lessonId}:`, error);
    throw error;
  }
};

export default {
  findModule,
  updateModule,
  deleteModule,
  findLessonsForModule,
  createLessonForModule,
  updateLesson,
  deleteLesson
};