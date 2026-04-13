import { useState, useEffect } from 'react';
import {
  CalendarDays, Clock, Users, Star, MapPin, Stethoscope,
  CheckCircle, AlertCircle, XCircle, Video, Building2,
  GraduationCap, Briefcase, Edit3, Save, X, Tag,
  TrendingUp, DollarSign, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appointments } from '../../services/mockData';
import { useToast } from '../../context/ToastContext';
import CountUp from '../../components/CountUp';

const statusConfig = {
  confirmed: { label: 'Confirmada', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  completed: { label: 'Completada', icon: CheckCircle, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const SCHEDULE = [
  { day: 'Lunes', start: '8:00 AM', end: '5:00 PM', active: true },
  { day: 'Martes', start: '8:00 AM', end: '5:00 PM', active: true },
  { day: 'Miércoles', start: '9:00 AM', end: '3:00 PM', active: true },
  { day: 'Jueves', start: '8:00 AM', end: '5:00 PM', active: true },
  { day: 'Viernes', start: '8:00 AM', end: '1:00 PM', active: true },
  { day: 'Sábado', start: '9:00 AM', end: '12:00 PM', active: false },
  { day: 'Domingo', start: '', end: '', active: false },
];

const MOCK_PATIENTS = [
  { id: 1, name: 'Juan Pérez', age: 34, lastVisit: '2026-04-01', reason: 'Hipertensión', status: 'active' },
  { id: 2, name: 'Ana López', age: 28, lastVisit: '2026-03-28', reason: 'Check-up', status: 'active' },
  { id: 3, name: 'Carlos Méndez', age: 52, lastVisit: '2026-03-20', reason: 'Arritmias', status: 'active' },
  { id: 4, name: 'María Santos', age: 41, lastVisit: '2026-03-15', reason: 'Control', status: 'follow-up' },
  { id: 5, name: 'Pedro Jiménez', age: 63, lastVisit: '2026-02-10', reason: 'Evaluación cardíaca', status: 'completed' },
];

export default function DoctorDashboard() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    specialty: user?.specialty || '',
    location: user?.location || '',
    experience: user?.experience || '',
    education: user?.education || '',
    bio: user?.bio || '',
    price: user?.price || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const todayAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  const summaryCards = [
    { icon: Users, label: 'Mis Pacientes', value: MOCK_PATIENTS.length, color: 'blue' },
    { icon: CalendarDays, label: 'Citas Hoy', value: todayAppointments.length, color: 'emerald' },
    { icon: CheckCircle, label: 'Completadas', value: completedCount, color: 'cyan' },
    { icon: Star, label: 'Rating', value: user?.rating || 4.9, decimal: true, color: 'amber' },
  ];

  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  };

  const tabs = [
    { key: 'overview', label: 'Resumen', icon: TrendingUp },
    { key: 'patients', label: 'Pacientes', icon: Users },
    { key: 'schedule', label: 'Horario', icon: Clock },
    { key: 'profile', label: 'Mi Perfil', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-3xl font-bold text-heading mb-2">
          Bienvenido/a, {user?.fullName?.split(' ').slice(0, 2).join(' ') || 'Doctor'}
        </h2>
        <p className="text-muted">Panel de gestión médica</p>
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
              {card.decimal ? card.value : <CountUp end={card.value} duration={1200} />}
            </p>
            <p className="text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 bg-[var(--bg-input)] rounded-xl w-fit transition-all duration-700 delay-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-[var(--bg-card)] text-heading shadow-sm'
                : 'text-muted hover:text-heading'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* === OVERVIEW === */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Today's Appointments */}
            <div className="card-elevated rounded-2xl p-6">
              <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
                <CalendarDays size={18} className="text-blue-400" />
                Citas del Día
              </h3>
              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map(apt => {
                    const status = statusConfig[apt.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-[var(--bg-input)] border border-themed">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                            <Users size={16} className="text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-heading text-sm">{apt.doctor}</p>
                            <p className="text-xs text-muted">{apt.specialty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1"><Clock size={12} className="text-emerald-400" />{apt.time}</span>
                          <span className="flex items-center gap-1">
                            {apt.type === 'Telemedicina' ? <Video size={12} className="text-cyan-400" /> : <Building2 size={12} className="text-purple-400" />}
                            {apt.type}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          <StatusIcon size={10} />{status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays size={28} className="text-faint mx-auto mb-2" />
                  <p className="text-muted text-sm">No hay citas programadas para hoy</p>
                </div>
              )}
            </div>

            {/* Recent Patients */}
            <div className="card-elevated rounded-2xl p-6">
              <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
                <Users size={18} className="text-cyan-400" />
                Pacientes Recientes
              </h3>
              <div className="space-y-3">
                {MOCK_PATIENTS.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-input)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-blue-400">{p.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-heading text-sm">{p.name}</p>
                      <p className="text-xs text-muted">{p.reason}</p>
                    </div>
                    <span className="text-xs text-faint">{new Date(p.lastVisit).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === PATIENTS === */}
        {activeTab === 'patients' && (
          <div className="card-elevated rounded-2xl p-6">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
              <Users size={18} className="text-blue-400" />
              Mis Pacientes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted uppercase tracking-wider border-b border-themed">
                    <th className="pb-3 pr-4">Paciente</th>
                    <th className="pb-3 pr-4">Edad</th>
                    <th className="pb-3 pr-4">Motivo</th>
                    <th className="pb-3 pr-4">Última Visita</th>
                    <th className="pb-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-themed">
                  {MOCK_PATIENTS.map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-input)] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-400">{p.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-heading">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-muted">{p.age} años</td>
                      <td className="py-4 pr-4 text-body">{p.reason}</td>
                      <td className="py-4 pr-4 text-muted">{new Date(p.lastVisit).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'active' ? 'text-emerald-400 bg-emerald-500/10' :
                          p.status === 'follow-up' ? 'text-amber-400 bg-amber-500/10' :
                          'text-blue-400 bg-blue-500/10'
                        }`}>
                          {p.status === 'active' ? 'Activo' : p.status === 'follow-up' ? 'Seguimiento' : 'Completado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === SCHEDULE === */}
        {activeTab === 'schedule' && (
          <div className="card-elevated rounded-2xl p-6">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
              <Clock size={18} className="text-emerald-400" />
              Horario de Consulta
            </h3>
            <div className="space-y-3">
              {SCHEDULE.map(slot => (
                <div key={slot.day} className={`flex items-center justify-between p-4 rounded-xl border border-themed ${slot.active ? 'bg-[var(--bg-input)]' : 'opacity-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${slot.active ? 'bg-emerald-400' : 'bg-red-400/50'}`} />
                    <span className="font-medium text-heading text-sm w-24">{slot.day}</span>
                  </div>
                  {slot.active ? (
                    <span className="text-sm text-body">{slot.start} — {slot.end}</span>
                  ) : (
                    <span className="text-sm text-faint italic">No disponible</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === PROFILE === */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card-elevated rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-heading flex items-center gap-2">
                  <FileText size={18} className="text-purple-400" />
                  Mi Perfil Profesional
                </h3>
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="p-2 rounded-lg text-muted hover:text-heading hover:bg-[var(--bg-input)] transition-all">
                      <X size={16} />
                    </button>
                    <button onClick={handleSaveProfile} className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                      <Save size={14} /> Guardar
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="card-interactive px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 text-heading">
                    <Edit3 size={14} /> Editar
                  </button>
                )}
              </div>

              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Nombre completo</label>
                    <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Especialidad</label>
                    <input type="text" value={profileForm.specialty} onChange={e => setProfileForm({ ...profileForm, specialty: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Ubicación</label>
                    <input type="text" value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Experiencia</label>
                    <input type="text" value={profileForm.experience} onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Precio por consulta</label>
                    <input type="text" value={profileForm.price} onChange={e => setProfileForm({ ...profileForm, price: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Teléfono</label>
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1.5">Educación</label>
                    <input type="text" value={profileForm.education} onChange={e => setProfileForm({ ...profileForm, education: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1.5">Biografía</label>
                    <textarea rows={4} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} className="input-base w-full rounded-xl px-4 py-3 text-sm resize-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Bio Header */}
                  <div className="flex items-start gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                      <span className="text-2xl font-bold text-white">{user?.fullName?.charAt(0) || 'D'}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-heading">{user?.fullName}</h4>
                      <p className="text-cyan-400 font-medium">{user?.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                        <span className="flex items-center gap-1"><MapPin size={13} />{user?.location}</span>
                        <span className="flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400" />{user?.rating} ({user?.reviews} reseñas)</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-themed">
                      <div className="flex items-center gap-2 text-muted text-xs mb-1">
                        <Briefcase size={13} /> Experiencia
                      </div>
                      <p className="font-semibold text-heading text-sm">{user?.experience || 'Sin especificar'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-themed">
                      <div className="flex items-center gap-2 text-muted text-xs mb-1">
                        <DollarSign size={13} /> Precio Consulta
                      </div>
                      <p className="font-semibold text-emerald-400 text-sm">{user?.price || 'Sin especificar'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-themed md:col-span-2">
                      <div className="flex items-center gap-2 text-muted text-xs mb-1">
                        <GraduationCap size={13} /> Educación
                      </div>
                      <p className="font-semibold text-heading text-sm">{user?.education || 'Sin especificar'}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h5 className="text-sm font-semibold text-heading mb-2">Biografía</h5>
                    <p className="text-muted text-sm leading-relaxed">{user?.bio || 'Sin biografía'}</p>
                  </div>

                  {/* Tags */}
                  {user?.tags?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-heading mb-3 flex items-center gap-1.5"><Tag size={13} /> Especialidades</h5>
                      <div className="flex flex-wrap gap-2">
                        {user.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
