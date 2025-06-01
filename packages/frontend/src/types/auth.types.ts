export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'COMPANY' | 'TRANSPORTER';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: 'CUSTOMER' | 'COMPANY' | 'TRANSPORTER';
  companyName?: string;
} 