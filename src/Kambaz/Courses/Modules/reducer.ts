// src/Kambaz/Courses/Modules/reducer.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Lesson {
  _id: string;
  name: string;
  description?: string;
  module: string;
  published?: boolean;
  points?: number;
}

export interface Module {
  _id: string;
  name: string;
  description?: string;
  course: string;
  published?: boolean;
  lessons?: Lesson[];
}

interface ModulesState {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

const initialState: ModulesState = {
  modules: [],
  loading: false,
  error: null,
};

const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
    },
    addModule: (state, action: PayloadAction<Module>) => {
      state.modules.push(action.payload);
    },
    updateModule: (state, action: PayloadAction<Module>) => {
      const index = state.modules.findIndex(module => module._id === action.payload._id);
      if (index !== -1) {
        state.modules[index] = action.payload;
      }
    },
    deleteModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter(module => module._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setModules,
  addModule,
  updateModule,
  deleteModule,
  setLoading,
  setError,
} = modulesSlice.actions;

export default modulesSlice.reducer;