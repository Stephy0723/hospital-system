import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, Users, FileText, TrendingUp, Activity,
  ArrowUpRight, Stethoscope, MapPin, Star, ChevronRight,
  DollarSign, BarChart3, CheckCircle2, AlertCircle, UserCheck,
  Building2, Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import CountUp from '../../components/CountUp';

const colorMap = {
  sky: 'text-sky-400 bg-sky-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
  rose: 'text-rose-400 bg-rose-500/10',
};

const STATUS_BADGE = {
  confirmed: { label: 'Confirmada', color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle2 },
  pending: { label: 'Pendiente', color: 'text-amber-400 bg-amber-500/10', icon: AlertCircle },
  completed: { label: 'Completada', color: 'text-sky-400 bg-sky-500/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', color: 'text-rose-400 bg-rose-500/10', icon: AlertCircle },
};

export default function DoctorHome() {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const { appointments, prescriptions } = useAppData();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Filter data relevant to this doctor
  const myAppointments = appointments.filter(a =>
    a.doctorId === user?.id || a.doctorEmail === user?.email ||
    a.doctor?.toLowerCase().includes(user?.fullName?.toLowerCase().split(' ').slice(-1)[0] || '---')
  );
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = myAppointments.filter(a =>
    a.date === todayStr && (a.status === 'confirmed' || a.status === 'pending')
  );
  const upcomingAppts = myAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedAppts = myAppointments.filter(a => a.status === 'completed');
  const myPrescriptions = prescriptions.filter(rx =>
    rx.doctorId === user?.id || rx.doctorEmail === user?.email ||
    rx.doctor?.toLowerCase().includes(user?.fullName?.toLowerCase().split(' ').slice(-1)[0] || '---')
  );

  // Unique patients from appointments
  const uniquePatients = new Set(myAppointments.map(a => a.patientEmail || a.patient || a.patientId).filter(Boolean));

  // Doctor profile data from registration
  const specialty = user?.specialty || 'Medicina General';
  const secondarySpecialty = user?.secondarySpecialty || '';
  const city = user?.city || '';
  const hospital = user?.hospital || '';
  const yearsExperience = user?.yearsExperience || 0;
  const consultationPrice = user?.consultationPrice || '';
  const availableDays = user?.availableDays || [];
  const license = user?.licenseNumber || '';

  const statCards = [
    { icon: CalendarDays, label: 'Citas Hoy', value: todayAppts.length, desc: 'pendientes hoy', color: 'sky' },
    { icon: Users, label: 'Mis Pacientes', value: uniquePatients.size, desc: 'pacientes atendidos', color: 'emerald' },
    { icon: CheckCircle2, label: 'Consultas', value: completedAppts.length, desc: 'completadas', color: 'purple' },
    { icon: FileText, label: 'Recetas Emitidas', value: myPrescriptions.length, desc: 'total', color: 'amber' },
  ];

  // Today's schedule  
  const daySchedule = upcomingAppts.sort((a, b) => {
    const timeA = a.time || '';
    const timeB = b.time || '';
    return timeA.localeCompare(timeB);
  }).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h2 className="text-3xl font-bold text-heading mb-1">
            Buen día, Dr. {user?.fullName?.split(' ').slice(-1)[0] || 'Doctor'} 🩺
          </h2>
          <p className="text-muted">{specialty}{secondarySpecialty ? ` · ${secondarySpecialty}` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/prescriptions"
            className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-themed text-sm font-medium text-body hover:border-sky-500/30 transition-colors flex items-center gap-2"
          >
            <FileText size={15} /> Nueva Receta
          </Link>
          <Link
            to="/dashboard/appointments"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <CalendarDays size={15} /> Ver Agenda
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`card-interactive rounded-2xl p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${(i + 1) * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${colorMap[card.color]} flex items-center justify-center`}>
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-heading mb-0.5">
              <CountUp end={card.value} duration={1200} />
            </p>
            <p className="text-sm font-medium text-body">{card.label}</p>
            <p className="text-xs text-muted mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule (2/3) */}
        <div className={`lg:col-span-2 card-elevated rounded-2xl p-6 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2">
              <Clock size={18} className="text-sky-400" />
              Agenda de Citas
            </h3>
            <Link to="/dashboard/appointments" className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              Ver completa <ArrowUpRight size={12} />
            </Link>
          </div>

          {daySchedule.length > 0 ? (
            <div className="space-y-3">
              {daySchedule.map((appt, i) => {
                const badge = STATUS_BADGE[appt.status] || STATUS_BADGE.pending;
                return (
                  <div
                    key={appt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-input)] border border-themed transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${400 + i * 80}ms` }}
                  >
                    <div className="flex-shrink-0 text-center">
                      <p className="text-xs text-muted">{appt.date ? new Date(appt.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }) : '—'}</p>
                      <p className="text-sm font-bold text-heading">{appt.time || '—'}</p>
                    </div>
                    <div className="w-px h-10 bg-[var(--border)]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-heading truncate">{appt.patient || appt.patientName || 'Paciente'}</p>
                      <p className="text-xs text-muted">{appt.specialty} · {appt.type || 'Presencial'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${badge.color}`}>
                      <badge.icon size={12} /> {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-muted">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tienes citas programadas</p>
            </div>
          )}
        </div>

        {/* Professional Profile (1/3) */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
            <Award size={18} className="text-amber-400" />
            Mi Perfil Profesional
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-input)]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.fullName?.charAt(0) || 'D'}
              </div>
              <div>
                <p className="font-semibold text-heading text-sm">{user?.fullName}</p>
                <p className="text-xs text-muted">{specialty}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {license && (
                <div className="flex items-center gap-2 text-body">
                  <FileText size={14} className="text-muted shrink-0" />
                  <span className="text-muted">Exequátur:</span>
                  <span className="font-medium">{license}</span>
                </div>
              )}
              {hospital && (
                <div className="flex items-center gap-2 text-body">
                  <Building2 size={14} className="text-muted shrink-0" />
                  <span className="truncate">{hospital}</span>
                </div>
              )}
              {city && (
                <div className="flex items-center gap-2 text-body">
                  <MapPin size={14} className="text-muted shrink-0" />
                  <span>{city}</span>
                </div>
              )}
              {yearsExperience > 0 && (
                <div className="flex items-center gap-2 text-body">
                  <Star size={14} className="text-muted shrink-0" />
                  <span>{yearsExperience} años de experiencia</span>
                </div>
              )}
              {consultationPrice && (
                <div className="flex items-center gap-2 text-body">
                  <DollarSign size={14} className="text-muted shrink-0" />
                  <span>RD$ {consultationPrice}</span>
                </div>
              )}
              {availableDays.length > 0 && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-2">Días Disponibles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableDays.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-xs font-medium">{d.slice(0, 3)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/dashboard/profile" className="block text-xs text-sky-400 hover:text-sky-300 font-medium mt-2">
              Editar perfil →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Patients + Recent Prescriptions + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-heading flex items-center gap-2">
              <Users size={16} className="text-emerald-400" />
              Pacientes Recientes
            </h3>
            <Link to="/dashboard/patients" className="text-xs text-sky-400 hover:text-sky-300 font-medium">
              Ver todos
            </Link>
          </div>
          {completedAppts.length > 0 ? (
            <div className="space-y-3">
              {completedAppts.slice(0, 5).map((a, i) => (
                <div key={a.id || i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-input)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {(a.patient || a.patientName || 'P').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-heading truncate">{a.patient || a.patientName || 'Paciente'}</p>
                    <p className="text-xs text-muted">{new Date(a.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <ChevronRight size={14} className="text-faint" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-6">Sin pacientes recientes</p>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-heading flex items-center gap-2">
              <FileText size={16} className="text-purple-400" />
              Últimas Recetas
            </h3>
            <Link to="/dashboard/prescriptions" className="text-xs text-sky-400 hover:text-sky-300 font-medium">
              Ver todas
            </Link>
          </div>
          {myPrescriptions.length > 0 ? (
            <div className="space-y-3">
              {myPrescriptions.slice(0, 4).map(rx => (
                <div key={rx.id} className="p-3 rounded-xl bg-[var(--bg-input)] border border-themed">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted">{rx.id}</span>
                    <span className={`text-xs font-medium ${rx.status === 'active' ? 'text-emerald-400' : rx.status === 'dispensed' ? 'text-sky-400' : 'text-rose-400'}`}>
                      {rx.status === 'active' ? 'Activa' : rx.status === 'dispensed' ? 'Surtida' : 'Vencida'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-heading">{rx.patient}</p>
                  <p className="text-xs text-muted mt-0.5">{rx.diagnosis}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-6">Sin recetas emitidas</p>
          )}
        </div>

        {/* Quick Stats / Performance */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading flex items-center gap-2 mb-5">
            <BarChart3 size={16} className="text-sky-400" />
            Rendimiento
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Tasa de asistencia</span>
                <span className="text-sm font-bold text-heading">
                  {myAppointments.length > 0
                    ? Math.round((completedAppts.length / myAppointments.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-input)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-1000"
                  style={{ width: `${myAppointments.length > 0 ? (completedAppts.length / myAppointments.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Citas completadas</span>
                <span className="text-sm font-bold text-heading">{completedAppts.length}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-input)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                  style={{ width: `${Math.min(completedAppts.length * 10, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Recetas emitidas</span>
                <span className="text-sm font-bold text-heading">{myPrescriptions.length}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-input)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                  style={{ width: `${Math.min(myPrescriptions.length * 15, 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-themed">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-[var(--bg-input)]">
                  <p className="text-xl font-bold text-heading">{upcomingAppts.length}</p>
                  <p className="text-xs text-muted">Pendientes</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--bg-input)]">
                  <p className="text-xl font-bold text-heading">{todayAppts.length}</p>
                  <p className="text-xs text-muted">Hoy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
