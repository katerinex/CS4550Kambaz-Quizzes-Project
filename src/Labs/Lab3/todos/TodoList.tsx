// src/Labs/Lab3/todos/TodoList.tsx

import TodoItem, { Todo } from "./TodoItem"; // Corrected import of Todo
import todosData from "./todos.json"; // Renamed import for clarity
import { ListGroup } from 'react-bootstrap'; // Import ListGroup

interface TodoItemData {
  title: string;
  status: string;
  done: boolean;
}

export default function TodoList() {
  return (
    <>
      <h3>Todo List</h3>
      <ListGroup>
        {todosData.map((todo: TodoItemData) => (
          <TodoItem todo={{ ...todo, status: todo.status as Todo['status'] }} key={todo.title} />
        ))}
      </ListGroup>
      <hr />
    </>
  );
}