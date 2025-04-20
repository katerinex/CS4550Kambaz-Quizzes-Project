// src/Labs/Lab4/ReduxExamples/CounterRedux/counterReducer.tsx

import { createSlice } from "@reduxjs/toolkit";
export interface CounterState {
  count: number;
}
const initialState = {
  count: 0,
};
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count = state.count + 1;
    },
    decrement: (state) => {
      state.count = state.count - 1;
    },
  },
});
export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
