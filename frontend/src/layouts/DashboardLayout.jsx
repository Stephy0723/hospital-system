import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, CalendarDays, Settings } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/patients', icon: Users, label: 'Pacientes' },
  { to: '/dashboard/doctors', icon: Stethoscope, label: 'Doctores' },
  { to: '/dashboard/appointments', icon: CalendarDays, label: 'Citas' },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-themed transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-themed bg-[var(--bg-card)] p-6 flex flex-col">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/25">
            M
          </div>
          <span className="text-lg font-semibold text-heading">MedAgenda</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-muted hover:text-heading hover:bg-[var(--bg-input)]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-themed flex items-center gap-3">
          <Settings size={18} className="text-muted" />
          <span className="text-sm text-muted">Configuración</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-themed px-6 py-4 bg-[var(--bg-card)]">
          <p className="text-muted text-sm">Panel de Administración</p>
        </header>
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
