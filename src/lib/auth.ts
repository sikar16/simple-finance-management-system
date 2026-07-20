import type {
  AuthErrorResponse,
  AuthUser,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  UserRole,
} from "@/src/types/auth";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export function getAuthRedirectPath(role: UserRole) {
  return role === "ADMIN" ? "/dashboard" : "/client";
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredAuth(): { token: string; user: AuthUser } | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userJson = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !userJson) {
    return null;
  }

  try {
    return { token, user: JSON.parse(userJson) as AuthUser };
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function updateStoredUser(updates: Partial<AuthUser>) {
  const auth = getStoredAuth();
  if (!auth) return;

  saveAuth(auth.token, { ...auth.user, ...updates });
  window.dispatchEvent(new Event("auth-user-updated"));
}

export function getUserInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function parseAuthResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | AuthErrorResponse;

  if (!response.ok) {
    throw new Error(
      (data as AuthErrorResponse).message || "Something went wrong"
    );
  }

  return data as T;
}

export async function login(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return parseAuthResponse<LoginResponse>(response);
}

export async function register(payload: RegisterPayload) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseAuthResponse<RegisterResponse>(response);
}
