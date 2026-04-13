import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Stethoscope, LayoutGrid, Users, LogIn, Menu, X, ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/doctors', label: 'Médicos', icon: Stethoscope },
  { to: '/services', label: 'Servicios', icon: LayoutGrid },
  { to: '/about', label: 'Nosotros', icon: Users },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

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
          <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-blue-500/30 group-hover:scale-105">
            <Stethoscope size={20} className="text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
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
                    ? 'text-heading bg-gradient-to-r from-blue-600/10 to-cyan-500/10 shadow-sm'
                    : 'text-muted hover:text-heading'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-400' : ''} />
                {link.label}
                {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
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
                    ? 'text-heading bg-gradient-to-r from-blue-600/10 to-cyan-500/10'
                    : 'text-muted hover:text-heading hover:bg-[var(--bg-card)]'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <Icon size={18} className={isActive ? 'text-blue-400' : ''} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-themed flex flex-col gap-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 text-muted hover:text-heading transition rounded-xl hover:bg-[var(--bg-card)]">
              <LogIn size={16} />
              Ingresar
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-3 rounded-xl font-semibold">
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
