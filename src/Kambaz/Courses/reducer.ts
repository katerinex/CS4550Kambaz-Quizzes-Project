// src/Kambaz/Courses/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "./../types"; 

interface CoursesState {
  courses: Course[];
  course: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [], 
  course: null,
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => { // Expect an array
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCourse: (state, action: PayloadAction<Course | null>) => {
      state.course = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCourseSuccess: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    addCourseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCourseSuccess: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    deleteCourseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCourseSuccess: (state, action: PayloadAction<Course>) => {
      state.courses = state.courses.map((course) =>
        course._id === action.payload._id ? action.payload : course
      );
      state.loading = false;
      state.error = null;
    },
    updateCourseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setCourses,
  setCourse,
  addCourseStart,
  addCourseSuccess,
  addCourseFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
  updateCourseStart,
  updateCourseSuccess,
  updateCourseFailure,
  fetchCoursesStart,
  fetchCoursesFailure,
} = coursesSlice.actions;

export default coursesSlice.reducer;