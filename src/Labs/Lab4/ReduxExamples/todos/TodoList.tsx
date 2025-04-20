// src/Labs/Lab4/ReduxExamples/todos/TodoList.tsx
import { ListGroup } from 'react-bootstrap';
import { useSelector } from "react-redux";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = useSelector((state: any) => state.todosReducer.todos);
  return (
    <div>
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}