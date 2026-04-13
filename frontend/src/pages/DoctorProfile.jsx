import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Clock, GraduationCap, Briefcase, Calendar,
  UserCheck, Shield, Award, Phone, Video, CheckCircle, ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { doctors } from '../services/mockData';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [visible, setVisible] = useState(false);
  const doctor = doctors.find(d => d.id === Number(id));

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-card)] border border-themed flex items-center justify-center">
            <UserCheck size={32} className="text-faint" />
          </div>
          <h2 className="text-2xl font-bold text-heading mb-2">Médico no encontrado</h2>
          <p className="text-muted mb-6">El perfil que buscas no existe o fue removido</p>
          <Link to="/doctors" className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Volver a directorio
          </Link>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    toast.success(`Solicitud de contacto enviada a ${doctor.name}`);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Back */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          onClick={() => navigate(-1)}
          className="text-muted hover:text-heading text-sm font-medium transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Volver
        </button>
      </div>

      {/* Profile Header */}
      <section className={`card-elevated rounded-3xl p-8 md:p-10 gradient-border transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shadow-lg">
              <UserCheck size={48} className="text-blue-400" />
              {doctor.available && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-xl border-4 flex items-center justify-center" style={{ borderColor: 'var(--bg-primary)' }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-heading">{doctor.name}</h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Shield size={12} /> Verificado
              </span>
            </div>
            <p className="text-lg text-cyan-400 font-semibold mb-3">{doctor.specialty}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted mb-5">
              <span className="flex items-center gap-1.5">
                <Star size={15} className="text-amber-400" fill="currentColor" />
                <span className="text-heading font-semibold">{doctor.rating}</span>
                <span className="text-faint">({doctor.reviews} reseñas)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-blue-400" />
                {doctor.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={15} className="text-emerald-400" />
                {doctor.experience} de experiencia
              </span>
            </div>

            <p className="text-body leading-relaxed mb-6">{doctor.bio}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {doctor.tags?.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-themed text-muted bg-[var(--bg-input)] hover:border-blue-500/30 hover:text-heading transition-all duration-300">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/appointments/new?doctor=${doctor.id}`}
                className="btn-primary px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 group"
              >
                <Calendar size={16} />
                Agendar Cita
                <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={handleContact}
                className="card px-6 py-3.5 rounded-xl font-semibold text-heading flex items-center gap-2 transition-all hover:bg-[var(--bg-card-hover)]"
              >
                <Phone size={16} className="text-blue-400" />
                Contactar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Education */}
        <div className={`card-interactive rounded-2xl p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <GraduationCap size={20} className="text-purple-400" />
          </div>
          <h3 className="font-bold text-heading mb-1">Educación</h3>
          <p className="text-sm text-muted">{doctor.education}</p>
        </div>

        {/* Availability */}
        <div className={`card-interactive rounded-2xl p-6 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Clock size={20} className="text-emerald-400" />
          </div>
          <h3 className="font-bold text-heading mb-1">Próxima Disponibilidad</h3>
          <p className="text-sm text-muted">{doctor.nextAvailable || 'No disponible actualmente'}</p>
        </div>

        {/* Price */}
        <div className={`card-interactive rounded-2xl p-6 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
            <Award size={20} className="text-amber-400" />
          </div>
          <h3 className="font-bold text-heading mb-1">Consulta</h3>
          <p className="text-sm text-emerald-400 font-semibold">{doctor.price}</p>
        </div>
      </div>

      {/* Consultation Types */}
      <section className={`card-elevated rounded-2xl p-8 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-xl font-bold text-heading mb-6">Tipos de Consulta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-interactive rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <UserCheck size={22} className="text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-heading">Presencial</h4>
              <p className="text-xs text-muted mt-0.5">Consulta en consultorio · {doctor.location}</p>
            </div>
            <CheckCircle size={16} className="text-emerald-400 ml-auto shrink-0" />
          </div>
          <div className="card-interactive rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Video size={22} className="text-cyan-400" />
            </div>
            <div>
              <h4 className="font-semibold text-heading">Telemedicina</h4>
              <p className="text-xs text-muted mt-0.5">Consulta en línea · Videollamada</p>
            </div>
            <CheckCircle size={16} className="text-emerald-400 ml-auto shrink-0" />
          </div>
        </div>
      </section>
    </div>
  );
}
