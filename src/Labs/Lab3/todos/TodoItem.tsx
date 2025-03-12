// src/Labs/Lab3/todos/TodoItem.tsx
import { Todo } from "./types";

const TodoItem = ({
  todo = {
    id: 1, // default values
    done: true,
    title: "Buy milk",
    status: "COMPLETED",
  },
}: { todo: Todo }) => {
  return (
    <li className="list-group-item">
      <input type="checkbox" className="me-2" defaultChecked={todo.done} />
      {todo.title} ({todo.status})
    </li>
  );
};
export default TodoItem;
