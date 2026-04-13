import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Sparkles } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { services } from '../services/mockData';

const benefits = [
  { title: 'Atención 24/7', desc: 'Acceso a consultas médicas en cualquier momento del día o la noche.' },
  { title: 'Médicos Certificados', desc: 'Todos nuestros profesionales están verificados y certificados.' },
  { title: 'Historial Seguro', desc: 'Tu expediente médico protegido con encriptación de nivel bancario.' },
  { title: 'Recetas Digitales', desc: 'Recibe tus recetas directamente en tu dispositivo.' },
];

export default function Services() {
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
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-600/10 blur-[180px] rounded-full" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-500/8 blur-[180px] rounded-full" />
        </div>

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4">
            <Shield size={14} />
            <span className="uppercase tracking-wider">Nuestros Servicios</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-5">
            Servicios <span className="text-gradient-premium">Inteligentes</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Soluciones médicas digitales diseñadas para brindarte la mejor experiencia en salud
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={service.title} className={`reveal-scale stagger-${i + 1}`}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="reveal">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span className="uppercase tracking-wider">Beneficios</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-5">
            ¿Por qué elegir <span className="text-gradient-premium">MediFlow</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b, i) => (
            <div key={b.title} className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-7 flex gap-5`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                <span className="text-sm font-bold text-blue-400">0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-heading mb-2">{b.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="reveal">
        <div className="card-elevated rounded-3xl p-12 md:p-16 text-center gradient-border relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/8 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/8 blur-[120px] rounded-full" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-5">
            ¿Listo para comenzar?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto mb-10">
            Crea tu cuenta gratuita y accede a todos nuestros servicios médicos digitales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group">
              Comenzar Gratis
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/doctors" className="card px-10 py-4 rounded-xl font-bold text-lg text-heading flex items-center justify-center gap-2 group">
              Ver Médicos
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
