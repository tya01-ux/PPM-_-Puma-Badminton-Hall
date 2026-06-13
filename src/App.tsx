import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Membership from './pages/Membership';
import Booking from './pages/Booking';
import About from './pages/About';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm'; 
import MainLayout from './layouts/MainLayout';
import FloatingWhatsapp from './components/ui/FloatingWhatsapp';

function App() {
  return (
    <Router>
      
    {/* FLOATING BUTTON */}
      <FloatingWhatsapp />

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
        
      </Routes>
    </Router>
  );
}

export default App;