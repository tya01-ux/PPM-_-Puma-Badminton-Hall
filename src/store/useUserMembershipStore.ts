import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export type UserMembershipStatus = "active" | "expired" | "cancelled";

export interface UserMembershipUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface UserMembershipMembership {
  id: number;
  name: string;
  price: number;
  duration: number;
  theme: string;
}

export interface UserMembership {
  id: number;
  userId: number;
  membershipId: number;
  startDate: string;
  endDate: string;
  status: UserMembershipStatus;
  user?: UserMembershipUser;
  membership?: UserMembershipMembership;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddUserMembershipInput {
  userId: number;
  membershipId: number;
  startDate?: string | Date;
  endDate: string | Date;
}

interface UserMembershipStore {
  userMemberships: UserMembership[];
  loading: boolean;
  fetchUserMemberships: () => Promise<void>;
  fetchUserMembershipsByUser: (userId: number) => Promise<UserMembership[]>;
  addUserMembership: (data: AddUserMembershipInput) => Promise<void>;
  deleteUserMembership: (id: number) => Promise<void>;
}

export const useUserMembershipStore = create<UserMembershipStore>(
  (set, get) => ({
    userMemberships: [],
    loading: false,

    fetchUserMemberships: async () => {
      set({ loading: true });
      try {
        const res = await axios.get(
          `${BASE_URL}/user-memberships`,
          getAuthHeaders()
        );
        const data = res.data?.data ?? res.data;
        set({ userMemberships: Array.isArray(data) ? data : [] });
      } catch (err: any) {
        console.error("Gagal fetch user memberships:", err);
      } finally {
        set({ loading: false });
      }
    },

    fetchUserMembershipsByUser: async (userId) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user-memberships/user/${userId}`,
          getAuthHeaders()
        );
        const data = res.data?.data ?? res.data;
        return Array.isArray(data) ? data : [];
      } catch (err: any) {
        console.error("Gagal fetch user memberships by user:", err);
        return [];
      }
    },

    addUserMembership: async (data) => {
      set({ loading: true });
      try {
        await axios.post(
          `${BASE_URL}/user-memberships`,
          data,
          getAuthHeaders()
        );
        await get().fetchUserMemberships();
      } catch (err: any) {
        const errors = err.response?.data?.errors;
        throw new Error(
          (Array.isArray(errors) && errors.join(", ")) ||
            err.response?.data?.message ||
            "Gagal menambah user membership"
        );
      } finally {
        set({ loading: false });
      }
    },

    deleteUserMembership: async (id) => {
      try {
        await axios.delete(
          `${BASE_URL}/user-memberships/${id}`,
          getAuthHeaders()
        );
        await get().fetchUserMemberships();
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Gagal hapus user membership"
        );
      }
    },
  })
);

export const useUserMembershipList = useUserMembershipStore;