import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Shield, Users, Award, Target, Lightbulb, ArrowRight,
  Sparkles, CheckCircle, Building2, Globe
} from 'lucide-react';
import CountUp from '../components/CountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';

const values = [
  { icon: Heart, title: 'Empatía', desc: 'Cada paciente es único y merece atención personalizada y humana.', color: 'rose' },
  { icon: Shield, title: 'Confianza', desc: 'Transparencia total en cada proceso médico y administrativo.', color: 'blue' },
  { icon: Lightbulb, title: 'Innovación', desc: 'Tecnología de vanguardia al servicio de la salud.', color: 'amber' },
  { icon: Target, title: 'Excelencia', desc: 'Estándares de calidad que superan las expectativas.', color: 'emerald' },
];

const colorMap = {
  rose: 'text-rose-400 bg-rose-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
};

const team = [
  { name: 'Dr. Alejandro Vega', role: 'Director Médico', exp: '25 años' },
  { name: 'Ing. Carolina Muñoz', role: 'CTO & Co-fundadora', exp: '15 años' },
  { name: 'Lic. Roberto Sánchez', role: 'Director de Operaciones', exp: '18 años' },
  { name: 'Dra. Patricia Luna', role: 'Jefa de Calidad Médica', exp: '20 años' },
];

const milestones = [
  { year: '2022', title: 'Fundación', desc: 'MediFlow nace con la misión de democratizar el acceso a salud de calidad.' },
  { year: '2023', title: 'Expansión', desc: 'Alcanzamos 1,000 médicos y 25,000 consultas realizadas.' },
  { year: '2024', title: 'Telemedicina', desc: 'Lanzamiento de consultas en línea y recetas digitales.' },
  { year: '2025', title: 'Presente', desc: 'Más de 2,500 médicos y 50,000 consultas completadas.' },
];

export default function About() {
  const [visible, setVisible] = useState(false);
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="space-y-32">
      {/* Hero */}
      <section className="relative pt-12 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[180px] rounded-full" />
          <div className="absolute bottom-[0%] left-[10%] w-[400px] h-[400px] bg-blue-500/8 blur-[180px] rounded-full" />
        </div>

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium mb-4">
            <Users size={14} />
            <span className="uppercase tracking-wider">Nosotros</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-5">
            Transformando la <span className="text-gradient-premium">Salud Digital</span>
          </h1>
          <p className="text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            Somos una plataforma mexicana de tecnología médica comprometida con conectar
            pacientes y médicos de manera inteligente, segura y accesible.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className={`reveal grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6`}>
        {[
          { value: 2500, suffix: '+', label: 'Médicos', icon: Users },
          { value: 50000, suffix: '+', label: 'Consultas', icon: CheckCircle },
          { value: 15, suffix: '+', label: 'Ciudades', icon: Globe },
          { value: 98, suffix: '%', label: 'Satisfacción', icon: Award },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`reveal-scale stagger-${i + 1} card rounded-2xl p-6 text-center group`}>
              <Icon size={22} className="mx-auto mb-3 text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl md:text-3xl font-bold text-heading mb-1">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* Mission */}
      <section className="reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
              <Sparkles size={14} />
              <span className="uppercase tracking-wider">Nuestra Misión</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-6">
              Acceso universal a salud de <span className="text-gradient-premium">calidad</span>
            </h2>
            <p className="text-body leading-relaxed mb-4">
              Creemos que toda persona merece acceder a atención médica de primer nivel sin importar
              su ubicación. MediFlow elimina las barreras entre pacientes y profesionales de la salud.
            </p>
            <p className="text-muted leading-relaxed">
              Nuestra tecnología conecta a miles de personas con médicos certificados, ofreciendo
              consultas presenciales y telemedicina con la más alta calidad.
            </p>
          </div>
          <div className="card-elevated rounded-3xl p-10 gradient-border relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-30">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full" />
            </div>
            <Building2 size={40} className="text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-heading mb-3">MediFlow Platform</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Plataforma integral que combina inteligencia artificial, telemedicina
              y gestión médica en una sola solución.
            </p>
            <div className="space-y-3">
              {['Consultas presenciales y en línea', 'Recetas digitales verificadas', 'Historial clínico seguro', 'Disponible 24/7'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="reveal">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-5">
            Nuestros <span className="text-gradient-premium">Valores</span>
          </h2>
          <div className="glow-line max-w-xs mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-7 text-center`}>
                <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl ${colorMap[v.color]} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="reveal">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-5">
            Nuestra <span className="text-gradient-premium">Historia</span>
          </h2>
        </div>
        <div className="relative max-w-3xl mx-auto">
          {/* Line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-transparent" />

          {milestones.map((m, i) => (
            <div key={m.year} className={`reveal-scale stagger-${i + 1} relative flex items-start gap-6 md:gap-12 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <div className="card-interactive rounded-2xl p-6 inline-block">
                  <span className="text-sm font-bold text-gradient-premium">{m.year}</span>
                  <h4 className="font-bold text-heading mt-1">{m.title}</h4>
                  <p className="text-sm text-muted mt-1">{m.desc}</p>
                </div>
              </div>
              {/* Dot */}
              <div className="relative z-10 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-4 shrink-0 mt-2" style={{ borderColor: 'var(--bg-primary)' }} />
              {/* Mobile card */}
              <div className="md:hidden flex-1">
                <span className="text-sm font-bold text-gradient-premium">{m.year}</span>
                <h4 className="font-bold text-heading mt-1">{m.title}</h4>
                <p className="text-sm text-muted mt-1">{m.desc}</p>
              </div>
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="reveal">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-5">
            Nuestro <span className="text-gradient-premium">Equipo</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Líderes en medicina y tecnología unidos por una misión
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <div key={t.name} className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-6 text-center`}>
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-themed flex items-center justify-center">
                <Users size={28} className="text-blue-400" />
              </div>
              <h4 className="font-bold text-heading mb-0.5">{t.name}</h4>
              <p className="text-sm text-cyan-400 font-medium mb-1">{t.role}</p>
              <p className="text-xs text-faint">{t.exp} de experiencia</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="reveal">
        <div className="card-elevated rounded-3xl p-12 md:p-16 text-center gradient-border relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/8 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/8 blur-[120px] rounded-full" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-5">
            Únete a la revolución en <span className="text-gradient-premium">salud digital</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto mb-10">
            Forma parte de la comunidad MediFlow y transforma tu experiencia médica
          </p>
          <Link to="/register" className="btn-primary px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 group">
            Crear Cuenta Gratis
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
