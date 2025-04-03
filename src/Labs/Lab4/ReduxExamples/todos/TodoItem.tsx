// src/Labs/Lab4/ReduxExamples/todos/TodoItem.tsx
// Remove redundant key from TodoItem as it's now in TodoList
import { Button, ListGroup } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
  };
}

export default function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useDispatch();
  return (
    <ListGroup.Item>
      <Button onClick={() => dispatch(deleteTodo(todo.id))} id="wd-delete-todo-click">
        Delete
      </Button>
      <Button onClick={() => dispatch(setTodo(todo))} id="wd-set-todo-click">
        Edit
      </Button>
      {todo.title}
    </ListGroup.Item>
  );
}

// Fix for other components with the "key" warning:
// The pattern will be similar for AddingAndRemovingToFromArrays, MapFunction, and SimpleArrays.
// For each component that maps over arrays to create elements, add a key prop:
