// src/Labs/Lab4/ReduxExamples/todos/TodoItem.tsx
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
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <span>{todo.title}</span>
      <div>
        <Button
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
          className="me-1"
          size="sm"
          variant="primary"
        >
          Edit
        </Button>
        <Button
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
}
