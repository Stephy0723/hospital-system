import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, UserCheck, ArrowRight } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  return (
    <div className="group card-interactive rounded-2xl p-6 h-full flex flex-col">
      {/* Avatar + Status */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10">
            <UserCheck size={24} className="text-blue-400" />
          </div>
          {doctor.available && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--bg-primary)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-heading truncate group-hover:text-blue-400 transition-colors duration-300">
            {doctor.name}
          </h3>
          <p className="text-sm text-cyan-400 font-medium">{doctor.specialty}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Star size={14} className="text-amber-400" fill="currentColor" />
            <span className="text-sm text-body">{doctor.rating}</span>
            <span className="text-xs text-faint">({doctor.reviews} reseñas)</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {doctor.tags?.map(tag => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-themed text-muted bg-[var(--bg-input)] transition-colors duration-300 hover:border-blue-500/30 hover:text-heading">
            {tag}
          </span>
        ))}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-sm mb-5">
        <span className="text-muted flex items-center gap-1.5">
          <MapPin size={14} />
          {doctor.location}
        </span>
        <span className="text-emerald-400 font-semibold">{doctor.price}</span>
      </div>

      {/* Next available */}
      {doctor.nextAvailable && (
        <div className="flex items-center gap-1.5 text-xs text-muted mb-4 bg-[var(--bg-input)] rounded-lg px-3 py-2.5 border border-themed">
          <Clock size={12} className="text-blue-400" />
          Próxima disponibilidad: <span className="text-heading font-medium">{doctor.nextAvailable}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Link
          to={`/doctors/${doctor.id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium card text-body transition-all duration-300 hover:text-heading"
        >
          Ver Perfil
        </Link>
        <Link
          to={`/appointments/new?doctor=${doctor.id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold btn-primary flex items-center justify-center gap-1 group/btn"
        >
          Agendar
          <ArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
