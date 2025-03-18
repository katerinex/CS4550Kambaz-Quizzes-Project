// src/Kambaz/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../Account/reducer";
import modulesReducer from "../Courses/Modules/reducer";
import assignmentsReducer from "../Courses/Assignments/reducer";
import enrollmentsReducer from "../Courses/Enrollments/reducer";
import coursesReducer from "../Courses/reducer"; // Import the course reducer

const store = configureStore({
  reducer: {
    accountReducer,
    modulesReducer,
    assignmentsReducer,
    enrollmentsReducer,
    coursesReducer, // Add the course reducer
  },
});

export default store;