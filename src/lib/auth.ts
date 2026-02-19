// Simple auth utility for client-side session management
export const AUTH_KEY = "nasaem_auth";

export function login(username: string, password: string): boolean {
    if (username === "fatima" && password === "admin123") {
        if (typeof window !== "undefined") {
            sessionStorage.setItem(AUTH_KEY, "true");
        }
        return true;
    }
    return false;
}

export function logout(): void {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem(AUTH_KEY);
    }
}

export function isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem(AUTH_KEY) === "true";
    }
    return false;
}
