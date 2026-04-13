import { useState, useEffect } from 'react';
import {
  Users, Search, User, Mail, Phone, Calendar,
  ChevronRight, Activity
} from 'lucide-react';

const MOCK_PATIENTS = [
  { id: 1, name: 'María García', email: 'maria@email.com', phone: '+1 809-555-0101', lastVisit: '2024-12-15', status: 'active', visits: 8 },
  { id: 2, name: 'Juan Rodríguez', email: 'juan@email.com', phone: '+1 809-555-0102', lastVisit: '2024-12-12', status: 'active', visits: 5 },
  { id: 3, name: 'Ana Martínez', email: 'ana@email.com', phone: '+1 809-555-0103', lastVisit: '2024-11-28', status: 'inactive', visits: 3 },
  { id: 4, name: 'Carlos López', email: 'carlos@email.com', phone: '+1 809-555-0104', lastVisit: '2024-12-18', status: 'active', visits: 12 },
  { id: 5, name: 'Sofía Hernández', email: 'sofia@email.com', phone: '+1 809-555-0105', lastVisit: '2024-12-10', status: 'active', visits: 6 },
  { id: 6, name: 'Pedro Sánchez', email: 'pedro@email.com', phone: '+1 809-555-0106', lastVisit: '2024-10-05', status: 'inactive', visits: 2 },
];

export default function DashboardPatients() {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_PATIENTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-bold text-heading mb-1">Mis Pacientes</h2>
        <p className="text-muted text-sm">Gestiona y revisa el historial de tus pacientes</p>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <StatCard label="Total" value={MOCK_PATIENTS.length} icon={Users} color="blue" />
        <StatCard label="Activos" value={MOCK_PATIENTS.filter(p => p.status === 'active').length} icon={Activity} color="emerald" />
        <StatCard label="Inactivos" value={MOCK_PATIENTS.filter(p => p.status === 'inactive').length} icon={Users} color="amber" />
        <StatCard label="Consultas" value={MOCK_PATIENTS.reduce((s, p) => s + p.visits, 0)} icon={Calendar} color="cyan" />
      </div>

      {/* Search & Filter */}
      <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base w-full rounded-xl px-4 py-3 pl-11 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                filter === f
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'text-muted border-themed hover:text-heading'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filtered.map((patient, i) => (
          <div
            key={patient.id}
            className={`card-elevated rounded-2xl p-5 transition-all duration-500 hover:shadow-lg hover:border-blue-500/20 group cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${250 + i * 80}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shrink-0">
                <User size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-heading text-sm truncate group-hover:text-blue-400 transition-colors">{patient.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    patient.status === 'active'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1"><Mail size={11} />{patient.email}</span>
                  <span className="flex items-center gap-1"><Phone size={11} />{patient.phone}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />Última: {patient.lastVisit}</span>
                  <span className="flex items-center gap-1"><Activity size={11} />{patient.visits} consultas</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-faint group-hover:text-blue-400 transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users size={36} className="text-faint mx-auto mb-4" />
          <h3 className="text-lg font-bold text-heading mb-2">Sin resultados</h3>
          <p className="text-muted text-sm">No se encontraron pacientes con ese criterio</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400',
  };
  return (
    <div className="card-elevated rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-2`}>
        <Icon size={14} />
      </div>
      <p className="text-xl font-bold text-heading">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
