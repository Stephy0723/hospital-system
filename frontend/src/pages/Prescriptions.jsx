import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Pill, User, Stethoscope, Calendar, Clock,
  Download, Send, ChevronDown, ChevronUp, Printer,
  CheckCircle, AlertCircle, Package, ArrowRight,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAppData } from '../context/AppDataContext';

const statusConfig = {
  active: { label: 'Activa', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  dispensed: { label: 'Surtida', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: Package },
  expired: { label: 'Vencida', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertCircle },
};

export default function Prescriptions() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const containerRef = useScrollReveal([]);
  const { prescriptions } = useAppData();

  const filtered = filter === 'all' ? prescriptions : prescriptions.filter(p => p.status === filter);

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Hero */}
      <section className="relative text-center pt-8 pb-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-[20%] w-[400px] h-[400px] bg-purple-600/6 blur-[140px] rounded-full" />
          <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] bg-sky-500/6 blur-[120px] rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium mb-4">
          <FileText size={14} />
          <span className="uppercase tracking-wider">Recetas Médicas</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-4">
          Mis <span className="text-gradient-premium">Recetas</span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg mb-10">
          Gestiona tus recetas médicas digitales. Descarga, comparte con tu farmacia
          o envíalas directamente para surtir tus medicamentos.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'active', label: 'Activas' },
            { value: 'dispensed', label: 'Surtidas' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs px-5 py-2.5 rounded-full border transition-all duration-300 font-medium ${
                filter === f.value
                  ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                  : 'border-themed text-muted hover:text-heading hover:border-sky-500/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Prescriptions List */}
      <section>
        <div className="space-y-6">
          {filtered.map((rx, i) => {
            const isExpanded = expandedId === rx.id;
            const status = statusConfig[rx.status] || statusConfig.active;
            const StatusIcon = status.icon;

            return (
              <div
                key={rx.id}
                className={`reveal-scale stagger-${i + 1} card rounded-2xl overflow-hidden transition-all duration-500`}
              >
                {/* Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : rx.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <FileText size={22} className="text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-heading">{rx.id}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.color} flex items-center gap-1`}>
                            <StatusIcon size={10} />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {rx.patient} ({rx.patientAge} años)
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope size={12} />
                            {rx.doctor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(rx.date).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {rx.status === 'active' && (
                        <Link
                          to="/pharmacy"
                          onClick={e => e.stopPropagation()}
                          className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Send size={12} />
                          Enviar a Farmacia
                        </Link>
                      )}
                      <button className="w-8 h-8 rounded-lg border border-themed flex items-center justify-center text-muted hover:text-heading transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-themed">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Diagnosis & Notes */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Diagnóstico</p>
                          <p className="text-sm text-heading font-medium bg-[var(--bg-input)] rounded-xl p-4 border border-themed">
                            {rx.diagnosis}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Indicaciones</p>
                          <p className="text-sm text-body bg-[var(--bg-input)] rounded-xl p-4 border border-themed leading-relaxed">
                            {rx.notes}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Clock size={14} className="text-sky-400" />
                          <span>Seguimiento: {new Date(rx.followUp).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Medications */}
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Medicamentos Recetados</p>
                        <div className="space-y-3">
                          {rx.medications.map((med, j) => (
                            <div key={j} className="card rounded-xl p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <Pill size={14} className="text-sky-400 shrink-0" />
                                <span className="text-sm font-bold text-heading">{med.name}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-muted">Dosis:</span>
                                  <p className="text-body font-medium">{med.dosage}</p>
                                </div>
                                <div>
                                  <span className="text-muted">Duración:</span>
                                  <p className="text-body font-medium">{med.duration}</p>
                                </div>
                              </div>
                              {med.notes && (
                                <p className="text-xs text-muted italic">Nota: {med.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-themed px-6 py-4 flex flex-wrap gap-3 bg-[var(--bg-input)]">
                      <button className="text-xs px-4 py-2 rounded-lg border border-themed text-muted hover:text-heading hover:border-sky-500/30 transition-all flex items-center gap-1.5">
                        <Download size={12} />
                        Descargar PDF
                      </button>
                      <button className="text-xs px-4 py-2 rounded-lg border border-themed text-muted hover:text-heading hover:border-sky-500/30 transition-all flex items-center gap-1.5">
                        <Printer size={12} />
                        Imprimir
                      </button>
                      <button className="text-xs px-4 py-2 rounded-lg border border-themed text-muted hover:text-heading hover:border-sky-500/30 transition-all flex items-center gap-1.5">
                        <Send size={12} />
                        Compartir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-faint mb-4" />
            <p className="text-muted mb-4">No tienes recetas con el filtro seleccionado.</p>
            <Link to="/appointments/new" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              Agendar Consulta
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
