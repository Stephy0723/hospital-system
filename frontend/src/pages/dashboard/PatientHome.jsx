import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, FileText, Heart, Activity, TrendingUp,
  ArrowUpRight, Pill, AlertCircle, CheckCircle2, Stethoscope,
  MapPin, Phone, Shield, Star, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { doctors, pharmacies } from '../../services/mockData';
import CountUp from '../../components/CountUp';

const colorMap = {
  sky: 'text-sky-400 bg-sky-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
  rose: 'text-rose-400 bg-rose-500/10',
};

const STATUS_BADGE = {
  confirmed: { label: 'Confirmada', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  pending: { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertCircle },
  completed: { label: 'Completada', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertCircle },
};

export default function PatientHome() {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const { appointments, prescriptions } = useAppData();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Filter data for current patient
  const myAppointments = appointments.filter(a =>
    a.patientId === user?.id || a.patientEmail === user?.email
  );
  const upcomingAppts = myAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastAppts = myAppointments.filter(a => a.status === 'completed');
  const myPrescriptions = prescriptions.filter(rx =>
    rx.patientId === user?.id || rx.patientEmail === user?.email
  );
  const activeRx = myPrescriptions.filter(rx => rx.status === 'active');

  // Medical conditions from registration
  const conditions = user?.conditions || [];
  const allergies = user?.allergies || '';
  const bloodType = user?.bloodType || '—';
  const emergencyContact = user?.emergencyContact || '';
  const emergencyPhone = user?.emergencyPhone || '';

  const statCards = [
    { icon: CalendarDays, label: 'Citas Próximas', value: upcomingAppts.length, desc: 'programadas', color: 'sky' },
    { icon: CheckCircle2, label: 'Consultas Realizadas', value: pastAppts.length, desc: 'completadas', color: 'emerald' },
    { icon: FileText, label: 'Recetas Activas', value: activeRx.length, desc: 'pendientes', color: 'purple' },
    { icon: Heart, label: 'Condiciones', value: conditions.length, desc: 'registradas', color: 'rose' },
  ];

  // Next appointment
  const nextAppt = upcomingAppts.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const nextDoctor = nextAppt ? doctors.find(d => d.id === nextAppt.doctorId) : null;

  // Nearby pharmacy
  const nearbyPharmacy = pharmacies[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-3xl font-bold text-heading mb-1">
          Hola, {user?.fullName?.split(' ')[0] || 'Paciente'} 👋
        </h2>
        <p className="text-muted">Aquí tienes un resumen de tu salud y próximas citas</p>
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
        {/* Next Appointment (2/3) */}
        <div className={`lg:col-span-2 card-elevated rounded-2xl p-6 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2">
              <CalendarDays size={18} className="text-sky-400" />
              Próxima Cita
            </h3>
            <Link to="/dashboard/appointments" className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              Ver todas <ArrowUpRight size={12} />
            </Link>
          </div>

          {nextAppt ? (
            <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-[var(--bg-input)] border border-themed">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-sky-600 to-teal-500 flex flex-col items-center justify-center text-white">
                <span className="text-xs font-medium leading-none">{new Date(nextAppt.date).toLocaleDateString('es-DO', { month: 'short' }).toUpperCase()}</span>
                <span className="text-lg font-bold leading-none mt-0.5">{new Date(nextAppt.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-heading">{nextAppt.doctor || nextDoctor?.name}</h4>
                    <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
                      <Stethoscope size={13} /> {nextAppt.specialty}
                    </p>
                  </div>
                  {(() => {
                    const badge = STATUS_BADGE[nextAppt.status];
                    return badge ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${badge.color}`}>
                        <badge.icon size={12} /> {badge.label}
                      </span>
                    ) : null;
                  })()}
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Clock size={12} /> {nextAppt.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {nextAppt.type || 'Presencial'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-muted">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tienes citas próximas</p>
              <Link to="/appointments/new" className="inline-block mt-3 text-sm text-sky-400 hover:text-sky-300 font-medium">
                Agendar una cita →
              </Link>
            </div>
          )}
        </div>

        {/* Medical Profile Summary (1/3) */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
            <Heart size={18} className="text-rose-400" />
            Mi Perfil Médico
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Tipo de Sangre</p>
              <span className="inline-block px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-sm">{bloodType}</span>
            </div>
            {conditions.length > 0 && (
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Condiciones</p>
                <div className="flex flex-wrap gap-1.5">
                  {conditions.slice(0, 4).map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium">{c}</span>
                  ))}
                  {conditions.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-input)] text-muted text-xs">+{conditions.length - 4}</span>
                  )}
                </div>
              </div>
            )}
            {allergies && (
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Alergias</p>
                <p className="text-sm text-body">{allergies}</p>
              </div>
            )}
            {emergencyContact && (
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Contacto de Emergencia</p>
                <p className="text-sm text-body">{emergencyContact}</p>
                {emergencyPhone && <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><Phone size={11} /> {emergencyPhone}</p>}
              </div>
            )}
            <Link to="/dashboard/profile" className="block text-xs text-sky-400 hover:text-sky-300 font-medium mt-2">
              Ver perfil completo →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Visits + Active Prescriptions + Pharmacy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Visits */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-heading flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              Últimas Consultas
            </h3>
          </div>
          {pastAppts.length > 0 ? (
            <div className="space-y-3">
              {pastAppts.slice(0, 4).map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-input)] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Stethoscope size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-heading truncate">{a.doctor}</p>
                    <p className="text-xs text-muted">{a.specialty} · {new Date(a.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <ChevronRight size={14} className="text-faint" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-6">Sin consultas previas</p>
          )}
        </div>

        {/* Active Prescriptions */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-heading flex items-center gap-2">
              <FileText size={16} className="text-purple-400" />
              Recetas Activas
            </h3>
            <Link to="/dashboard/prescriptions" className="text-xs text-sky-400 hover:text-sky-300 font-medium">
              Ver todas
            </Link>
          </div>
          {activeRx.length > 0 ? (
            <div className="space-y-3">
              {activeRx.slice(0, 4).map(rx => (
                <div key={rx.id} className="p-3 rounded-xl bg-[var(--bg-input)] border border-themed">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted">{rx.id}</span>
                    <span className="text-xs font-medium text-emerald-400">Activa</span>
                  </div>
                  <p className="text-sm font-medium text-heading">{rx.diagnosis}</p>
                  <p className="text-xs text-muted mt-1">Dr. {rx.doctor} · {rx.date}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rx.medications?.slice(0, 2).map((m, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs">
                        <Pill size={10} /> {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-6">Sin recetas activas</p>
          )}
        </div>

        {/* Nearby Pharmacy */}
        <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading flex items-center gap-2 mb-5">
            <Pill size={16} className="text-teal-400" />
            Farmacia Cercana
          </h3>
          {nearbyPharmacy && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-themed">
                <h4 className="font-semibold text-heading text-sm">{nearbyPharmacy.name}</h4>
                <div className="mt-2 space-y-1.5 text-xs text-muted">
                  <p className="flex items-center gap-1.5"><MapPin size={12} /> {nearbyPharmacy.address}</p>
                  <p className="flex items-center gap-1.5"><Phone size={12} /> {nearbyPharmacy.phone}</p>
                  <p className="flex items-center gap-1.5"><Clock size={12} /> {nearbyPharmacy.hours}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star size={12} fill="currentColor" /> {nearbyPharmacy.rating}
                  </div>
                  <span className="text-xs text-muted">({nearbyPharmacy.reviews} reseñas)</span>
                  {nearbyPharmacy.hasDelivery && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium ml-auto">Delivery</span>
                  )}
                </div>
              </div>
              <Link to="/pharmacy" className="block text-xs text-sky-400 hover:text-sky-300 font-medium">
                Ver todas las farmacias →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="font-bold text-heading mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/appointments/new', icon: CalendarDays, label: 'Nueva Cita', color: 'sky' },
            { to: '/doctors', icon: Stethoscope, label: 'Buscar Doctor', color: 'emerald' },
            { to: '/dashboard/prescriptions', icon: FileText, label: 'Mis Recetas', color: 'purple' },
            { to: '/pharmacy', icon: Pill, label: 'Farmacias', color: 'teal' },
          ].map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-input)] border border-themed hover:border-sky-500/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-${action.color}-500/10 text-${action.color}-400 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon size={18} />
              </div>
              <span className="text-xs font-medium text-body">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
