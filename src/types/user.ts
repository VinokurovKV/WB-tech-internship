export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  createdAt: string;
  hobbies: string;
  nationality: string;
}

export type UserFormData = Omit<User, "id" | "createdAt">;
