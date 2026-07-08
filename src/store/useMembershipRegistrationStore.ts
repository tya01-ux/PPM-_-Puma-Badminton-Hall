import { create } from "zustand";
import axios from "axios";
import type { PaymentChannel } from "./usePaymentStore"; // reuse channel type/list, jangan duplikat

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const getMultipartHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
});

export type MembershipRegistrationStatus =
  | "pending"
  | "verification"
  | "active"
  | "rejected";

// NOTE: kalau e-wallet emang belum ke-cover di enum PaymentChannel bawaan usePaymentStore
// ("transfer" | "qris" | "cash"), tambahin "ewallet" di sana + di enum Prisma-nya.
export type MembershipPaymentMethod = PaymentChannel["type"] | "ewallet";

export interface MembershipRegistrationUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface MembershipRegistrationMembership {
  id: number;
  name: string;
  price: number;
  duration: number;
  theme: string;
}

export interface MembershipRegistration {
  id: number;
  userId: number;
  membershipId: number;
  paymentMethod?: MembershipPaymentMethod | null;
  paymentChannelId?: number | null;
  proofImageUrl?: string | null;
  notes?: string | null;
  status: MembershipRegistrationStatus;
  rejectReason?: string | null;
  approvedById?: number | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  user?: MembershipRegistrationUser;
  membership?: MembershipRegistrationMembership;
  createdAt?: string;
  updatedAt?: string;
}

// dipakai buat POST /membership-registrations (tanpa file, file nyusul lewat submitPaymentProof)
export interface AddMembershipRegistrationInput {
  membershipId: number;
  paymentMethod?: MembershipPaymentMethod;
  paymentChannelId?: number;
  notes?: string;
}

interface MembershipRegistrationStore {
  registrations: MembershipRegistration[];
  loading: boolean;
  fetchRegistrations: () => Promise<void>;
  fetchRegistrationById: (id: number) => Promise<MembershipRegistration | null>;
  addRegistration: (data: AddMembershipRegistrationInput) => Promise<MembershipRegistration>;
  submitPaymentProof: (id: number, file: File) => Promise<void>;
  // dipanggil dari tombol "Konfirmasi Pendaftaran" — 1 klik user, 2 request di baliknya
  registerWithProof: (
    data: AddMembershipRegistrationInput,
    file?: File
  ) => Promise<MembershipRegistration>;
  moveToVerification: (id: number) => Promise<void>;
  approveRegistration: (id: number) => Promise<void>;
  rejectRegistration: (id: number, reason: string) => Promise<void>;
}

export const useMembershipRegistrationStore = create<MembershipRegistrationStore>(
  (set, get) => ({
    registrations: [],
    loading: false,

    fetchRegistrations: async () => {
      set({ loading: true });
      try {
        const res = await axios.get(
          `${BASE_URL}/membership-registrations`,
          getAuthHeaders()
        );
        const data = res.data?.data ?? res.data;
        set({ registrations: Array.isArray(data) ? data : [] });
      } catch (err: any) {
        console.error("Gagal fetch membership registrations:", err);
      } finally {
        set({ loading: false });
      }
    },

    fetchRegistrationById: async (id) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/membership-registrations/${id}`,
          getAuthHeaders()
        );
        return res.data?.data ?? null;
      } catch (err: any) {
        console.error("Gagal fetch membership registration by id:", err);
        return null;
      }
    },

    // userId diambil dari token di backend (req.user.userId)
    addRegistration: async (data) => {
      set({ loading: true });
      try {
        const res = await axios.post(
          `${BASE_URL}/membership-registrations`,
          data,
          getAuthHeaders()
        );
        await get().fetchRegistrations();
        return res.data?.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Gagal membuat pendaftaran membership"
        );
      } finally {
        set({ loading: false });
      }
    },

    // multipart, sama pattern-nya kaya uploadProof di usePaymentStore
    // ⚠️ backend /membership-registrations/:id/proof perlu diubah pake multer,
    // bukan lagi terima JSON { proofImage: string }
    submitPaymentProof: async (id, file) => {
      try {
        const formData = new FormData();
        formData.append("proofImage", file);

        await axios.patch(
          `${BASE_URL}/membership-registrations/${id}/proof`,
          formData,
          getMultipartHeaders()
        );
        await get().fetchRegistrations();
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Gagal mengunggah bukti pembayaran"
        );
      }
    },

    // dipanggil dari 1 tombol "Konfirmasi Pendaftaran":
    // 1) bikin registration (pending) 2) langsung susul upload bukti kalau ada file
    registerWithProof: async (data, file) => {
      set({ loading: true });
      try {
        const registration = await get().addRegistration(data);
        if (file) {
          await get().submitPaymentProof(registration.id, file);
        }
        return registration;
      } finally {
        set({ loading: false });
      }
    },

    // admin: pending -> verification
    moveToVerification: async (id) => {
      try {
        await axios.patch(
          `${BASE_URL}/membership-registrations/${id}/verify`,
          {},
          getAuthHeaders()
        );
        await get().fetchRegistrations();
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Gagal memindahkan ke verification"
        );
      }
    },

    // admin: verification -> active
    approveRegistration: async (id) => {
      try {
        await axios.patch(
          `${BASE_URL}/membership-registrations/${id}/approve`,
          {},
          getAuthHeaders()
        );
        await get().fetchRegistrations();
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Gagal approve pendaftaran membership"
        );
      }
    },

    // admin: reject, WAJIB kirim reason
    rejectRegistration: async (id, reason) => {
      try {
        await axios.patch(
          `${BASE_URL}/membership-registrations/${id}/reject`,
          { reason },
          getAuthHeaders()
        );
        await get().fetchRegistrations();
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Gagal reject pendaftaran membership"
        );
      }
    },
  })
);

export const useMembershipRegistrationList = useMembershipRegistrationStore;