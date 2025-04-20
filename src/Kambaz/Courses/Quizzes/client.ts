// src/Kambaz/Courses/Quizzes/client.ts
import axios from "axios";
import { Quiz, Question } from "./types";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "";
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUIZ_ATTEMPTS_API = `${REMOTE_SERVER}/api/quiz-attempts`;

// Quiz methods
export const createQuiz = async (quiz: Omit<Quiz, '_id'>) => {
  console.log("CREATE QUIZ")
  const response = await axios.post(QUIZZES_API, quiz);
  return response.data;
};

export const findAllQuizzes = async () => {
  const response = await axios.get(QUIZZES_API);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quizId: string, quizUpdates: Partial<Quiz>) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}`, quizUpdates);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  await axios.delete(`${QUIZZES_API}/${quizId}`);
};

export const findQuizzesForCourse = async (courseId: string) => {
  console.log(`Fetching quizzes for course: ${courseId}`);
  console.log(`URL: ${REMOTE_SERVER}/api/courses/${courseId}/quizzes`);
  try {
    const response = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/quizzes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Question methods
export const addQuestionToQuiz = async (quizId: string, question: Omit<Question, 'id'>) => {
  const response = await axios.post(`${QUIZZES_API}/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestionInQuiz = async (quizId: string, questionId: string, questionUpdates: Partial<Question>) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/questions/${questionId}`, questionUpdates);
  return response.data;
};

export const deleteQuestionFromQuiz = async (quizId: string, questionId: string) => {
  await axios.delete(`${QUIZZES_API}/${quizId}/questions/${questionId}`);
};

export const reorderQuestionsInQuiz = async (quizId: string, questionIds: string[]) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/questions/reorder`, { questionIds });
  return response.data;
};

// Quiz Attempt methods
export interface QuizAnswer {
  questionId: string;
  answer: string | string[] | boolean;
  isCorrect: boolean;
}

export interface QuizAttempt {
  _id?: string;
  quizId: string;
  userId: string;
  timestamp: string;
  score: number;
  totalPoints: number;
  answers: QuizAnswer[];
  completed?: boolean;
  timeSpent?: number;
  isPreview?: boolean;
}

export const createQuizAttempt = async (attempt: Omit<QuizAttempt, '_id'>) => {
  const response = await axios.post(`${QUIZZES_API}/${attempt.quizId}/attempts`, attempt);
  return response.data;
};

export const findQuizAttemptById = async (attemptId: string) => {
  const response = await axios.get(`${QUIZ_ATTEMPTS_API}/${attemptId}`);
  return response.data;
};

export const findQuizAttemptsByQuizAndUser = async (quizId: string, userId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/attempts`, {
    params: { userId }
  });
  return response.data;
};

export const updateQuizAttempt = async (attemptId: string, attemptUpdates: Partial<QuizAttempt>) => {
  const response = await axios.put(`${QUIZ_ATTEMPTS_API}/${attemptId}`, attemptUpdates);
  return response.data;
};

export const deleteQuizAttempt = async (attemptId: string) => {
  await axios.delete(`${QUIZ_ATTEMPTS_API}/${attemptId}`);
};