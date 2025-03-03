// src/Kambaz/store.ts
import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer"; // Corrected import

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
  },
});

export default store;
