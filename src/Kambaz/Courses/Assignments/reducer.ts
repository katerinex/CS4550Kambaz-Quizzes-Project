// src/Kambaz/Courses/Assignments/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
  course: string;
  published?: boolean;
}

interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.push(action.payload);
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment._id !== action.payload
      );
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment._id === action.payload._id
      );
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
  },
});

export const {
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setAssignments,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;