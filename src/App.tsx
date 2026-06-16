import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Membership from './pages/Membership';
import Booking from './pages/Booking';
import About from './pages/About';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm'; 
import MainLayout from './layouts/MainLayout';

//  Admin
import DashboardLayout from './layouts/DashboardLayout'; 
import DasboardIndex from './pages/admin/DasboardIndex'; 
import BookingIndex from './pages/admin/Booking/BookingIndex';

function App() {
  return (
    <Router>
      <Routes>
        {/* LAYOUT DENGAN NAVBAR (Public) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/loginForm" element={<LoginForm />} />
        </Route>

        {/* LAYOUT TANPA NAVBAR*/}
        <Route path="/registerForm" element={<RegisterForm />} />

        {/* --- ADMIN ROUTES (DENGAN SIDEBAR) --- */}
        {/* Kamu bisa bungkus ini dengan ProtectedRoute nanti */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<DasboardIndex />} />
          <Route path="/admin/booking" element={<BookingIndex />} />

        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;