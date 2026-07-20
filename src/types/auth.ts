export type UserRole = "ADMIN" | "CLIENT";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export type AuthErrorResponse = {
  message: string;
};
