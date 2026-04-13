import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, User, MapPin, Search, Filter,
  ChevronRight, Plus, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appointments as allAppointments, doctors } from '../../services/mockData';

const STATUS_MAP = {
  confirmed: { label: 'Confirmada', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  completed: { label: 'Completada', icon: CheckCircle2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export default function DashboardAppointments() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const appointments = allAppointments.map(a => ({
    ...a,
    doctor: doctors.find(d => d.id === a.doctorId),
  }));

  const filtered = appointments.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter;
    const matchSearch = search === '' ||
      (a.doctor?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const upcoming = filtered.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const past = filtered.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h2 className="text-2xl font-bold text-heading mb-1">Mis Citas</h2>
          <p className="text-muted text-sm">Gestiona tus citas médicas</p>
        </div>
        {user?.role !== 'doctor' && (
          <Link
            to="/appointments/new"
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 self-start"
          >
            <Plus size={16} /> Nueva Cita
          </Link>
        )}
      </div>

      {/* Search & Filter */}
      <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por doctor o especialidad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base w-full rounded-xl px-4 py-3 pl-11 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                filter === f
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'text-muted border-themed hover:text-heading'
              }`}
            >
              {f === 'all' ? 'Todas' : STATUS_MAP[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Section */}
      {upcoming.length > 0 && (
        <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-3">Próximas</h3>
          <div className="space-y-3">
            {upcoming.map((a, i) => {
              const st = STATUS_MAP[a.status] || STATUS_MAP.pending;
              const Icon = st.icon;
              return (
                <div
                  key={a.id}
                  className="card-elevated rounded-2xl p-5 transition-all duration-500 hover:shadow-lg hover:border-blue-500/20"
                  style={{ transitionDelay: `${250 + i * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shrink-0">
                      <User size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-heading text-sm truncate">{a.doctor?.name || 'Doctor'}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 shrink-0 ${st.color}`}>
                          <Icon size={10} /> {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium mb-2">{a.specialty}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="flex items-center gap-1"><Calendar size={12} />{a.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{a.time}</span>
                        {a.doctor?.location && (
                          <span className="flex items-center gap-1"><MapPin size={12} />{a.doctor.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Section */}
      {past.length > 0 && (
        <div className={`transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-3">Historial</h3>
          <div className="space-y-3">
            {past.map((a, i) => {
              const st = STATUS_MAP[a.status] || STATUS_MAP.completed;
              const Icon = st.icon;
              return (
                <div
                  key={a.id}
                  className="card-elevated rounded-2xl p-5 opacity-70 transition-all duration-500 hover:opacity-100"
                  style={{ transitionDelay: `${350 + i * 60}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-input)] border border-themed flex items-center justify-center shrink-0">
                      <User size={16} className="text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-heading text-sm truncate">{a.doctor?.name || 'Doctor'}</h4>
                      <p className="text-xs text-muted">{a.specialty} · {a.date}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 shrink-0 ${st.color}`}>
                      <Icon size={10} /> {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Calendar size={36} className="text-faint mx-auto mb-4" />
          <h3 className="text-lg font-bold text-heading mb-2">Sin citas</h3>
          <p className="text-muted text-sm mb-4">No tienes citas registradas aún</p>
          {user?.role !== 'doctor' && (
            <Link
              to="/appointments/new"
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus size={16} /> Agendar Primera Cita
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
