import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const cookieTypes = [
  {
    name: 'Esenciales',
    desc: 'Necesarias para el funcionamiento básico de la plataforma. No pueden ser desactivadas.',
    required: true,
    defaultOn: true,
  },
  {
    name: 'Funcionales',
    desc: 'Permiten recordar tus preferencias como tema, idioma y configuración de la cuenta.',
    required: false,
    defaultOn: true,
  },
  {
    name: 'Analíticas',
    desc: 'Nos ayudan a entender cómo utilizas la plataforma para mejorar nuestros servicios.',
    required: false,
    defaultOn: false,
  },
  {
    name: 'Marketing',
    desc: 'Utilizadas para mostrar contenido y publicidad relevante basada en tus intereses.',
    required: false,
    defaultOn: false,
  },
];

export default function Cookies() {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState(cookieTypes.map(c => c.defaultOn));
  const toast = useToast();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleCookie = (i) => {
    if (cookieTypes[i].required) return;
    setPrefs(p => { const n = [...p]; n[i] = !n[i]; return n; });
  };

  const savePrefs = () => {
    toast.success('Preferencias de cookies guardadas correctamente');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Link to="/" className="text-muted hover:text-heading text-sm font-medium transition-colors flex items-center gap-2 group mb-8 inline-flex">
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al inicio
        </Link>
      </div>

      <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Cookie size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Política de Cookies</h1>
            <p className="text-sm text-faint">Última actualización: Febrero 2025</p>
          </div>
        </div>
        <p className="text-body leading-relaxed mt-4">
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia en MediFlow.
          Aquí puedes conocer qué tipos de cookies usamos y gestionar tus preferencias.
        </p>
      </div>

      {/* Cookie Types */}
      <div className="space-y-4">
        {cookieTypes.map((c, i) => (
          <div
            key={c.name}
            className={`card-elevated rounded-2xl p-6 flex items-start gap-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${200 + i * 80}ms` }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-heading">{c.name}</h2>
                {c.required && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    Requerida
                  </span>
                )}
              </div>
              <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
            </div>
            <button
              onClick={() => toggleCookie(i)}
              className={`shrink-0 mt-1 transition-colors duration-300 ${c.required ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={c.required}
            >
              {prefs[i] ? (
                <ToggleRight size={32} className="text-blue-400" />
              ) : (
                <ToggleLeft size={32} className="text-faint" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex justify-center gap-3">
        <button onClick={savePrefs} className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm">
          Guardar Preferencias
        </button>
        <button
          onClick={() => { setPrefs(cookieTypes.map(() => true)); toast.info('Todas las cookies activadas'); }}
          className="card px-6 py-3 rounded-xl font-semibold text-sm text-heading"
        >
          Aceptar Todas
        </button>
      </div>

      <p className="text-sm text-faint text-center pt-4">
        Para más información, consulta nuestra{' '}
        <Link to="/privacy" className="text-blue-400 hover:underline">Política de Privacidad</Link>.
      </p>
    </div>
  );
}
