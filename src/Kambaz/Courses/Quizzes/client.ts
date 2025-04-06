// src/Kambaz/Courses/Quizzes/client.ts
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "";
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export interface Quiz {
  _id: string;
  title: string;
  
  
  custom?: {
    [key: string]: any;
  };
}
export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  quizType?: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  published?: boolean;
  points: number;
  course?: string;
  module?: string;
  assignmentGroup?: "Quizzes" | "Exams" | "Assignments" | "Project";
  availableDate?: string;
  dueDate: string;
  untilDate?: string;
  questions: any[]; 
  timeLimit?: number;
  multipleAttempts?: boolean;
  attemptsAllowed?: number;
  shuffleAnswers?: boolean;
  showCorrectAnswers?: boolean;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
}

export const createQuiz = async (quiz: Omit<Quiz, '_id'>) => {
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