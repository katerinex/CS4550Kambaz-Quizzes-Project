// src/Labs/Lab5/client.ts
import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export const fetchWelcomeMessage = async () => {
  const response = await axios.get(`${REMOTE_SERVER}/lab5/welcome`);
  return response.data;
};

const ASSIGNMENT_API = `${REMOTE_SERVER}/lab5/assignment`;
export const fetchAssignment = async () => {
  const response = await axios.get(`${ASSIGNMENT_API}`);
  return response.data;
};

export const updateTitle = async (title: string) => {
  const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
  return response.data;
};

const TODOS_API = `${REMOTE_SERVER}/lab5/todos`;
export const fetchTodos = async () => {
  const response = await axios.get(TODOS_API);
  return response.data;
};

export const removeTodo = async (todo: any) => {
  const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return response.data;
};

export const deleteTodo = async (todo: any) => {
  const response = await axios.delete(`${TODOS_API}/${todo.id}`);
  return response.data;
};

export const createTodo = async () => {
  const response = await axios.get(`${TODOS_API}/create`);
  return response.data;
};

export const postTodo = async (todo: any) => {
  const response = await axios.post(`${TODOS_API}`, todo);
  return response.data;
};

export const updateTodo = async (todo: any) => {
  const response = await axios.put(`${TODOS_API}/${todo.id}`, todo);
  return response.data;
};

// Add additional client functions for module and assignment operations
export const fetchModule = async () => {
  const response = await axios.get(`${REMOTE_SERVER}/lab5/module`);
  return response.data;
};

export const updateModuleName = async (name: string) => {
  const response = await axios.get(`${REMOTE_SERVER}/lab5/module/name/${name}`);
  return response.data;
};

export const updateModuleDescription = async (description: string) => {
  const response = await axios.get(`${REMOTE_SERVER}/lab5/module/description/${description}`);
  return response.data;
};

export const updateAssignmentScore = async (score: number) => {
  const response = await axios.get(`${ASSIGNMENT_API}/score/${score}`);
  return response.data;
};

export const updateAssignmentCompleted = async (completed: boolean) => {
  const response = await axios.get(`${ASSIGNMENT_API}/completed/${completed}`);
  return response.data;
};