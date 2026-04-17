import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare,
  ArrowRight, Sparkles, CheckCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAppData } from '../context/AppDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const contactInfo = [
  { icon: Phone, label: 'Teléfono', value: '+1 809-555-1234', desc: 'Lun-Vie 8:00-20:00' },
  { icon: Mail, label: 'Email', value: 'contacto@mediflow.com.do', desc: 'Respuesta en 24h' },
  { icon: MapPin, label: 'Oficinas', value: 'Santo Domingo, RD', desc: 'Av. Winston Churchill 500' },
  { icon: Clock, label: 'Horario', value: 'Lun - Vie', desc: '8:00 AM - 8:00 PM' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { addContactMessage } = useAppData();
  const containerRef = useScrollReveal([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setLoading(false);
      setSent(true);
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
    }, 1000);
  };

  return (
    <div ref={containerRef} className="space-y-24">
      {/* Hero */}
      <section className="relative pt-12 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[25%] w-[500px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full" />
          <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] bg-emerald-500/6 blur-[180px] rounded-full" />
        </div>

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <MessageSquare size={14} />
            <span className="uppercase tracking-wider">Contacto</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-heading mb-5">
            Hablemos de tu <span className="text-gradient-premium">Salud</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            ¿Tienes dudas o necesitas ayuda? Nuestro equipo está listo para asistirte
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contactInfo.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`reveal-scale stagger-${i + 1} card-interactive rounded-2xl p-6 text-center`}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Icon size={20} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-heading text-sm mb-1">{c.label}</h3>
              <p className="text-sm text-body font-medium">{c.value}</p>
              <p className="text-xs text-faint mt-0.5">{c.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Contact Form */}
      <section className="reveal">
        <div className="max-w-2xl mx-auto">
          {sent ? (
            <div className="card-elevated rounded-3xl p-12 text-center gradient-border animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle size={36} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-3">¡Mensaje Enviado!</h2>
              <p className="text-muted mb-8">Te responderemos en las próximas 24 horas. Revisa tu correo.</p>
              <Link to="/" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 group">
                Volver al inicio
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <div className="card-elevated rounded-3xl p-8 md:p-10 gradient-border">
              <h2 className="text-2xl font-bold text-heading mb-2">Envíanos un mensaje</h2>
              <p className="text-muted text-sm mb-8">Completa el formulario y te contactaremos pronto</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Nombre *</label>
                    <input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-base w-full rounded-xl px-4 py-3.5 text-sm"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Correo *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="input-base w-full rounded-xl px-4 py-3.5 text-sm"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Asunto</label>
                  <input
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="input-base w-full rounded-xl px-4 py-3.5 text-sm"
                    placeholder="¿Sobre qué quieres hablar?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Mensaje *</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="input-base w-full rounded-xl px-4 py-3.5 text-sm resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar Mensaje
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
