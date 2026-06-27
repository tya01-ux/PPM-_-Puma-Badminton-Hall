import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export interface RevenueChartPoint {
  date: string;
  total: number;
}

export interface RevenueReport {
  totalRevenue: number;
  totalBooking: number;
  avgPerDay: number;
  chart: RevenueChartPoint[];
}

export interface BookingReport {
  totalBooking: number;
  byStatus: Record<string, number>;
  byCourt: Record<string, number>;
}

interface ReportStore {
  revenue: RevenueReport | null;
  bookingStat: BookingReport | null;
  loading: boolean;

  fetchRevenue: (startDate: string, endDate: string, courtId?: number) => Promise<void>;
  fetchBookingStat: (startDate: string, endDate: string, courtId?: number) => Promise<void>;
}

export const useReportStore = create<ReportStore>((set) => ({
  revenue: null,
  bookingStat: null,
  loading: false,

  fetchRevenue: async (startDate, endDate, courtId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/reports/revenue`, {
        ...getAuthHeaders(),
        params: { startDate, endDate, ...(courtId && { courtId }) },
      });
      set({ revenue: res.data?.data ?? null });
    } catch (err) {
      console.error("Gagal fetch laporan pendapatan:", err);
      set({ revenue: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchBookingStat: async (startDate, endDate, courtId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/reports/booking`, {
        ...getAuthHeaders(),
        params: { startDate, endDate, ...(courtId && { courtId }) },
      });
      set({ bookingStat: res.data?.data ?? null });
    } catch (err) {
      console.error("Gagal fetch laporan booking:", err);
      set({ bookingStat: null });
    } finally {
      set({ loading: false });
    }
  },
}));