import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, Stethoscope, Star, MapPin, ArrowRight,
  Plus, CheckCircle, AlertCircle, XCircle, Video, Building2,
  User, Heart, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doctors, appointments } from '../../services/mockData';
import CountUp from '../../components/CountUp';

const statusConfig = {
  confirmed: { label: 'Confirmada', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  completed: { label: 'Completada', icon: CheckCircle, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  const summaryCards = [
    { icon: CalendarDays, label: 'Próximas Citas', value: upcomingAppointments.length, color: 'blue' },
    { icon: CheckCircle, label: 'Completadas', value: completedCount, color: 'emerald' },
    { icon: Stethoscope, label: 'Doctores Disponibles', value: doctors.filter(d => d.available).length, color: 'cyan' },
    { icon: Heart, label: 'Favoritos', value: 3, color: 'rose' },
  ];

  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-3xl font-bold text-heading mb-2">
          Hola, {user?.fullName?.split(' ')[0] || 'Paciente'} 👋
        </h2>
        <p className="text-muted">Aquí tienes un resumen de tu actividad médica</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card, i) => (
          <div
            key={card.label}
            className={`card-interactive rounded-2xl p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${(i + 1) * 100}ms` }}
          >
            <div className={`w-11 h-11 rounded-xl ${colorMap[card.color]} flex items-center justify-center mb-4`}>
              <card.icon size={20} />
            </div>
            <p className="text-3xl font-bold text-heading mb-1">
              <CountUp end={card.value} duration={1200} />
            </p>
            <p className="text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-heading flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-400" />
            Próximas Citas
          </h3>
          <Link to="/appointments/new" className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
            <Plus size={14} /> Nueva Cita
          </Link>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 4).map(apt => {
              const status = statusConfig[apt.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[var(--bg-input)] border border-themed">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shrink-0">
                      <Stethoscope size={16} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-heading text-sm truncate">{apt.doctor}</p>
                      <p className="text-xs text-cyan-400">{apt.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1"><CalendarDays size={12} className="text-blue-400" />{new Date(apt.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-emerald-400" />{apt.time}</span>
                    <span className="flex items-center gap-1">
                      {apt.type === 'Telemedicina' ? <Video size={12} className="text-cyan-400" /> : <Building2 size={12} className="text-purple-400" />}
                      {apt.type}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color} shrink-0`}>
                    <StatusIcon size={10} />
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <CalendarDays size={32} className="text-faint mx-auto mb-3" />
            <p className="text-muted text-sm">No tienes citas próximas</p>
            <Link to="/appointments/new" className="text-blue-400 text-sm font-medium mt-2 inline-block hover:text-blue-300">
              Agendar una cita →
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Doctors */}
      <div className={`transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-heading flex items-center gap-2">
            <Activity size={18} className="text-cyan-400" />
            Doctores Recomendados
          </h3>
          <Link to="/doctors" className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-300 transition-colors">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.filter(d => d.available).slice(0, 3).map(doc => (
            <Link
              key={doc.id}
              to={`/doctors/${doc.id}`}
              className="card-interactive rounded-2xl p-5 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center">
                  <User size={20} className="text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-heading text-sm truncate group-hover:text-gradient-premium transition-all">{doc.name}</p>
                  <p className="text-xs text-cyan-400">{doc.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" />{doc.rating}</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{doc.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold text-sm">{doc.price}</span>
                <span className="text-xs text-muted">{doc.nextAvailable}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
