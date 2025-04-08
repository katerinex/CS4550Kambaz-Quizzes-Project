// src/Labs/Lab4/ReduxExamples/todos/TodoForm.tsx

import {  Button, ListGroup, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroup.Item className="d-flex align-items-center">
      <FormControl
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        className="me-2"
      />
      <Button
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        className="me-1"
        variant="success"
      >
        Add
      </Button>
      <Button
        onClick={() => dispatch(updateTodo(todo))}
        id="wd-update-todo-click"
        variant="warning"
      >
        Update
      </Button>
    </ListGroup.Item>
  );
}

  