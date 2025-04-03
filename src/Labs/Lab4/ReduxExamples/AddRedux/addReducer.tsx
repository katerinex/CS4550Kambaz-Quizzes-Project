//src/Labs/Lab4/ReduxExamples/AddRedux/addReducer.tsx
import { createSlice } from "@reduxjs/toolkit";
export interface AddState {
  sum: number;
}
const initialState = {
  sum: 0,
};
const addSlice = createSlice({
  name: "add",
  initialState,
  reducers: {
    add: (state, action) => {
      state.sum = action.payload.a + action.payload.b;
    },
  },
});
export const { add } = addSlice.actions;
export default addSlice.reducer;
