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
  
  