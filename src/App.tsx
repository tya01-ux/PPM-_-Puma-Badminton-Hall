import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Membership from './pages/Membership';
import Booking from './pages/Booking';
import About from './pages/About';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Admin Layout
import DashboardLayout from './layouts/DashboardLayout';

// Admin Pages
import DashboardIndex from './pages/admin/DasboardIndex';
import BookingIndex from './pages/admin/Booking/BookingIndex';
import CourtIndex from './pages/admin/Court/CourtIndex';
import UserIndex from './pages/admin/User/UserIndex';
import UserCreate from './pages/admin/User/UserCreate';
import UserEdit from './pages/admin/User/UserEdit';
import PaymentIndex from './pages/admin/Payment/PaymentIndex';
import PaymentChannelIndex from './pages/admin/Payment/PaymentChannelIndex';
import PromoIndex from './pages/admin/Promo/PromoIndex';

// Modul yang belum dibangun (placeholder sementara, gantian nanti)
// import MembershipIndex from './pages/admin/Membership/MembershipIndex';
// import JadwalIndex from './pages/admin/Jadwal/JadwalIndex';
import LaporanIndex from './pages/admin/Laporan/LaporanIndex';
import PengaturanIndex from './pages/admin/Pengaturan/PengaturanIndex';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/loginForm" element={<LoginForm />} />
        </Route>

        <Route path="/registerForm" element={<RegisterForm />} />

        {/* ADMIN (terproteksi role admin) */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<DashboardIndex />} />

            <Route path="/admin/booking" element={<BookingIndex />} />

            <Route path="/admin/payment" element={<PaymentIndex />} />
            <Route path="/admin/payment-channel" element={<PaymentChannelIndex />} />

            <Route path="/admin/promo" element={<PromoIndex />} />

            <Route path="/admin/court" element={<CourtIndex />} />

            <Route path="/admin/user" element={<UserIndex />} />
            <Route path="/admin/user/create" element={<UserCreate />} />
            <Route path="/admin/user/edit/:id" element={<UserEdit />} />

            {/* belum dibangun — nanti ganti import di atas kalau sudah ada */}
            {/* <Route path="/admin/membership" element={<MembershipIndex />} /> */}
            {/* <Route path="/admin/jadwal" element={<JadwalIndex />} /> */}
            <Route path="/admin/laporan" element={<LaporanIndex />} />
            <Route path="/admin/pengaturan" element={<PengaturanIndex />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/loginForm" replace />} />
      </Routes>
    </Router>
  );
}

export default App;