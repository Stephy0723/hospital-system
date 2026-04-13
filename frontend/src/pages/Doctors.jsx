import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Star, ChevronDown, Users, Sparkles } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { doctors, specialties } from '../services/mockData';

const locations = [...new Set(doctors.map(d => d.location))];

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Sync URL params
  useEffect(() => {
    const s = searchParams.get('search');
    const sp = searchParams.get('specialty');
    if (s) setSearch(s);
    if (sp) setSelectedSpecialty(sp);
  }, [searchParams]);

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedSpecialty) {
      result = result.filter(d => d.specialty === selectedSpecialty);
    }

    if (selectedLocation) {
      result = result.filter(d => d.location === selectedLocation);
    }

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'reviews') result.sort((a, b) => b.reviews - a.reviews);
    else if (sortBy === 'price') result.sort((a, b) => parseInt(a.price) - parseInt(b.price));

    return result;
  }, [search, selectedSpecialty, selectedLocation, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedSpecialty('');
    setSelectedLocation('');
    setSortBy('rating');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedSpecialty || selectedLocation;

  return (
    <div ref={containerRef} className="space-y-10">
      {/* Header */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/6 blur-[180px] rounded-full" />
        </div>

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span className="uppercase tracking-wider">Directorio Médico</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-4">
            Nuestros <span className="text-gradient-premium">Médicos</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Encuentra al especialista ideal entre nuestro equipo de profesionales certificados
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className={`transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="card-elevated rounded-2xl p-4 gradient-border">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-4 input-base rounded-xl">
              <Search size={18} className="text-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, especialidad o padecimiento..."
                className="w-full bg-transparent text-heading placeholder-[var(--text-faint)] outline-none py-3 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-faint hover:text-heading transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`card-interactive px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 ${showFilters ? '!border-blue-500/50 !bg-blue-500/10 text-heading' : 'text-muted'}`}
            >
              <SlidersHorizontal size={16} />
              Filtros
              <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          <div className={`overflow-hidden transition-all duration-400 ${showFilters ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-themed">
              {/* Specialty */}
              <div>
                <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wider">Especialidad</label>
                <select
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                  className="input-base w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option value="">Todas las especialidades</option>
                  {specialties.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wider">Ubicación</label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="input-base w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option value="">Todas las ubicaciones</option>
                  {locations.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wider">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input-base w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="reviews">Más reseñas</option>
                  <option value="price">Menor precio</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted flex items-center gap-1.5">
              <Users size={14} className="text-blue-400" />
              <span className="font-semibold text-heading">{filteredDoctors.length}</span> médico{filteredDoctors.length !== 1 ? 's' : ''} encontrado{filteredDoctors.length !== 1 ? 's' : ''}
            </span>
            {selectedSpecialty && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {selectedSpecialty}
                <button onClick={() => setSelectedSpecialty('')} className="hover:text-blue-300 transition-colors"><X size={12} /></button>
              </span>
            )}
            {selectedLocation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <MapPin size={10} />{selectedLocation}
                <button onClick={() => setSelectedLocation('')} className="hover:text-cyan-300 transition-colors"><X size={12} /></button>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {/* Doctors Grid */}
      <section>
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, i) => (
              <div key={doctor.id} className={`reveal-scale stagger-${Math.min(i + 1, 8)}`}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-card)] border border-themed flex items-center justify-center">
              <Search size={32} className="text-faint" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">No se encontraron médicos</h3>
            <p className="text-muted mb-6">Intenta ajustar los filtros o buscar con otros términos</p>
            <button onClick={clearFilters} className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm">
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
