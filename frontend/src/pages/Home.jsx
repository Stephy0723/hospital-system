import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, CalendarCheck, CheckCircle, ArrowRight, Sparkles, Shield,
  ChevronRight, Clock, Star, Pill, FileText, Building2,
  Video, Stethoscope, Activity, MapPin, Award,
} from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import CountUp from '../components/CountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { doctors, services, testimonials, stats, specialties } from '../services/mockData';

const specColorMap = {
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:shadow-rose-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:shadow-amber-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:shadow-cyan-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:shadow-purple-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:shadow-emerald-500/20',
  blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:shadow-sky-500/20',
};

const statIconColors = ['text-sky-400', 'text-teal-400', 'text-amber-400', 'text-purple-400'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filteredSpecialties = useMemo(() => {
    if (!searchQuery.trim()) return specialties;
    const q = searchQuery.toLowerCase();
    return specialties.filter(s => s.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors.slice(0, 3);
    const q = searchQuery.toLowerCase();
    return doctors.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  return (
    <div ref={containerRef} className="space-y-24 md:space-y-36">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative pt-8 md:pt-16 pb-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-sky-600/10 blur-[160px] rounded-full animate-pulse-slower" />
          <div className="absolute top-[5%] right-[5%] w-[400px] h-[400px] bg-teal-500/8 blur-[160px] rounded-full animate-pulse-slower" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className={`transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card text-sm text-muted mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-medium">Plataforma Médica #1 en República Dominicana</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6 text-heading">
              Atención médica
              <span className="block text-gradient-premium mt-2">de excelencia</span>
            </h1>

            <p className="text-muted max-w-lg mb-10 text-lg leading-relaxed">
              Conecta con médicos certificados, gestiona recetas digitales, encuentra farmacias
              cercanas y agenda consultas en segundos. Todo desde una sola plataforma.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="card-elevated rounded-2xl p-2 flex flex-col sm:flex-row gap-2 gradient-border max-w-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search size={20} className="text-muted shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar doctor, especialidad o síntoma..."
                  className="w-full bg-transparent text-heading placeholder-[var(--text-faint)] outline-none py-3 text-base"
                />
              </div>
              <button
                type="submit"
                className="btn-primary px-6 py-3.5 rounded-xl font-semibold text-center whitespace-nowrap flex items-center justify-center gap-2 group"
              >
                Buscar
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-5">
              {['Cardiólogo', 'Dermatólogo', 'Pediatra', 'Ginecólogo'].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="text-xs px-4 py-2 rounded-full border border-themed text-muted hover:text-heading hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Medical imagery */}
          <div className={`relative transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-themed">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=450&fit=crop&crop=faces"
                  alt="Equipo médico profesional"
                  className="w-full h-[350px] md:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60" />
              </div>

              <div className="absolute -left-4 md:-left-8 top-8 card-elevated rounded-2xl px-4 py-3 flex items-center gap-3 animate-float shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Video size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-heading">Telemedicina</p>
                  <p className="text-[10px] text-muted">Consultas 24/7</p>
                </div>
              </div>

              <div className="absolute -right-4 md:-right-6 top-1/3 card-elevated rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-delayed shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Star size={18} className="text-amber-400" fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-heading">4.9 Valoración</p>
                  <p className="text-[10px] text-muted">+50,000 pacientes</p>
                </div>
              </div>

              <div className="absolute -left-2 md:-left-6 bottom-16 card-elevated rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-slow shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center">
                  <FileText size={18} className="text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-heading">Recetas Digitales</p>
                  <p className="text-[10px] text-muted">Surtir al instante</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card rounded-2xl p-6 text-center group">
                {Icon && <Icon size={22} className={`mx-auto mb-3 ${statIconColors[i]} opacity-80 group-hover:opacity-100 transition-opacity`} />}
                <div className="text-2xl md:text-3xl font-bold text-heading mb-1">
                  <CountUp end={parseInt(stat.value.replace(/[^0-9]/g, ''), 10)} suffix={stat.value.replace(/[0-9]/g, '').replace(',', '')} />
                </div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ QUICK ACCESS ═══════════════════ */}
      <section className="reveal">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Stethoscope, label: 'Consultas', desc: 'Agenda citas', to: '/appointments/new', color: 'sky' },
            { icon: Pill, label: 'Farmacia', desc: 'Medicamentos', to: '/pharmacy', color: 'emerald' },
            { icon: FileText, label: 'Recetas', desc: 'Digitales', to: '/prescriptions', color: 'purple' },
            { icon: Activity, label: 'Medicinas', desc: 'Catálogo', to: '/medicines', color: 'amber' },
          ].map((item, i) => {
            const colorClasses = {
              sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-500/15 hover:shadow-sky-500/10',
              emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15 hover:shadow-emerald-500/10',
              purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/15 hover:shadow-purple-500/10',
              amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/15 hover:shadow-amber-500/10',
            };
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`reveal-scale stagger-${i + 1} group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClasses[item.color]}`}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <item.icon size={26} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-heading text-sm">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ SPECIALTIES ═══════════════════ */}
      <section className="reveal">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sky-400 text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span className="uppercase tracking-wider">Especialidades</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-heading">
            Explora por <span className="text-gradient-premium">Especialidad</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-lg">
            Encuentra al especialista indicado entre más de 30 áreas médicas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredSpecialties.map((spec, i) => {
            const IconComponent = spec.icon;
            const colors = specColorMap[spec.color] || specColorMap.blue;
            return (
              <Link
                key={spec.name}
                to={`/doctors?specialty=${spec.name}`}
                className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-6 text-center group`}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${colors} border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="font-semibold text-heading text-sm mb-1">{spec.name}</h3>
                <p className="text-xs text-faint">{spec.count} médicos</p>
              </Link>
            );
          })}
        </div>
        {filteredSpecialties.length === 0 && searchQuery && (
          <p className="text-center text-muted mt-8">No se encontraron especialidades para &ldquo;{searchQuery}&rdquo;</p>
        )}
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="reveal">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-teal-400 text-sm font-medium mb-4">
            <Shield size={14} />
            <span className="uppercase tracking-wider">Servicios Médicos</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-heading">
            Atención Médica <span className="text-gradient-premium">Integral</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-lg">
            Todo lo que necesitas para cuidar tu salud en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={service.title} className={`reveal-scale stagger-${i + 1}`}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="reveal">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-heading">
            Así de <span className="text-gradient-premium">Fácil</span> funciona
          </h2>
          <p className="text-muted max-w-xl mx-auto text-lg">
            En 4 simples pasos gestiona tu salud de principio a fin
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-sky-500/30 via-teal-500/50 to-emerald-500/30" />
          </div>

          {[
            { step: '01', icon: Search, title: 'Busca especialista', desc: 'Explora médicos certificados por especialidad y disponibilidad.', color: 'from-sky-500/20 to-sky-600/10' },
            { step: '02', icon: CalendarCheck, title: 'Agenda tu cita', desc: 'Selecciona fecha y hora. Presencial o telemedicina.', color: 'from-teal-500/20 to-teal-600/10' },
            { step: '03', icon: CheckCircle, title: 'Recibe atención', desc: 'Consulta profesional con diagnóstico y receta digital.', color: 'from-emerald-500/20 to-emerald-600/10' },
            { step: '04', icon: Pill, title: 'Surte tu receta', desc: 'Envía tu receta directamente a la farmacia más cercana.', color: 'from-purple-500/20 to-purple-600/10' },
          ].map((item, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1} text-center relative group`}>
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} border border-themed flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <item.icon size={26} className="text-sky-400" />
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600 to-teal-500 text-xs font-bold flex items-center justify-center shadow-lg text-white">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-heading mb-3">{item.title}</h3>
              <p className="text-sm text-muted max-w-[200px] mx-auto leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ PHARMACY PREVIEW ═══════════════════ */}
      <section className="reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop"
              alt="Farmacia moderna"
              className="w-full h-[320px] object-cover rounded-3xl border border-themed"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/80 to-transparent rounded-3xl" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="card-elevated rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-heading text-sm">Red de Farmacias</p>
                  <p className="text-xs text-muted">+200 farmacias asociadas en todo el país</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
              <Pill size={14} />
              <span className="uppercase tracking-wider">Farmacias</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-heading">
              Farmacias <span className="text-gradient-premium">Conectadas</span>
            </h2>
            <p className="text-muted mb-8 text-lg leading-relaxed">
              Surte tus recetas digitales directamente desde nuestra plataforma.
              Entrega a domicilio o recoge en la farmacia más cercana.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: FileText, text: 'Recetas digitales enviadas directamente a la farmacia' },
                { icon: MapPin, text: 'Encuentra farmacias cercanas con disponibilidad en tiempo real' },
                { icon: Clock, text: 'Entrega a domicilio en menos de 60 minutos' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-emerald-400" />
                  </div>
                  <p className="text-sm text-body">{item.text}</p>
                </div>
              ))}
            </div>
            <Link
              to="/pharmacy"
              className="btn-primary px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 group"
            >
              Explorar Farmacias
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURED DOCTORS ═══════════════════ */}
      <section className="reveal">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sky-400 text-sm font-medium mb-4">
              <Award size={14} />
              <span className="uppercase tracking-wider">Destacados</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-heading">
              Médicos {searchQuery ? 'Encontrados' : <span className="text-gradient-premium">Destacados</span>}
            </h2>
            <p className="text-muted text-lg">
              {searchQuery
                ? `${filteredDoctors.length} resultado(s) para "${searchQuery}"`
                : 'Los profesionales mejor calificados de nuestra plataforma'}
            </p>
          </div>
          <Link to="/doctors" className="group text-sky-400 hover:text-sky-300 font-medium text-sm transition-all flex items-center gap-2">
            Ver todos los médicos
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, i) => (
            <div key={doctor.id} className={`reveal-scale stagger-${i + 1}`}>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
        {filteredDoctors.length === 0 && searchQuery && (
          <p className="text-center text-muted mt-8">No se encontraron médicos para &ldquo;{searchQuery}&rdquo;</p>
        )}
      </section>

      {/* ═══════════════════ PRESCRIPTIONS PREVIEW ═══════════════════ */}
      <section className="reveal">
        <div className="card-elevated rounded-3xl p-8 md:p-12 gradient-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium mb-4">
                <FileText size={14} />
                <span className="uppercase tracking-wider">Recetas Médicas</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 text-heading">
                Recetas <span className="text-gradient-premium">100% Digitales</span>
              </h2>
              <p className="text-muted mb-8 text-lg leading-relaxed">
                Los médicos generan recetas digitales durante la consulta. Descárgalas,
                compártelas con tu farmacia favorita o súrtelas directamente desde la plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/prescriptions"
                  className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group"
                >
                  Ver mis Recetas
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/medicines"
                  className="card px-6 py-3 rounded-xl font-semibold text-heading flex items-center justify-center gap-2 group"
                >
                  Catálogo de Medicamentos
                </Link>
              </div>
            </div>

            <div className="card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                    <FileText size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading">Receta Digital</p>
                    <p className="text-[10px] text-muted">RX-2026-001</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Activa
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Paciente:</span>
                  <span className="text-heading font-medium">Andrea Ruiz</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Doctor:</span>
                  <span className="text-heading font-medium">Dra. María González</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Diagnóstico:</span>
                  <span className="text-heading font-medium text-right max-w-[200px]">Hipertensión arterial grado I</span>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent" />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">Medicamentos:</p>
                {['Losartán 50mg - 1 tab/24h', 'Aspirina 100mg - 1 tab/24h'].map((med, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Pill size={12} className="text-sky-400 shrink-0" />
                    <span className="text-body">{med}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="reveal">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-heading">
            Lo que dicen nuestros <span className="text-gradient-premium">Pacientes</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-lg">
            Miles de personas confían en MedAgenda para su atención médica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1}`}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="reveal">
        <div className="relative card-elevated rounded-3xl overflow-hidden gradient-border">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-10 md:p-16 relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-heading">
                ¿Listo para cuidar tu
                <span className="text-gradient-premium"> salud</span>?
              </h2>
              <p className="text-muted max-w-md mb-10 text-lg">
                Únete a más de 50,000 pacientes que ya confían en MedAgenda.
                Regístrate gratis y agenda tu primera consulta hoy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn-primary px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group"
                >
                  Crear Cuenta Gratis
                  <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/doctors"
                  className="card px-8 py-4 rounded-xl font-bold text-lg text-heading flex items-center justify-center gap-2 group"
                >
                  Explorar
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=500&fit=crop"
                alt="Médico profesional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-elevated)] to-transparent" />
            </div>
          </div>

          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/8 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/8 blur-[120px] rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
