import { API_ENDPOINTS } from "@/config/api";

export interface User {
  _id: string;
  email: string;
  name?: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/**
 * Handles user login
 */
export async function loginUser(email: string, password: string): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
  try {
    const res = await fetch(API_ENDPOINTS.users.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    // Store auth data
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token_type", data.token_type);
    localStorage.setItem("user", JSON.stringify(data.user));

    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Handles user registration
 */
export async function registerUser(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(API_ENDPOINTS.users.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Registration failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Logs out the current user
 */
export function logoutUser(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user");
}

/**
 * Gets the current user from localStorage
 */
export function getCurrentUser(): User | null {
  const userJson = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

/**
 * Gets the access token from localStorage
 */
export function getAccessToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
}