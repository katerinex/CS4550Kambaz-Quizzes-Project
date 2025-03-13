// src/Labs/Lab3/todos/todosReducer.ts
import { createSlice } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  title: string;
}

const initialState = {
  todos: [] as Todo[],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {}
});

export default todosSlice.reducer;
