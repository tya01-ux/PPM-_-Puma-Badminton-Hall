import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  users: UserData[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (data: Omit<UserData, "id" | "createdAt" | "updatedAt"> & { password?: string }) => Promise<void>;
  updateUser: (id: number, data: Partial<Omit<UserData, "id">>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateOwnProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<UserData>;
}

const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") return null;
    return token; 
  } catch (error) {
    console.error("Gagal membaca token dari localStorage:", error);
    return null;
  }
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");
      
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedData = response.data?.data ?? response.data;
      set({ users: Array.isArray(fetchedData) ? fetchedData : [], loading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message || "Gagal memuat data user", 
        loading: false 
      });
    }
  },

  addUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token tidak ditemukan. Akses ditolak.");

      const response = await axios.post(`${API_URL}/users`, { ...data, role: data.role.toLowerCase() }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newUser = response.data?.data ?? response.data;
      
      set((state) => ({
        users: Array.isArray(state.users) ? [...state.users, newUser] : [newUser],
        loading: false
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Gagal menambahkan user baru",
        loading: false
      });
      throw err; 
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token tidak ditemukan. Akses ditolak.");
      
      const payload = { ...data, ...(data.role && { role: data.role.toLowerCase() }) };
      const response = await axios.put(`${API_URL}/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = response.data?.data ?? response.data;
      
      set((state) => ({
        users: state.users.map((user) => (String(user.id) === String(id) ? { ...user, ...updatedUser } : user)),
        loading: false
      }));
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message || "Gagal memperbarui data user", 
        loading: false 
      });
      throw err;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token tidak ditemukan. Akses ditolak.");
      
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        users: state.users.filter((user) => String(user.id) !== String(id)),
        loading: false
      }));
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message || "Gagal menghapus user", 
        loading: false 
      });
      throw err;
    }
  },

  updateOwnProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

      const response = await axios.put(`${API_URL}/users/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = response.data?.data ?? response.data;
      set({ loading: false });
      return updatedUser;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Gagal memperbarui profil",
        loading: false,
      });
      throw err;
    }
  },
}));