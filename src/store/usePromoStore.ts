import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export interface Promo {
  id: number;
  code: string;
  discount: number;
  isPercent: boolean;
  maxDiscount?: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface PromoStore {
  promos: Promo[];
  loading: boolean;
  fetchPromos: () => Promise<void>;
  addPromo: (data: Omit<Promo, "id">) => Promise<void>;
  updatePromo: (id: number, data: Partial<Promo>) => Promise<void>;
  deletePromo: (id: number) => Promise<void>;
}

export const usePromoStore = create<PromoStore>((set, get) => ({
  promos: [],
  loading: false,

  fetchPromos: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/promos`, getAuthHeaders());
      const data = res.data?.data ?? res.data;
      set({ promos: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error("Gagal fetch promos:", err);
    } finally {
      set({ loading: false });
    }
  },

  addPromo: async (data) => {
    try {
      await axios.post(`${BASE_URL}/promos`, data, getAuthHeaders());
      await get().fetchPromos();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal tambah promo");
    }
  },

  updatePromo: async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/promos/${id}`, data, getAuthHeaders());
      await get().fetchPromos();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal update promo");
    }
  },

  deletePromo: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/promos/${id}`, getAuthHeaders());
      set((state) => ({ promos: state.promos.filter((p) => p.id !== id) }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal hapus promo");
    }
  },
}));