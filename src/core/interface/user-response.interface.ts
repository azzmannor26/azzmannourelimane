export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  firstLogin: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}
