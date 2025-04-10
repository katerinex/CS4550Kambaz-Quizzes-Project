// src/Kambaz/Enrollments/reducer.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
  grade?: number;
  letterGrade?: string;
  enrollmentDate?: string;
  status?: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    removeEnrollment: (state, action: PayloadAction<{ user: string; course: string }>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) => 
          !(enrollment.user === action.payload.user && 
            enrollment.course === action.payload.course)
      );
      state.loading = false;
      state.error = null;
    },
    fetchEnrollmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEnrollmentsSuccess: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchEnrollmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setEnrollments,
  addEnrollment,
  removeEnrollment,
  fetchEnrollmentsStart,
  fetchEnrollmentsSuccess,
  fetchEnrollmentsFailure,
} = enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;