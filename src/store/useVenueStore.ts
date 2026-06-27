import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

export interface Venue {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  openHour?: string;
  closeHour?: string;
  logo?: string;
  banner?: string;
}

interface VenueStore {
  venue: Venue | null;
  loading: boolean;
  fetchVenue: () => Promise<void>;
  updateVenue: (data: FormData) => Promise<void>;
}

export const useVenueStore = create<VenueStore>((set, get) => ({
  venue: null,
  loading: false,

  fetchVenue: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/venue`);
      set({ venue: res.data?.data ?? null });
    } catch (err) {
      console.error("Gagal fetch venue:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateVenue: async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/venue`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchVenue();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal menyimpan pengaturan");
    }
  },
}));