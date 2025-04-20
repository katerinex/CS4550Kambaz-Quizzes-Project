// src/Kambaz/Courses/Quizzes/types.ts
export interface Choice {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface BlankAnswer {
    id: string;
    text: string;
  }
  
  export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';
  
  export interface Question {
    id: string;
    title: string;
    questionType: QuestionType;
    questionText: string;
    points: number;
    choices?: Choice[];
    correctAnswer?: boolean; // For true/false questions
    blankAnswers?: BlankAnswer[]; // For fill-in-the-blank questions
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
    questions: Question[];
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