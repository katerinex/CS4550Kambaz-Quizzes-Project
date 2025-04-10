// src/Kambaz/Account/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface AccountState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  user: null,
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Additional actions to help with authentication flow
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { 
  setCurrentUser, 
  setLoading, 
  setError,
  authStart,
  authSuccess,
  authFailure,
  logout,
  clearError
} = accountSlice.actions;

export default accountSlice.reducer;