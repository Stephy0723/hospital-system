import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, MapPin, Phone, Clock, Star, Search, Truck,
  Shield, ArrowRight, ChevronRight, Filter, Pill,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { pharmacies } from '../services/mockData';

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDelivery, setFilterDelivery] = useState(false);
  const [filter24h, setFilter24h] = useState(false);
  const containerRef = useScrollReveal([]);

  const filtered = pharmacies.filter(p => {
    const matchesSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDelivery = !filterDelivery || p.hasDelivery;
    const matches24h = !filter24h || p.available24h;
    return matchesSearch && matchesDelivery && matches24h;
  });

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Hero */}
      <section className="relative text-center pt-8 pb-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-[20%] w-[400px] h-[400px] bg-emerald-600/8 blur-[140px] rounded-full" />
          <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] bg-teal-500/6 blur-[120px] rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
          <Building2 size={14} />
          <span className="uppercase tracking-wider">Red de Farmacias</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-4">
          Farmacias <span className="text-gradient-premium">Cercanas</span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg mb-10">
          Encuentra la farmacia más cercana, surte tus recetas digitales y recibe
          medicamentos a domicilio en minutos.
        </p>

        {/* Hero image */}
        <div className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto mb-12 border border-themed">
          <img
            src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=900&h=350&fit=crop"
            alt="Interior de farmacia moderna"
            className="w-full h-[250px] md:h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-70" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
            {[
              { icon: Shield, text: 'Farmacias Verificadas' },
              { icon: Truck, text: 'Entrega a Domicilio' },
              { icon: Pill, text: 'Recetas Digitales' },
            ].map((item, i) => (
              <div key={i} className="card-elevated rounded-xl px-4 py-2 flex items-center gap-2">
                <item.icon size={14} className="text-emerald-400" />
                <span className="text-xs font-medium text-heading">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-3xl mx-auto">
          <div className="card-elevated rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search size={20} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar farmacia por nombre o dirección..."
                className="w-full bg-transparent text-heading placeholder-[var(--text-faint)] outline-none py-3 text-base"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilterDelivery(!filterDelivery)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                filterDelivery
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-themed text-muted hover:text-heading hover:border-emerald-500/30'
              }`}
            >
              <Truck size={12} />
              Entrega a Domicilio
            </button>
            <button
              onClick={() => setFilter24h(!filter24h)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                filter24h
                  ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                  : 'border-themed text-muted hover:text-heading hover:border-sky-500/30'
              }`}
            >
              <Clock size={12} />
              24 Horas
            </button>
          </div>
        </div>
      </section>

      {/* Pharmacies Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((pharmacy, i) => (
            <div key={pharmacy.id} className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-6 group`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Building2 size={22} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading group-hover:text-emerald-400 transition-colors">{pharmacy.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={12} className="text-amber-400" fill="currentColor" />
                      <span className="text-xs text-body">{pharmacy.rating}</span>
                      <span className="text-xs text-faint">({pharmacy.reviews} reseñas)</span>
                    </div>
                  </div>
                </div>
                {pharmacy.available24h && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    24H
                  </span>
                )}
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin size={14} className="text-emerald-400 shrink-0" />
                  <span>{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Phone size={14} className="text-sky-400 shrink-0" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Clock size={14} className="text-amber-400 shrink-0" />
                  <span>{pharmacy.hours}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {pharmacy.services.map(service => (
                  <span key={service} className="text-[10px] px-2.5 py-1 rounded-full border border-themed text-muted bg-[var(--bg-input)]">
                    {service}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted flex items-center gap-1">
                  <MapPin size={12} />
                  {pharmacy.distance}
                </span>
                <button className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 group/btn">
                  Enviar Receta
                  <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 size={48} className="mx-auto text-faint mb-4" />
            <p className="text-muted">No se encontraron farmacias con los filtros seleccionados.</p>
          </div>
        )}
      </section>
    </div>
  );
}
