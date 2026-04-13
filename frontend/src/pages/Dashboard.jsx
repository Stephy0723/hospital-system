import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, CalendarDays, TrendingUp, Activity, Clock, ArrowUpRight } from 'lucide-react';
import CountUp from '../components/CountUp';

const cards = [
  { icon: Users, label: 'Pacientes', desc: 'Registrados este mes', value: 1234, trend: '+12%', color: 'blue' },
  { icon: Stethoscope, label: 'Doctores', desc: 'Activos en plataforma', value: 87, trend: '+5%', color: 'cyan' },
  { icon: CalendarDays, label: 'Citas', desc: 'Programadas esta semana', value: 356, trend: '+23%', color: 'emerald' },
  { icon: Activity, label: 'Consultas', desc: 'Completadas hoy', value: 48, trend: '+8%', color: 'purple' },
];

const colorMap = {
  blue: 'text-blue-400 bg-blue-500/10',
  cyan: 'text-cyan-400 bg-cyan-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
};

const recentActivity = [
  { text: 'Nueva cita programada - Dr. García', time: 'Hace 5 min', color: 'bg-blue-400' },
  { text: 'Paciente registrado - María López', time: 'Hace 12 min', color: 'bg-emerald-400' },
  { text: 'Consulta completada - Dr. Rodríguez', time: 'Hace 25 min', color: 'bg-cyan-400' },
  { text: 'Actualización de perfil - Dr. Martínez', time: 'Hace 1 hora', color: 'bg-purple-400' },
];

export default function Dashboard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className={`mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-3xl font-bold text-heading mb-2">Bienvenido al panel</h2>
        <p className="text-muted">Resumen general de la plataforma MediFlow</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`card-interactive rounded-2xl p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${(i + 1) * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`w-11 h-11 rounded-xl ${colorMap[card.color]} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                <card.icon size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {card.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-heading mb-1">
              <CountUp end={card.value} duration={1500} />
            </p>
            <h3 className="text-sm font-semibold text-body">{card.label}</h3>
            <p className="text-xs text-muted mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-heading flex items-center gap-2">
            <Clock size={18} className="text-blue-400" />
            Actividad Reciente
          </h3>
          <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
            <Link to="/appointments" className="flex items-center gap-1">Ver todo <ArrowUpRight size={12} /></Link>
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-[var(--bg-card)] ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              style={{ transitionDelay: `${600 + i * 100}ms` }}
            >
              <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <p className="flex-1 text-sm text-body">{item.text}</p>
              <span className="text-xs text-faint whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
