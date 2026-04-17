import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, Stethoscope, KeyRound, CheckCircle, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // email | code | newpass | done
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError('El correo es requerido'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Correo inválido'); return; }

    setLoading(true);
    // Generate a 6-digit code
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setTimeout(() => {
      setLoading(false);
      setGeneratedCode(newCode);
      setStep('code');
      toast.success(`Código de verificación enviado a ${email}`);
      toast.info(`Código de prueba: ${newCode}`, 8000);
    }, 1000);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!code) { setError('Ingresa el código'); return; }
    if (code !== generatedCode) {
      setError('Código incorrecto. Intenta de nuevo.');
      return;
    }
    setError('');
    setStep('newpass');
    toast.success('Código verificado correctamente');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) { setError('La contraseña es requerida'); return; }
    if (newPassword.length < 8) { setError('Mínimo 8 caracteres'); return; }
    if (newPassword !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }

    setLoading(true);
    setTimeout(() => {
      const result = resetPassword({ email, newPassword });
      setLoading(false);
      if (!result.success) {
        toast.error(result.error);
        setError(result.error);
        return;
      }
      setStep('done');
      toast.success('¡Contraseña restablecida exitosamente!');
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-sky-600/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-purple-500/6 blur-[180px] rounded-full" />
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-sky-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-600/25 transition-transform duration-300 hover:scale-105">
            {step === 'done' ? <CheckCircle size={28} className="text-white" /> : <KeyRound size={28} className="text-white" />}
          </div>
          <h1 className="text-3xl font-bold mb-2 text-heading">
            {step === 'email' && 'Recuperar contraseña'}
            {step === 'code' && 'Verificar código'}
            {step === 'newpass' && 'Nueva contraseña'}
            {step === 'done' && '¡Listo!'}
          </h1>
          <p className="text-muted">
            {step === 'email' && 'Ingresa tu correo para restablecer tu contraseña'}
            {step === 'code' && `Ingresa el código de 6 dígitos enviado a ${email}`}
            {step === 'newpass' && 'Crea tu nueva contraseña segura'}
            {step === 'done' && 'Tu contraseña ha sido restablecida'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {['email', 'code', 'newpass', 'done'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                ['email', 'code', 'newpass', 'done'].indexOf(step) >= i
                  ? 'bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-[var(--bg-input)] text-faint border border-themed'
              }`}>
                {['email', 'code', 'newpass', 'done'].indexOf(step) > i ? <CheckCircle size={14} /> : i + 1}
              </div>
              {i < 3 && <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
                ['email', 'code', 'newpass', 'done'].indexOf(step) > i ? 'bg-sky-500' : 'bg-[var(--bg-input)]'
              }`} />}
            </div>
          ))}
        </div>

        <div className="card-elevated rounded-2xl p-8 gradient-border">
          {step === 'done' ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck size={32} className="text-emerald-400" />
              </div>
              <p className="text-body text-sm mb-2">Tu contraseña ha sido restablecida exitosamente.</p>
              <p className="text-heading font-semibold mb-6">{email}</p>
              <p className="text-muted text-xs mb-8">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Link
                to="/login"
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group"
              >
                Iniciar Sesión
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : step === 'newpass' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-body mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 pr-12 ${error ? '!border-red-500/50' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-body mb-2">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    className="input-base w-full rounded-xl px-4 py-3.5 pl-12"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
                ) : (
                  <>Restablecer Contraseña <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>
          ) : step === 'code' ? (
            <form onSubmit={handleCodeSubmit} className="space-y-5 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-body mb-2">Código de Verificación</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  className={`input-base w-full rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] ${error ? '!border-red-500/50' : ''}`}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}
              <button type="submit"
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group">
                Verificar Código
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button type="button" onClick={() => { setStep('email'); setCode(''); setError(''); }}
                className="w-full text-center text-sm text-muted hover:text-heading transition-colors">
                Reenviar código
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
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
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                ) : (
                  <>Enviar Código <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-faint mt-8">
          <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} />
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
