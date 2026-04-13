import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope, Star, MapPin, Search, Filter, User,
  Clock, ChevronRight
} from 'lucide-react';
import { doctors, specialties } from '../../services/mockData';

export default function DashboardDoctors() {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = selectedSpecialty === 'all' || d.specialty === selectedSpecialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-bold text-heading mb-1">Directorio Médico</h2>
        <p className="text-muted text-sm">Encuentra al especialista ideal para tu consulta</p>
      </div>

      {/* Search & Filter */}
      <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base w-full rounded-xl px-4 py-3 pl-11 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              selectedSpecialty === 'all'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'text-muted border-themed hover:text-heading'
            }`}
          >
            Todos
          </button>
          {specialties.slice(0, 5).map(s => (
            <button
              key={s.name}
              onClick={() => setSelectedSpecialty(s.name)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                selectedSpecialty === s.name
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'text-muted border-themed hover:text-heading'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc, i) => (
          <div
            key={doc.id}
            className={`card-elevated rounded-2xl p-5 transition-all duration-500 hover:shadow-lg hover:border-blue-500/20 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${150 + i * 80}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shrink-0">
                <User size={22} className="text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-heading text-sm truncate group-hover:text-blue-400 transition-colors">{doc.name}</h3>
                <p className="text-xs text-cyan-400 font-medium">{doc.specialty}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                  <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{doc.rating}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{doc.location}</span>
                </div>
              </div>
              {doc.available && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Disponible
                </span>
              )}
            </div>

            <p className="text-xs text-muted line-clamp-2 mb-4">{doc.bio}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {doc.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-input)] text-muted border border-themed">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-themed">
              <div>
                <p className="text-emerald-400 font-bold text-sm">{doc.price}</p>
                <p className="text-[10px] text-faint flex items-center gap-1"><Clock size={10} />{doc.nextAvailable}</p>
              </div>
              <Link
                to={`/appointments/new?doctor=${doc.id}`}
                className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 group/btn"
              >
                Agendar
                <ChevronRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Stethoscope size={36} className="text-faint mx-auto mb-4" />
          <h3 className="text-lg font-bold text-heading mb-2">No se encontraron médicos</h3>
          <p className="text-muted text-sm">Intenta con otro término de búsqueda</p>
        </div>
      )}
    </div>
  );
}
