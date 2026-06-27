import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export interface Booking {
  id: number;
  bookingCode: string;
  startAt: string;
  endAt: string;
  duration: number;
  courtPrice: number;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  userId: number;
  courtId: number;
  user?: { id: number; name: string; email: string; phone?: string };
  court?: { id: number; name: string; type: string; image?: string; price?: number };
  payment?: {
    id?: number;
    status: string;
    totalAmount: number;
    adminFee?: number;
    discount?: number;
    courtPrice?: number;
    expiredAt?: string;
    paidAt?: string;
    confirmedAt?: string;
    note?: string;
    channel?: { id: number; name: string; type: string; accountNumber?: string; qrImage?: string };
    proofs?: { id: number; image: string; uploadedAt: string }[];
    promo?: { code: string; discount: number; isPercent: boolean } | null;
  };
}

interface BookingStore {
  bookings: Booking[];
  loading: boolean;
  fetchBookings: () => Promise<void>;
  createBooking: (data: {
    startAt: string;
    endAt: string;
    courtId: number;
    notes?: string;
  }) => Promise<void>;
  updateBooking: (id: number, data: {
    courtId?: number;
    startAt?: string;
    endAt?: string;
    notes?: string;
    status?: string;
  }) => Promise<void>;
  cancelBooking: (id: number) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  loading: false,

  // ── GET SEMUA BOOKING ──
  fetchBookings: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/bookings`, getAuthHeaders());
      const data = res.data?.data ?? res.data;
      set({ bookings: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error("Gagal fetch bookings:", err);
      set({ bookings: [] });
    } finally {
      set({ loading: false });
    }
  },

  // ── BUAT BOOKING BARU ──
  createBooking: async (data) => {
    set({ loading: true });
    try {
      await axios.post(`${BASE_URL}/bookings`, data, getAuthHeaders());
      await get().fetchBookings();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal membuat booking");
    } finally {
      set({ loading: false });
    }
  },

  // ── UPDATE BOOKING (admin) ──
  updateBooking: async (id, data) => {
    set({ loading: true });
    try {
      await axios.put(`${BASE_URL}/bookings/${id}`, data, getAuthHeaders());
      await get().fetchBookings();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal update booking");
    } finally {
      set({ loading: false });
    }
  },

  // ── CANCEL BOOKING ──
  cancelBooking: async (id) => {
    try {
      await axios.put(`${BASE_URL}/bookings/${id}/cancel`, {}, getAuthHeaders());
      await get().fetchBookings();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal membatalkan booking");
    }
  },
}));