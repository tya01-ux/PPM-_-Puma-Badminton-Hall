import { create } from "zustand";

export interface Booking {
  id: number;
  name: string;
  court: string;
  date: string;
  time: string;
  status: "Pending" | "Approved" | "Cancelled";
  createdAt: string;
}

interface BookingStore {
  bookings: Booking[];

  approveBooking: (id: number) => void;
  cancelBooking: (id: number) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [
    {
      id: 25,
      name: "Tya",
      court: "Court 1",
      date: "20 Juni 2025",
      time: "08:00 - 09:00",
      status: "Pending",
      createdAt: "19 Juni 2025 10:23",
    },

    {
      id: 24,
      name: "Rudi",
      court: "Court 2",
      date: "20 Juni 2025",
      time: "09:00 - 10:00",
      status: "Approved",
      createdAt: "19 Juni 2025 09:15",
    },

    {
      id: 23,
      name: "Sinta",
      court: "Court 4",
      date: "20 Juni 2025",
      time: "15:00 - 16:00",
      status: "Cancelled",
      createdAt: "18 Juni 2025 20:10",
    },

    {
      id: 22,
      name: "Budi",
      court: "Court 3",
      date: "21 Juni 2025",
      time: "11:00 - 12:00",
      status: "Pending",
      createdAt: "19 Juni 2025 11:05",
    },

    {
      id: 21,
      name: "Dewi",
      court: "Court 5",
      date: "21 Juni 2025",
      time: "16:00 - 17:00",
      status: "Approved",
      createdAt: "19 Juni 2025 12:30",
    },
  ],

  approveBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "Approved",
            }
          : booking
      ),
    })),

  cancelBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "Cancelled",
            }
          : booking
      ),
    })),
}));