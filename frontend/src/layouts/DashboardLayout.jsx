import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, Settings, LogOut,
  User, Sun, Moon, Menu, X, ChevronDown, Bell, Plus
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const patientNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen', exact: true },
  { to: '/dashboard/doctors', icon: Stethoscope, label: 'Doctores' },
  { to: '/dashboard/appointments', icon: CalendarDays, label: 'Mis Citas' },
  { to: '/dashboard/profile', icon: User, label: 'Mi Perfil' },
  { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

const doctorNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen', exact: true },
  { to: '/dashboard/patients', icon: Users, label: 'Pacientes' },
  { to: '/dashboard/appointments', icon: CalendarDays, label: 'Citas' },
  { to: '/dashboard/profile', icon: User, label: 'Mi Perfil' },
  { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'doctor' ? doctorNav : patientNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const sidebar = (
    <>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-themed">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:scale-105">
            M
          </div>
          <span className="text-lg font-bold text-heading tracking-tight">
            Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Agenda</span>
          </span>
        </Link>
      </div>

      {/* User Card */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
            <span className="text-sm font-bold text-white">{user?.fullName?.charAt(0) || 'U'}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-heading truncate">{user?.fullName || 'Usuario'}</p>
            <p className="text-xs text-blue-400 font-medium">{user?.role === 'doctor' ? 'Médico' : 'Paciente'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 space-y-1">
        <p className="px-4 py-2 text-[10px] font-bold text-faint uppercase tracking-[0.2em]">Menú Principal</p>
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-blue-400 shadow-sm border border-blue-500/10'
                  : 'text-muted hover:text-heading hover:bg-[var(--bg-input)]'
              }`}
            >
              <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 space-y-2 border-t border-themed">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-heading hover:bg-[var(--bg-input)] transition-all"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-themed transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] border-r border-themed bg-[var(--bg-card)] flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebar}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[280px] bg-[var(--bg-card)] flex flex-col h-full shadow-2xl animate-slide-in-left z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-5 right-4 w-8 h-8 rounded-lg bg-[var(--bg-input)] flex items-center justify-center text-muted hover:text-heading transition-colors"
            >
              <X size={16} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-themed bg-[var(--bg-card)]/80 backdrop-blur-xl px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl border border-themed flex items-center justify-center text-muted hover:text-heading transition-colors"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-heading">
                  {user?.role === 'doctor' ? 'Panel Médico' : 'Mi Panel'}
                </h1>
                <p className="text-xs text-muted hidden sm:block">Gestiona tu cuenta de MedAgenda</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl border border-themed flex items-center justify-center text-muted hover:text-heading transition-all duration-300"
                aria-label="Cambiar tema"
              >
                {theme === 'dark'
                  ? <Sun size={16} className="transition-transform hover:rotate-45 duration-300" />
                  : <Moon size={16} className="transition-transform hover:-rotate-12 duration-300" />}
              </button>
              <button className="relative w-10 h-10 rounded-xl border border-themed flex items-center justify-center text-muted hover:text-heading transition-colors">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
              </button>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-themed ml-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-400">{user?.fullName?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-heading leading-tight">{user?.fullName?.split(' ')[0]}</p>
                  <p className="text-[10px] text-muted capitalize">{user?.role === 'doctor' ? 'Médico' : 'Paciente'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
