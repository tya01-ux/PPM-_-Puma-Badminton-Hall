import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export interface Court {
  id: number;
  name: string;
  type: string;
  price: number;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CourtStore {
  courts: Court[];
  loading: boolean;
  fetchCourts: () => Promise<void>;
  addCourt: (data: Omit<Court, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateCourt: (id: number, data: Partial<Court>) => Promise<void>;
  deleteCourt: (id: number) => Promise<void>;
}

export const useCourtStore = create<CourtStore>((set, get) => ({
  courts: [],
  loading: false,

  fetchCourts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/courts`);
      const data = res.data?.data ?? res.data;
      set({ courts: Array.isArray(data) ? data : [] });
    } catch (err: any) {
      console.error("Gagal fetch courts:", err);
    } finally {
      set({ loading: false });
    }
  },

  addCourt: async (data) => {
    set({ loading: true });
    try {
      await axios.post(`${BASE_URL}/courts`, data, getAuthHeaders());
      await get().fetchCourts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal menambah lapangan");
    } finally {
      set({ loading: false });
    }
  },

  updateCourt: async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/courts/${id}`, data, getAuthHeaders());
      await get().fetchCourts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal update lapangan");
    }
  },

  deleteCourt: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/courts/${id}`, getAuthHeaders());
      await get().fetchCourts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal hapus lapangan");
    }
  },
}));

// alias biar komponen lama ga error
export const useCourtBoking = useCourtStore;