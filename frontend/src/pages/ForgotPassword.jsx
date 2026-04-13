import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, Stethoscope, KeyRound, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError('El correo es requerido'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Correo inválido'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Instrucciones enviadas a tu correo');
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-blue-600/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-purple-500/6 blur-[180px] rounded-full" />
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 transition-transform duration-300 hover:scale-105">
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-heading">
            {sent ? 'Revisa tu correo' : 'Recuperar contraseña'}
          </h1>
          <p className="text-muted">
            {sent
              ? 'Te hemos enviado las instrucciones'
              : 'Ingresa tu correo para restablecer tu contraseña'}
          </p>
        </div>

        <div className="card-elevated rounded-2xl p-8 gradient-border">
          {sent ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <p className="text-body text-sm mb-2">
                Hemos enviado instrucciones a:
              </p>
              <p className="text-heading font-semibold mb-6">{email}</p>
              <p className="text-muted text-xs mb-8">
                Si no ves el correo, revisa tu carpeta de spam. El enlace expira en 30 minutos.
              </p>
              <Link
                to="/login"
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group"
              >
                Volver a Iniciar Sesión
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-body mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 ${error ? '!border-red-500/50' : ''}`}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Instrucciones
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-faint mt-8">
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} />
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
