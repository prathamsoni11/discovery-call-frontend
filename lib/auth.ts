// Authentication utilities
export interface User {
  email: string;
  name: string;
  role: string;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isAuthenticated", "true");
}

export function clearUser(): void {
  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
}

export function isAuthenticated(): boolean {
  return localStorage.getItem("isAuthenticated") === "true";
}
