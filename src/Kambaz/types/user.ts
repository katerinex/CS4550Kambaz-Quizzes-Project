// src/Kambaz/types/user.ts
export type UserRole = 'FACULTY' | 'STUDENT';

export interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  dateOfBirth: string;
}
