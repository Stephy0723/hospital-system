import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, CalendarCheck, CheckCircle, ArrowRight, Sparkles, Shield, ChevronRight } from 'lucide-react';
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
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:shadow-blue-500/20',
};

const statIconColors = ['text-blue-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Functional search: filter specialties and doctors
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
    <div ref={containerRef} className="space-y-32 md:space-y-40">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative text-center pt-16 md:pt-24 pb-8 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-blue-600/12 blur-[180px] rounded-full animate-pulse-slower" />
          <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-cyan-500/8 blur-[180px] rounded-full animate-pulse-slower" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 blur-[150px] rounded-full" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full card text-sm text-muted mb-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-medium">+2,500 médicos disponibles ahora</span>
        </div>

        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-8 text-heading transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Tu salud merece la
          <span className="block text-gradient-premium mt-3">mejor atención</span>
        </h1>

        <p className={`text-muted max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Conecta con médicos certificados, agenda consultas en segundos
          y gestiona tu salud desde una plataforma inteligente.
        </p>

        {/* Search Bar */}
        <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <form onSubmit={handleSearch} className="card-elevated rounded-2xl p-2 flex flex-col md:flex-row gap-2 gradient-border">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search size={20} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar especialidad, doctor o síntoma..."
                className="w-full bg-transparent text-heading placeholder-[var(--text-faint)] outline-none py-3 text-base"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-center whitespace-nowrap flex items-center justify-center gap-2 group"
            >
              Buscar Médico
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Cardiólogo', 'Dermatólogo', 'Pediatra', 'Ginecólogo'].map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-xs px-4 py-2 rounded-full border border-themed text-muted hover:text-heading hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats in Hero */}
        <div className={`mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

      {/* ═══════════════════ SPECIALTIES ═══════════════════ */}
      <section className="reveal">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
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
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4">
            <Shield size={14} />
            <span className="uppercase tracking-wider">Servicios</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-heading">
            Servicios <span className="text-gradient-premium">Inteligentes</span>
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
            En 3 simples pasos estarás conectado con el mejor médico para ti
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[17%] right-[17%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-500/50 to-emerald-500/30" />
            <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[var(--bg-primary)] to-transparent" />
            <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-[var(--bg-primary)] to-transparent" />
          </div>

          {[
            { step: '01', icon: Search, title: 'Busca tu especialista', desc: 'Explora nuestro directorio de médicos certificados por especialidad, ubicación o disponibilidad.', color: 'from-blue-500/20 to-blue-600/10' },
            { step: '02', icon: CalendarCheck, title: 'Agenda tu cita', desc: 'Selecciona fecha y hora disponible. Elige entre consulta presencial o telemedicina.', color: 'from-cyan-500/20 to-cyan-600/10' },
            { step: '03', icon: CheckCircle, title: 'Recibe atención', desc: 'Asiste a tu consulta y recibe diagnóstico, recetas digitales y seguimiento continuo.', color: 'from-emerald-500/20 to-emerald-600/10' },
          ].map((item, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1} text-center relative group`}>
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} border border-themed flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <item.icon size={26} className="text-blue-400" />
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold flex items-center justify-center shadow-lg text-white">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-heading mb-3">{item.title}</h3>
              <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURED DOCTORS ═══════════════════ */}
      <section className="reveal">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
              <Sparkles size={14} />
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
          <Link to="/doctors" className="group text-blue-400 hover:text-blue-300 font-medium text-sm transition-all flex items-center gap-2">
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
        <div className="relative card-elevated rounded-3xl p-12 md:p-20 text-center overflow-hidden gradient-border">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/8 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/8 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-heading">
            ¿Listo para cuidar tu
            <span className="text-gradient-premium"> salud</span>?
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-12 text-lg">
            Únete a más de 50,000 pacientes que ya confían en MedAgenda para su atención médica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group"
            >
              Crear Cuenta Gratis
              <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/doctors"
              className="card px-10 py-4 rounded-xl font-bold text-lg text-heading flex items-center justify-center gap-2 group"
            >
              Explorar Médicos
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}