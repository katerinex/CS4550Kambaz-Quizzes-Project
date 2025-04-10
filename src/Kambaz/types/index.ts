// src/Kambaz/types/index.ts

export interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    description: string;
    enrolled?: boolean;
  }
  
  export interface Enrollment {
    user: string;
    course: string;
  }

  // src/Kambaz/types.ts
export interface User {
  _id: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  id?: string; // Backend sometimes uses id instead of _id
}

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  enrolled?: boolean;
  term?: string;
}

export interface Module {
  _id: string;
  courseId: string;
  name: string;
  description?: string;
  lessons?: Lesson[];
  order?: number;
}

export interface Lesson {
  _id: string;
  moduleId: string;
  name: string;
  description?: string;
  type: 'TEXT' | 'VIDEO' | 'LINK';
  content: string;
  order?: number;
}

export interface Assignment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status?: 'ASSIGNED' | 'SUBMITTED' | 'GRADED';
}

export interface Enrollment {
  _id: string;
  user: string; // User ID
  course: string; // Course ID
  role?: 'STUDENT' | 'FACULTY';
  grade?: number;
}

export interface State {
  accountReducer: {
    user: User | null;
    users: User[];
    loading: boolean;
    error: string | null;
  };
  coursesReducer: {
    courses: Course[];
    course: Course | null;
    loading: boolean;
    error: string | null;
  };
  enrollmentsReducer: {
    enrollments: Enrollment[];
    loading: boolean;
    error: string | null;
  };
}
  
  