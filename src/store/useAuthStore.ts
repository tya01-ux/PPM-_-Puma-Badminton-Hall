import { create } from "zustand";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const getInitialUser = (): User | null => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString || userString === "undefined" || userString === "null") return null;
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),

  login: (user) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },
}));