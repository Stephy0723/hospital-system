import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Services from './pages/Services';
import About from './pages/About';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import ForgotPassword from './pages/ForgotPassword';
import Pharmacy from './pages/Pharmacy';
import Medicines from './pages/Medicines';
import Prescriptions from './pages/Prescriptions';
import DashboardDoctors from './pages/dashboard/DashboardDoctors';
import DashboardAppointments from './pages/dashboard/DashboardAppointments';
import DashboardPatients from './pages/dashboard/DashboardPatients';
import DashboardPrescriptions from './pages/dashboard/DashboardPrescriptions';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import DashboardPharmacy from './pages/dashboard/DashboardPharmacy';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppDataProvider>
            <HashRouter>
              <ScrollToTop />
              <Routes>
                {/* Public routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/doctors/:id" element={<DoctorProfile />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/appointments/new" element={<NewAppointment />} />
                  <Route path="/pharmacy" element={<Pharmacy />} />
                  <Route path="/medicines" element={<Medicines />} />
                  <Route path="/prescriptions" element={<Prescriptions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                </Route>

                {/* Dashboard routes (protected) */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/doctors" element={<DashboardDoctors />} />
                  <Route path="/dashboard/appointments" element={<DashboardAppointments />} />
                  <Route path="/dashboard/patients" element={<DashboardPatients />} />
                  <Route path="/dashboard/prescriptions" element={<DashboardPrescriptions />} />
                  <Route path="/dashboard/profile" element={<DashboardProfile />} />
                  <Route path="/dashboard/settings" element={<DashboardSettings />} />
                  <Route path="/dashboard/pharmacy" element={<DashboardPharmacy />} />
                </Route>
              </Routes>
              <ChatBot />
            </HashRouter>
          </AppDataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
