import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, CheckCircle, AlertCircle, XCircle, Video,
  Building2, ArrowRight, Plus, Filter, Sparkles
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { appointments, doctors } from '../services/mockData';

const statusConfig = {
  confirmed: { label: 'Confirmada', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  completed: { label: 'Completada', icon: CheckCircle, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export default function Appointments() {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  return (
    <div ref={containerRef} className="space-y-10">
      {/* Header */}
      <section className="relative pt-12 pb-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-emerald-600/8 blur-[180px] rounded-full" />
          <div className="absolute top-[5%] right-[15%] w-[400px] h-[400px] bg-blue-500/6 blur-[180px] rounded-full" />
        </div>

        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
              <Sparkles size={14} />
              <span className="uppercase tracking-wider">Mis Citas</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-heading mb-3">
              Mis <span className="text-gradient-premium">Citas Médicas</span>
            </h1>
            <p className="text-muted text-lg">Gestiona tus consultas y próximas citas</p>
          </div>
          <Link
            to="/appointments/new"
            className="btn-primary px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 group shrink-0"
          >
            <Plus size={16} />
            Nueva Cita
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Filters */}
      <section className={`transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-muted" />
          {[
            { key: 'all', label: 'Todas' },
            { key: 'confirmed', label: 'Confirmadas' },
            { key: 'pending', label: 'Pendientes' },
            { key: 'completed', label: 'Completadas' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === f.key
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-muted hover:text-heading hover:bg-[var(--bg-card)] border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Appointment Cards */}
      <section>
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt, i) => {
              const status = statusConfig[apt.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const doctor = doctors.find(d => d.name === apt.doctor);

              return (
                <div
                  key={apt.id}
                  className={`card-interactive rounded-2xl p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${200 + i * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-5">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shrink-0">
                        <CalendarDays size={22} className="text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-heading truncate">{apt.doctor}</h3>
                        <p className="text-sm text-cyan-400 font-medium">{apt.specialty}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted">
                        <CalendarDays size={14} className="text-blue-400" />
                        <span>{new Date(apt.date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Clock size={14} className="text-emerald-400" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        {apt.type === 'Telemedicina' ? <Video size={14} className="text-cyan-400" /> : <Building2 size={14} className="text-purple-400" />}
                        <span>{apt.type}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color} shrink-0`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-card)] border border-themed flex items-center justify-center">
              <CalendarDays size={32} className="text-faint" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">No hay citas</h3>
            <p className="text-muted mb-6">No tienes citas con este filtro</p>
            <button onClick={() => setFilter('all')} className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm">
              Ver todas
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
