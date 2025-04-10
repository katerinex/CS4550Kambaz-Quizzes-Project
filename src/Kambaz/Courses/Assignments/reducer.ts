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
  module?: string;
  group?: string;
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

    // This can be used for convenience but isn't strictly needed since updateAssignment can do the same
    togglePublishStatus: (state, action: PayloadAction<string>) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment._id === action.payload
      );
      if (index !== -1) {
        const assignment = state.assignments[index];
        state.assignments[index] = {
          ...assignment,
          published: !assignment.published
        };
      }
    },
    
    // Add a batch update reducer for updating multiple assignments at once (for date shifting)
    batchUpdateAssignments: (state, action: PayloadAction<Assignment[]>) => {
      action.payload.forEach(updatedAssignment => {
        const index = state.assignments.findIndex(
          (assignment) => assignment._id === updatedAssignment._id
        );
        if (index !== -1) {
          state.assignments[index] = updatedAssignment;
        }
      });
    },
  },
});

export const {
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setAssignments,
  togglePublishStatus,
  batchUpdateAssignments
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;