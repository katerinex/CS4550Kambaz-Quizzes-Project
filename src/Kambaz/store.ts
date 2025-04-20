// src/Kambaz/store.ts

import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import enrollmentsReducer from "./Enrollments/reducer";
import coursesReducer from "./Courses/reducer"; 
import quizReducer from "./Courses/Quizzes/reducer"; // Import the quizzes reducer
const store = configureStore({
  reducer: {
    accountReducer,
    modulesReducer,
    assignmentsReducer,
    enrollmentsReducer,
    coursesReducer,
    quizReducer, 
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
