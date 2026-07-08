import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export type MembershipTheme = "slate" | "amber" | "blue" | "violet";

export interface Membership {
  id: number;
  name: string;
  price: number;
  duration: number;
  quotaLabel?: string | null;
  description?: string | null;
  benefits: string[];
  isPopular: boolean;
  theme: MembershipTheme;
  createdAt?: string;
  updatedAt?: string;
}

interface MembershipStore {
  memberships: Membership[];
  loading: boolean;
  fetchMemberships: () => Promise<void>;
  addMembership: (
    data: Omit<Membership, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateMembership: (id: number, data: Partial<Membership>) => Promise<void>;
  deleteMembership: (id: number) => Promise<void>;
}

export const useMembershipStore = create<MembershipStore>((set, get) => ({
  memberships: [],
  loading: false,

  fetchMemberships: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/memberships`);
      const data = res.data?.data ?? res.data;
      set({ memberships: Array.isArray(data) ? data : [] });
    } catch (err: any) {
      console.error("Gagal fetch memberships:", err);
    } finally {
      set({ loading: false });
    }
  },

  addMembership: async (data) => {
    set({ loading: true });
    try {
      await axios.post(`${BASE_URL}/memberships`, data, getAuthHeaders());
      await get().fetchMemberships();
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      throw new Error(
        (Array.isArray(errors) && errors.join(", ")) ||
          err.response?.data?.message ||
          "Gagal menambah membership"
      );
    } finally {
      set({ loading: false });
    }
  },

  updateMembership: async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/memberships/${id}`, data, getAuthHeaders());
      await get().fetchMemberships();
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      throw new Error(
        (Array.isArray(errors) && errors.join(", ")) ||
          err.response?.data?.message ||
          "Gagal update membership"
      );
    }
  },

  deleteMembership: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/memberships/${id}`, getAuthHeaders());
      await get().fetchMemberships();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Gagal hapus membership"
      );
    }
  },
}));

// alias biar komponen lama ga error (kalau ada penamaan lain yang kepakai)
export const useMembershipList = useMembershipStore;