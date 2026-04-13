import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const posts = [
  {
    id: 1,
    title: '10 Hábitos para una Vida Saludable',
    excerpt: 'Descubre los hábitos diarios que pueden transformar tu bienestar físico y mental según expertos en medicina preventiva.',
    category: 'Bienestar',
    readTime: '5 min',
    date: '28 Feb 2025',
    color: 'emerald',
  },
  {
    id: 2,
    title: 'La Revolución de la Telemedicina',
    excerpt: '¿Cómo la tecnología está cambiando la forma en que accedemos a consultas médicas? Un análisis completo del panorama actual.',
    category: 'Tecnología',
    readTime: '7 min',
    date: '25 Feb 2025',
    color: 'blue',
  },
  {
    id: 3,
    title: 'Salud Mental: Señales de Alerta',
    excerpt: 'Aprende a identificar las señales tempranas de problemas de salud mental y cuándo buscar ayuda profesional.',
    category: 'Salud Mental',
    readTime: '6 min',
    date: '20 Feb 2025',
    color: 'purple',
  },
  {
    id: 4,
    title: 'Nutrición Basada en Evidencia',
    excerpt: 'Mitos y verdades sobre dietas populares. Lo que realmente dice la ciencia sobre alimentación saludable.',
    category: 'Nutrición',
    readTime: '8 min',
    date: '15 Feb 2025',
    color: 'amber',
  },
  {
    id: 5,
    title: 'Check-up Anual: ¿Es Necesario?',
    excerpt: 'La importancia de los exámenes de rutina y qué estudios deberías realizarte según tu edad y factores de riesgo.',
    category: 'Prevención',
    readTime: '4 min',
    date: '10 Feb 2025',
    color: 'cyan',
  },
  {
    id: 6,
    title: 'Recetas Digitales: El Futuro',
    excerpt: 'Cómo las recetas electrónicas están mejorando la seguridad del paciente y agilizando los procesos farmacéuticos.',
    category: 'Tecnología',
    readTime: '5 min',
    date: '5 Feb 2025',
    color: 'rose',
  },
];

const categoryColors = {
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function Blog() {
  const [visible, setVisible] = useState(false);
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="space-y-16">
      {/* Hero */}
      <section className="relative pt-12 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] bg-amber-500/8 blur-[180px] rounded-full" />
          <div className="absolute bottom-[0%] left-[20%] w-[400px] h-[400px] bg-blue-600/8 blur-[180px] rounded-full" />
        </div>

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
            <BookOpen size={14} />
            <span className="uppercase tracking-wider">Blog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-5">
            Salud & <span className="text-gradient-premium">Bienestar</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Artículos, guías y consejos de nuestros expertos para cuidar tu salud
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <article
              key={post.id}
              className={`reveal-scale stagger-${Math.min(i + 1, 6)} group card-interactive rounded-2xl overflow-hidden flex flex-col`}
            >
              {/* Gradient Top Bar */}
              <div className={`h-1 bg-gradient-to-r ${
                post.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                post.color === 'emerald' ? 'from-emerald-500 to-teal-500' :
                post.color === 'purple' ? 'from-purple-500 to-violet-500' :
                post.color === 'amber' ? 'from-amber-500 to-orange-500' :
                post.color === 'cyan' ? 'from-cyan-500 to-blue-500' :
                'from-rose-500 to-pink-500'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.color]}`}>
                    <Tag size={10} />
                    {post.category}
                  </span>
                  <span className="text-xs text-faint flex items-center gap-1">
                    <Clock size={10} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-heading mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed flex-1">{post.excerpt}</p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-themed">
                  <span className="text-xs text-faint">{post.date}</span>
                  <span className="text-sm text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Leer más <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="reveal">
        <div className="card-elevated rounded-3xl p-10 md:p-14 text-center gradient-border relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/8 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/8 blur-[100px] rounded-full" />
          </div>
          <Sparkles size={28} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-2xl md:text-4xl font-bold text-heading mb-4">
            Suscríbete al Newsletter
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8">
            Recibe los mejores artículos de salud directo en tu correo cada semana
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="input-base flex-1 rounded-xl px-4 py-3 text-sm"
            />
            <button className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-1">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
