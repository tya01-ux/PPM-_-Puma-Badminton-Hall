import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export interface PaymentChannel {
  id: number;
  name: string;
  type: "transfer" | "qris" | "cash";
  accountNumber?: string;
  accountName?: string;
  qrImage?: string;
  isActive: boolean;
}

export interface PaymentProof {
  id: number;
  image: string;
  uploadedAt: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  courtPrice: number;
  adminFee: number;
  discount: number;
  totalAmount: number;
  status: "pending" | "uploaded" | "confirmed" | "rejected" | "expired" | "cash";
  paidAt?: string;
  expiredAt?: string;
  confirmedAt?: string;
  note?: string;
  channel?: PaymentChannel;
  proofs?: PaymentProof[];
  booking?: {
    bookingCode: string;
    startAt: string;
    endAt: string;
    duration: number;
    court?: { name: string };
    user?: { name: string; email: string; phone?: string };
  };
}

interface PaymentStore {
  payments: Payment[];
  channels: PaymentChannel[];
  loading: boolean;

  fetchAllPayments: () => Promise<void>;
  fetchChannels: () => Promise<void>;
  confirmPayment: (bookingId: number) => Promise<void>;
  rejectPayment: (bookingId: number, note: string) => Promise<void>;
  uploadProof: (bookingId: number, file: File) => Promise<void>;
  addChannel: (data: FormData) => Promise<void>;
  updateChannel: (id: number, data: FormData) => Promise<void>;
  deleteChannel: (id: number) => Promise<void>;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  channels: [],
  loading: false,

  fetchAllPayments: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/bookings`, getAuthHeaders());
      const bookings = res.data?.data ?? res.data;
      const payments = Array.isArray(bookings)
        ? bookings
            .filter((b: any) => b.payment)
            .map((b: any) => ({
              ...b.payment,
              booking: {
                bookingCode: b.bookingCode,
                startAt: b.startAt,
                endAt: b.endAt,
                duration: b.duration,
                court: b.court,
                user: b.user,
              },
            }))
        : [];
      set({ payments });
    } catch (err) {
      console.error("Gagal fetch payments:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchChannels: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/payments/channels`);
      const data = res.data?.data ?? res.data;
      set({ channels: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error("Gagal fetch channels:", err);
    }
  },

  confirmPayment: async (bookingId) => {
    try {
      await axios.put(`${BASE_URL}/payments/${bookingId}/confirm`, {}, getAuthHeaders());
      await get().fetchAllPayments();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal konfirmasi pembayaran");
    }
  },

  rejectPayment: async (bookingId, note) => {
    try {
      await axios.put(`${BASE_URL}/payments/${bookingId}/reject`, { note }, getAuthHeaders());
      await get().fetchAllPayments();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal tolak pembayaran");
    }
  },

  // ✅ baru — upload bukti pembayaran (user side)
  uploadProof: async (bookingId, file) => {
    try {
      const formData = new FormData();
      formData.append("proof", file);

      await axios.post(`${BASE_URL}/payments/${bookingId}/upload-proof`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal upload bukti pembayaran");
    }
  },

  addChannel: async (data) => {
    try {
      await axios.post(`${BASE_URL}/payments/channels`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchChannels();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal tambah channel");
    }
  },

  updateChannel: async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/payments/channels/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchChannels();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal update channel");
    }
  },

  deleteChannel: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/payments/channels/${id}`, getAuthHeaders());
      await get().fetchChannels();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal hapus channel");
    }
  },
}));