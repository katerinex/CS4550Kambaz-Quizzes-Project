// src/Labs/Lab5/WorkingWithArraysAsynchronously.tsx
import { useState, useEffect } from "react";
import { ListGroup, FormControl } from "react-bootstrap";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fetchTodos = async () => {
    try {
      const response = await client.fetchTodos();
      // Ensure we're setting an array to state
      setTodos(Array.isArray(response) ? response : []);
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      setErrorMessage(error?.message || "Failed to fetch todos");
      setTodos([]); // Ensure todos is always an array even on error
    }
  };
  
  const removeTodo = async (todo: any) => {
    try {
      const updatedTodos = await client.removeTodo(todo);
      // Ensure we're setting an array to state
      setTodos(Array.isArray(updatedTodos) ? updatedTodos : []);
    } catch (error: any) {
      console.error("Error removing todo:", error);
      setErrorMessage(error?.message || "Failed to remove todo");
    }
  };
  
  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to delete todo");
    }
  };
  
  const createTodo = async () => {
    try {
      const response = await client.createTodo();
      // Ensure we're setting an array to state
      setTodos(Array.isArray(response) ? response : []);
    } catch (error: any) {
      console.error("Error creating todo:", error);
      setErrorMessage(error?.message || "Failed to create todo");
    }
  };
  
  const postTodo = async () => {
    try {
      const newTodo = await client.postTodo({
        title: "New Posted Todo",
        completed: false,
      });
      setTodos([...todos, newTodo]);
    } catch (error: any) {
      console.error("Error posting todo:", error);
      setErrorMessage(error?.message || "Failed to post todo");
    }
  };
  
  const editTodo = (todo: any) => {
    const updatedTodos = todos.map((t) =>
      t.id === todo.id ? { ...todo, editing: true } : t
    );
    setTodos(updatedTodos);
  };
  
  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to update todo");
    }
  };
  
  useEffect(() => {
    fetchTodos();
  }, []);
  
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div
          id="wd-todo-error-message"
          className="alert alert-danger mb-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
      <h4>
        Todos
        <FaPlusCircle
          onClick={createTodo}
          className="text-success float-end fs-3"
          id="wd-create-todo"
        />
        <FaPlusCircle
          onClick={postTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
        />
      </h4>
      <ListGroup>
        {/* Safeguard the rendering with Array.isArray check */}
        {Array.isArray(todos) && todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />
            <input
              type="checkbox"
              defaultChecked={todo.completed}
              className="form-check-input me-2 float-start"
              onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
            />
            {!todo.editing ? (
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            ) : (
              <FormControl
                className="w-50 float-start"
                defaultValue={todo.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) =>
                  updateTodo({ ...todo, title: e.target.value })
                }
              />
            )}
            <FaTrash
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1"
              id="wd-remove-todo"
            />
            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}