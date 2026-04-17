import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Stethoscope } from 'lucide-react';

const KB = [
  { keys: ['hola', 'hi', 'buenos', 'buenas', 'saludos'], reply: '¡Hola! 👋 Soy MediBot, tu asistente médico virtual. ¿En qué puedo ayudarte hoy? Puedo informarte sobre citas, servicios, farmacias o responder preguntas de salud general.' },
  { keys: ['cita', 'agendar', 'consulta', 'turno', 'reservar'], reply: 'Para agendar una cita:\n1. Ve a **Médicos** y elige tu doctor\n2. Haz clic en **Agendar Cita**\n3. Selecciona fecha, hora y tipo de consulta\n4. ¡Confirma y listo!\n\nTambién puedes ir directo desde el menú **Mis Citas** → **Nueva Cita**.' },
  { keys: ['receta', 'prescripcion', 'medicamento', 'medicina'], reply: 'Las recetas digitales las emite tu médico durante la consulta. Puedes verlas en la sección **Recetas** o en tu **Panel**. Las recetas incluyen:\n- Medicamentos y dosis\n- Instrucciones de uso\n- Validez y estado\n\nLleva tu receta digital a cualquier farmacia asociada.' },
  { keys: ['farmacia', 'drogueria', 'botica'], reply: 'Contamos con farmacias asociadas en:\n- **Santo Domingo** — Av. Winston Churchill\n- **Santiago** — Av. Juan Pablo Duarte\n- **Punta Cana** — Plaza San Juan\n\nTodas aceptan recetas digitales de MedAgenda. Consulta precios y disponibilidad en la sección **Farmacias**.' },
  { keys: ['emergencia', 'urgencia', 'urgente', 'grave'], reply: '🚨 **Si tienes una emergencia médica, llama al 911 inmediatamente.**\n\nNuestro servicio no reemplaza atención de emergencia. Para urgencias no vitales, puedes agendar una consulta prioritaria con nuestros médicos.' },
  { keys: ['precio', 'costo', 'cuanto', 'tarifa', 'valor', 'pagar'], reply: 'Los precios varían según el especialista:\n- **Consulta general:** RD$ 1,500 - 2,500\n- **Especialistas:** RD$ 2,500 - 5,000\n- **Telemedicina:** desde RD$ 1,200\n\nAceptamos efectivo, tarjetas y seguros médicos. Los precios se muestran al agendar la cita.' },
  { keys: ['horario', 'hora', 'atencion', 'cuando', 'abierto'], reply: '🕐 **Horarios de atención:**\n- Lunes a Viernes: 8:00 AM - 8:00 PM\n- Sábados: 8:00 AM - 2:00 PM\n- Domingos: Solo emergencias\n\nLa telemedicina está disponible en horarios extendidos.' },
  { keys: ['seguro', 'aseguradora', 'cobertura', 'ars'], reply: 'Trabajamos con las principales ARS:\n- Humano\n- ARS Palic\n- Senasa\n- Universal\n- Futuro\n\nVerifica tu cobertura al momento de agendar. Los copagos varían según tu plan.' },
  { keys: ['telemedicina', 'virtual', 'online', 'video', 'videollamada'], reply: '💻 **Telemedicina disponible:**\n- Consultas por videollamada\n- Desde cualquier lugar\n- Recetas digitales incluidas\n- Precio reducido vs. presencial\n\nAl agendar, selecciona **Telemedicina** como tipo de consulta.' },
  { keys: ['registro', 'registrar', 'cuenta', 'crear'], reply: 'Para crear tu cuenta:\n1. Haz clic en **Comenzar Gratis**\n2. Completa tus datos personales\n3. Verifica tu correo\n4. ¡Ya puedes agendar citas!\n\nEl registro es gratuito y toma menos de 2 minutos.' },
  { keys: ['dolor', 'duele', 'fiebre', 'tos', 'gripe', 'resfriado'], reply: '⚕️ Para síntomas como dolor, fiebre o tos, te recomiendo:\n1. **Descanso** y buena hidratación\n2. Si la fiebre supera 38.5°C, consulta a un médico\n3. Agenda una **consulta general** para evaluación\n\n⚠️ Esta información no sustituye el diagnóstico médico profesional.' },
  { keys: ['contacto', 'telefono', 'llamar', 'email', 'correo'], reply: '📞 **Contacto:**\n- Teléfono: +1 809-555-1234\n- Email: contacto@mediflow.com.do\n- Dirección: Av. Winston Churchill 500, Santo Domingo\n\nO usa el formulario en la sección **Contacto**.' },
  { keys: ['gracias', 'thank', 'genial', 'excelente', 'perfecto'], reply: '¡Con gusto! 😊 Si necesitas algo más, estoy aquí para ayudarte. Tu salud es nuestra prioridad. 💙' },
  { keys: ['doctor', 'medico', 'especialista', 'profesional'], reply: 'Contamos con especialistas en:\n- 🫀 Cardiología\n- 🧠 Neurología\n- 🦴 Traumatología\n- 👶 Pediatría\n- 🏥 Medicina General\n- Y más...\n\nVisita la sección **Médicos** para ver perfiles, calificaciones y agendar.' },
  { keys: ['covid', 'vacuna', 'pcr', 'prueba'], reply: '🦠 **COVID-19:**\n- Pruebas PCR y antígeno disponibles\n- Consulta nuestros laboratorios asociados\n- Telemedicina ideal para seguimiento\n\nSi tienes síntomas respiratorios, agenda una consulta de telemedicina primero.' },
];

const FALLBACK = 'No estoy seguro de cómo ayudarte con eso. 🤔 Puedes preguntarme sobre:\n- 📅 Citas y consultas\n- 💊 Recetas y medicamentos\n- 🏥 Farmacias\n- 💰 Precios y seguros\n- 🕐 Horarios\n- 👨‍⚕️ Doctores\n\nO escribe **"hola"** para empezar.';

function getResponse(input) {
  const lower = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) return entry.reply;
  }
  return FALLBACK;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! 👋 Soy **MediBot**, tu asistente de MedAgenda. ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getResponse(trimmed);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
            : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-500 ${
          open
            ? 'bg-[var(--bg-card)] border border-themed rotate-0 hover:bg-red-500/10'
            : 'bg-gradient-to-br from-sky-600 to-teal-500 hover:shadow-sky-500/30 hover:scale-105'
        }`}
        aria-label={open ? 'Cerrar chat' : 'Abrir asistente'}
      >
        <div className="relative w-6 h-6">
          <X size={22} className={`absolute inset-0 text-muted transition-all duration-300 ${open ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
          <MessageCircle size={22} className={`absolute inset-0 text-white transition-all duration-300 ${open ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} />
        </div>
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[var(--bg-primary)] animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-500 ${
        open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}>
        <div className="rounded-2xl border border-themed shadow-2xl overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', maxHeight: '520px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm">MediBot</h3>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                Asistente en línea
              </p>
            </div>
            <Sparkles size={16} className="text-white/50" />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '340px', minHeight: '200px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'bot' ? 'bg-sky-500/15' : 'bg-purple-500/15'
                }`}>
                  {msg.role === 'bot' ? <Bot size={14} className="text-sky-400" /> : <User size={14} className="text-purple-400" />}
                </div>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-[var(--bg-card)] border border-themed text-body rounded-tl-md'
                    : 'bg-gradient-to-r from-sky-600 to-teal-500 text-white rounded-tr-md'
                }`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-sky-400" />
                </div>
                <div className="bg-[var(--bg-card)] border border-themed px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-themed">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Escribe tu pregunta..."
                className="input-base flex-1 rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-sky-500/20 disabled:hover:shadow-none"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-faint text-center mt-2">MediBot no reemplaza el diagnóstico médico profesional</p>
          </div>
        </div>
      </div>
    </>
  );
}
