// src/Labs/Lab3/todos/TodoItem.tsx

import React from 'react';
import { ListGroup } from 'react-bootstrap'; // Import ListGroup from react-bootstrap

export interface Todo { // Explicitly export the Todo interface
  done: boolean;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'; // Define possible status types
}

interface TodoItemProps {
  todo?: Todo; // Make todo prop optional with a default value
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo = { done: true, title: 'Buy milk', status: 'COMPLETED' },
}) => {
  return (
    <ListGroup.Item>
      <input
        type="checkbox"
        className="me-2"
        defaultChecked={todo.done}
      />
      {todo.title} ({todo.status})
    </ListGroup.Item>
  );
};

export default TodoItem;
