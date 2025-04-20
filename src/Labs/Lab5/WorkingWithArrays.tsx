// src/Labs/Lab5/WorkingWithArrays.tsx
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithArrays() {
  const API = `${REMOTE_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const fetchTodoById = async () => {
    try {
      const response = await axios.get(`${API}/${todo.id}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching todo by ID:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const fetchCompletedTodos = async () => {
    try {
      const response = await axios.get(`${API}?completed=true`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching completed todos:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const createTodo = async () => {
    try {
      const response = await axios.get(`${API}/create`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error creating todo:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const deleteTodo = async () => {
    try {
      const response = await axios.get(`${API}/${todo.id}/delete`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error deleting todo:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateTodoTitle = async () => {
    try {
      const response = await axios.get(`${API}/${todo.id}/title/${todo.title}`);
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating todo title:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateTodoCompleted = async () => {
    try {
      const response = await axios.get(
        `${API}/${todo.id}/completed/${!todo.completed}`
      );
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating todo completed status:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  const updateTodoDescription = async () => {
    try {
      const response = await axios.get(
        `${API}/${todo.id}/description/${todo.description}`
      );
      setResult(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Error updating todo description:", error);
      setError(error.response?.data?.message || error.message);
      setResult(null);
    }
  };

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {result && (
        <div className="mt-2 mb-2">
          <h5>Result:</h5>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      <h4>Retrieving Arrays</h4>
      <button id="wd-retrieve-todos" className="btn btn-primary" onClick={fetchTodos}>
        Get Todos
      </button>
      <hr />
      
      <h4>Retrieving an Item from an Array by ID</h4>
      <button
        id="wd-retrieve-todo-by-id"
        className="btn btn-primary float-end"
        onClick={fetchTodoById}
      >
        Get Todo by ID
      </button>
      <FormControl
        id="wd-todo-id"
        value={todo.id}
        className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />
      
      <h3>Filtering Array Items</h3>
      <button
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        onClick={fetchCompletedTodos}
      >
        Get Completed Todos
      </button>
      <hr />
      
      <h3>Creating new Items in an Array</h3>
      <button
        id="wd-create-todo"
        className="btn btn-primary"
        onClick={createTodo}
      >
        Create Todo
      </button>
      <hr />
      
      <h3>Deleting from an Array</h3>
      <button
        id="wd-delete-todo"
        className="btn btn-primary float-end"
        onClick={deleteTodo}
      >
        Delete Todo with ID = {todo.id}
      </button>
      <FormControl
        value={todo.id}
        className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />
      
      <h3>Updating an Item in an Array</h3>
      <button
        className="btn btn-primary float-end"
        onClick={updateTodoTitle}
      >
        Update Todo
      </button>
      <FormControl
        value={todo.id}
        className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <FormControl
        value={todo.title}
        className="w-50 float-start"
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <br />
      <br />
      <hr />
      
      <h3>Updating Todo Properties</h3>
      <button
        className="btn btn-primary float-end"
        onClick={updateTodoCompleted}
      >
        Complete Todo ID = {todo.id}
      </button>
      <div className="form-check mt-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={todo.completed}
          onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
        />
        <label className="form-check-label">Completed</label>
      </div>
      <br />
      <button
        className="btn btn-primary float-end"
        onClick={updateTodoDescription}
      >
        Describe Todo ID = {todo.id}
      </button>
      <FormControl
        value={todo.description}
        className="w-50"
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
      />
      <hr />
    </div>
  );
}