import { UserRole } from '@prisma/client';

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
} 