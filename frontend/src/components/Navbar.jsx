import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Stethoscope, LayoutGrid, Users, LogIn, Menu, X, ChevronRight, Pill, FileText, Building2, LogOut, User, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/doctors', label: 'Médicos', icon: Stethoscope },
  { to: '/pharmacy', label: 'Farmacias', icon: Building2 },
  { to: '/medicines', label: 'Medicinas', icon: Pill },
  { to: '/services', label: 'Servicios', icon: LayoutGrid },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = () => setUserMenuOpen(false);
    if (userMenuOpen) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'backdrop-blur-2xl border-b shadow-lg'
          : 'backdrop-blur-none border-b border-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
        borderColor: scrolled ? 'var(--border-primary)' : 'transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-gradient-to-br from-sky-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-sky-500/30 group-hover:scale-105">
            <Stethoscope size={20} className="text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-teal-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold text-heading tracking-tight">
            Med<span className="text-gradient-premium">Agenda</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-0.5 p-1 rounded-2xl" style={{ backgroundColor: scrolled ? 'var(--bg-card)' : 'transparent' }}>
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'text-heading bg-gradient-to-r from-sky-600/10 to-teal-500/10 shadow-sm'
                    : 'text-muted hover:text-heading'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-sky-400' : ''} />
                {link.label}
                {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-[var(--bg-card)] border border-transparent hover:border-themed"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-heading max-w-[120px] truncate">{user?.fullName?.split(' ')[0]}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-themed shadow-xl overflow-hidden z-50" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div className="px-4 py-3 border-b border-themed">
                    <p className="text-sm font-semibold text-heading truncate">{user?.fullName}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-[var(--bg-primary)] transition-colors">
                      <LayoutDashboard size={15} className="text-muted" /> Panel
                    </Link>
                    <Link to="/appointments" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-[var(--bg-primary)] transition-colors">
                      <FileText size={15} className="text-muted" /> Mis Citas
                    </Link>
                  </div>
                  <div className="border-t border-themed py-1">
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 w-full transition-colors">
                      <LogOut size={15} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-muted hover:text-heading px-4 py-2 rounded-xl transition-all duration-300 hover:bg-[var(--bg-card)] text-sm font-medium flex items-center gap-2"
              >
                <LogIn size={16} />
                Ingresar
              </Link>
              <Link
                to="/register"
                className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 group"
              >
                Comenzar Gratis
                <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-xl border border-themed flex items-center justify-center text-muted hover:text-heading transition-all duration-300"
          >
            <div className="relative w-5 h-5">
              <X size={20} className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
              <Menu size={20} className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="px-6 py-4 space-y-1 border-t border-themed">
          {navLinks.map((link, i) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-heading bg-gradient-to-r from-sky-600/10 to-teal-500/10'
                    : 'text-muted hover:text-heading hover:bg-[var(--bg-card)]'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <Icon size={18} className={isActive ? 'text-sky-400' : ''} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-themed flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-heading truncate">{user?.fullName}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-body hover:bg-[var(--bg-card)] rounded-xl transition-colors">
                  <LayoutDashboard size={16} /> Panel
                </Link>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/5 rounded-xl transition-colors">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 text-muted hover:text-heading transition rounded-xl hover:bg-[var(--bg-card)]">
                  <LogIn size={16} />
                  Ingresar
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-3 rounded-xl font-semibold">
                  Comenzar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
