import { useState } from 'react';
import {
  Pill, Search, Shield, AlertTriangle, Package, FileText,
  ChevronDown, ChevronUp, ArrowRight, Filter,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { medicines } from '../services/mockData';

const categories = ['Todas', 'Antibiótico', 'Antihipertensivo', 'Analgésico', 'Antiácido', 'Antidiabético', 'Antiinflamatorio'];

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useScrollReveal([]);

  const filtered = medicines.filter(m => {
    const matchesSearch = !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Hero */}
      <section className="relative text-center pt-8 pb-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-[25%] w-[400px] h-[400px] bg-amber-600/6 blur-[140px] rounded-full" />
          <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-sky-500/6 blur-[120px] rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
          <Pill size={14} />
          <span className="uppercase tracking-wider">Medicamentos</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-4">
          Catálogo de <span className="text-gradient-premium">Medicamentos</span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg mb-10">
          Consulta información detallada sobre medicamentos, presentaciones,
          precios y disponibilidad en farmacias asociadas.
        </p>

        {/* Hero image */}
        <div className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto mb-12 border border-themed">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&h=300&fit=crop"
            alt="Medicamentos y farmacéuticos"
            className="w-full h-[220px] md:h-[280px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60" />
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="card-elevated rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search size={20} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar medicamento por nombre o categoría..."
                className="w-full bg-transparent text-heading placeholder-[var(--text-faint)] outline-none py-3 text-base"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                selectedCategory === cat
                  ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                  : 'border-themed text-muted hover:text-heading hover:border-sky-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Medicines List */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((med, i) => {
            const isExpanded = expandedId === med.id;
            return (
              <div
                key={med.id}
                className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-6 group flex flex-col`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      med.requiresPrescription
                        ? 'bg-rose-500/10 border border-rose-500/20'
                        : 'bg-emerald-500/10 border border-emerald-500/20'
                    }`}>
                      <Pill size={20} className={med.requiresPrescription ? 'text-rose-400' : 'text-emerald-400'} />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading text-sm">{med.name}</h3>
                      <p className="text-xs text-muted">{med.genericName}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    med.stock === 'Disponible'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {med.stock}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-themed text-muted bg-[var(--bg-input)]">
                    {med.category}
                  </span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-themed text-muted bg-[var(--bg-input)]">
                    {med.presentation}
                  </span>
                  {med.requiresPrescription && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full border border-rose-500/20 text-rose-400 bg-rose-500/5 flex items-center gap-1">
                      <FileText size={8} />
                      Requiere receta
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{med.description}</p>

                {isExpanded && (
                  <div className="mb-4 space-y-2 p-3 rounded-xl bg-[var(--bg-input)] border border-themed">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Laboratorio:</span>
                      <span className="text-heading font-medium">{med.laboratory}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Dosificación:</span>
                      <span className="text-heading font-medium">{med.dosage}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-heading">{med.price}</span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : med.id)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    {isExpanded ? 'Menos info' : 'Más info'}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Pill size={48} className="mx-auto text-faint mb-4" />
            <p className="text-muted">No se encontraron medicamentos.</p>
          </div>
        )}
      </section>

      {/* Info Banner */}
      <section className="reveal">
        <div className="card-elevated rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} className="text-amber-400" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-heading mb-1">Aviso Importante</h3>
            <p className="text-sm text-muted leading-relaxed">
              La información de medicamentos es solo con fines informativos. Siempre consulta a tu
              médico antes de iniciar, modificar o suspender cualquier tratamiento. Los precios
              pueden variar según la farmacia y la disponibilidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
