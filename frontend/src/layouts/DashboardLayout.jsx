import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, Settings, FileText,
  Pill, User, Heart, Building2, BarChart3, Clock, LogOut, Menu, X,
  ChevronLeft,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const patientNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/dashboard/appointments', icon: CalendarDays, label: 'Mis Citas' },
  { to: '/dashboard/prescriptions', icon: FileText, label: 'Mis Recetas' },
  { to: '/dashboard/pharmacy', icon: Pill, label: 'Farmacia' },
  { to: '/dashboard/profile', icon: User, label: 'Mi Perfil' },
  { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

const doctorNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/dashboard/appointments', icon: CalendarDays, label: 'Mi Agenda' },
  { to: '/dashboard/patients', icon: Users, label: 'Mis Pacientes' },
  { to: '/dashboard/prescriptions', icon: FileText, label: 'Recetas' },
  { to: '/dashboard/doctors', icon: Stethoscope, label: 'Directorio' },
  { to: '/dashboard/profile', icon: User, label: 'Mi Perfil' },
  { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDoctor = user?.role === 'doctor';
  const navItems = isDoctor ? doctorNav : patientNav;
  const panelTitle = isDoctor ? 'Panel Médico' : 'Mi Panel de Salud';

  return (
    <div className="min-h-screen flex bg-themed transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-themed bg-[var(--bg-card)] p-5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-600 to-teal-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-sky-600/25">
              M
            </div>
            <span className="text-lg font-semibold text-heading">MedAgenda</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted hover:text-body">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="mb-6 p-3 rounded-xl bg-[var(--bg-input)] border border-themed">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.fullName?.charAt(0) || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-heading truncate">{user?.fullName || 'Usuario'}</p>
              <p className="text-xs text-muted truncate">
                {isDoctor ? (user?.specialty || 'Médico') : 'Paciente'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-faint uppercase tracking-widest font-bold mb-3 px-3">Menú</p>

        <nav className="space-y-0.5 flex-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-sky-500/10 text-sky-400 shadow-sm'
                    : 'text-muted hover:text-heading hover:bg-[var(--bg-input)]'
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 pt-4 border-t border-themed">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-muted">Tema</span>
            <ThemeToggle />
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-themed px-4 sm:px-6 py-4 bg-[var(--bg-card)] flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted hover:text-body">
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <p className="text-muted text-sm font-medium">{panelTitle}</p>
          </div>
          <Link
            to="/"
            className="text-xs text-muted hover:text-sky-400 transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={13} /> Volver al inicio
          </Link>
        </header>
        <main className="p-4 sm:p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
