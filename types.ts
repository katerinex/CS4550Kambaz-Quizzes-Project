// src/Kambaz/Courses/Quizzes/Editor/types.ts
export interface QuizSettings {
    quizType: 'GRADED_QUIZ' | 'PRACTICE_QUIZ' | 'GRADED_SURVEY' | 'UNGRADED_SURVEY';
    points: number;
    assignmentGroup: 'QUIZZES' | 'EXAMS' | 'ASSIGNMENTS' | 'PROJECT';
    shuffleAnswers: boolean;
    timeLimit: number;
    multipleAttempts: boolean;
    attemptCount: number;
    showCorrectAnswers: boolean;
    accessCode: string;
    oneQuestionAtATime: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
    dueDate: string;
    availableDate: string;
    untilDate: string;
  }
  
  