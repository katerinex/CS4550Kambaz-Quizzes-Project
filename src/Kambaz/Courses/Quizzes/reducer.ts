// src/Kambaz/Courses/Quizzes/reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz } from './client';

// Define the state type
interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null
};

// Create the quiz slice
const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    // Fetch quizzes
    fetchQuizzesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchQuizzesSuccess: (state, action: PayloadAction<Quiz[]>) => {
      state.loading = false;
      state.quizzes = action.payload;
    },
    fetchQuizzesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single quiz
    fetchQuizStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchQuizSuccess: (state, action: PayloadAction<Quiz>) => {
      state.loading = false;
      state.currentQuiz = action.payload;
    },
    fetchQuizFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create quiz
    createQuizStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createQuizSuccess: (state, action: PayloadAction<Quiz>) => {
      state.loading = false;
      state.quizzes.push(action.payload);
    },
    createQuizFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update quiz
    updateQuizStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateQuizSuccess: (state, action: PayloadAction<Quiz>) => {
      state.loading = false;
      const index = state.quizzes.findIndex(quiz => quiz._id === action.payload._id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
      state.currentQuiz = action.payload;
    },
    updateQuizFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete quiz
    deleteQuizStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteQuizSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
    },
    deleteQuizFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Toggle publish status
    togglePublishStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    togglePublishSuccess: (state, action: PayloadAction<Quiz>) => {
      state.loading = false;
      const index = state.quizzes.findIndex(quiz => quiz._id === action.payload._id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
      if (state.currentQuiz && state.currentQuiz._id === action.payload._id) {
        state.currentQuiz = action.payload;
      }
    },
    togglePublishFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear current quiz
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    }
  }
});

// Export actions and reducer
export const {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  fetchQuizStart,
  fetchQuizSuccess,
  fetchQuizFailure,
  createQuizStart,
  createQuizSuccess,
  createQuizFailure,
  updateQuizStart,
  updateQuizSuccess,
  updateQuizFailure,
  deleteQuizStart,
  deleteQuizSuccess,
  deleteQuizFailure,
  togglePublishStart,
  togglePublishSuccess,
  togglePublishFailure,
  clearCurrentQuiz
} = quizSlice.actions;

export default quizSlice.reducer;