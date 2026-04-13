import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Stethoscope, Mail, Phone, Lock, Eye, EyeOff, Check, X, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const validateStep1 = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'El nombre es requerido';
    else if (formData.fullName.trim().length < 3) e.fullName = 'Mínimo 3 caracteres';
    if (!formData.email) e.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Correo inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!formData.password) e.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.terms) e.terms = 'Debes aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const strengthColors = ['', 'text-red-400', 'text-amber-400', 'text-blue-400', 'text-emerald-400'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!validateStep1()) {
        toast.error('Por favor completa los campos correctamente');
        return;
      }
      setStep(2);
      toast.info('Ahora configura tu contraseña');
      return;
    }
    if (!validateStep2()) {
      toast.error('Por favor corrige los errores');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('¡Cuenta creada exitosamente! Bienvenido a MediFlow');
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 2000);
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-emerald-500/6 blur-[180px] rounded-full" />
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 transition-transform duration-300 hover:scale-105">
            <Stethoscope size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-heading">Crea tu cuenta</h1>
          <p className="text-muted">Empieza a cuidar tu salud con MediFlow</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                step >= s
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-100'
                  : 'bg-[var(--bg-input)] text-faint border border-themed scale-90'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-xs font-medium transition-colors duration-300 ${step >= s ? 'text-heading' : 'text-faint'}`}>
                {s === 1 ? 'Datos personales' : 'Seguridad'}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card-elevated rounded-2xl p-8 gradient-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <div className="space-y-5 animate-fade-in-up">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-body mb-3">Soy</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'patient', icon: User, label: 'Paciente' },
                      { value: 'doctor', icon: Stethoscope, label: 'Médico' },
                    ].map(role => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.value })}
                        className={`card-interactive rounded-xl py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                          formData.role === role.value
                            ? '!border-blue-500/50 !bg-blue-500/10 text-heading shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        <role.icon size={16} className={formData.role === role.value ? 'text-blue-400' : ''} /> {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Nombre completo</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => { setFormData({ ...formData, fullName: e.target.value }); setErrors({ ...errors, fullName: '' }); }}
                      className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 ${errors.fullName ? '!border-red-500/50' : ''}`}
                      placeholder="Juan Pérez García"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Correo electrónico</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                      className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 ${errors.email ? '!border-red-500/50' : ''}`}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Teléfono <span className="text-faint">(opcional)</span></label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="input-base w-full rounded-xl px-4 py-3.5 pl-12"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in-up">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                      className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 pr-12 ${errors.password ? '!border-red-500/50' : ''}`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
                  {/* Strength */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                            strength >= i
                              ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-blue-500' : 'bg-emerald-500'
                              : 'bg-[var(--bg-input)]'
                          }`} />
                        ))}
                      </div>
                      <p className={`text-xs ${strengthColors[strength]}`}>
                        <Shield size={10} className="inline mr-1" />
                        {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={e => { setFormData({ ...formData, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                      className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 pr-12 ${errors.confirmPassword ? '!border-red-500/50' : ''}`}
                      placeholder="Repite tu contraseña"
                    />
                    {formData.confirmPassword && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {formData.password === formData.confirmPassword
                          ? <Check size={16} className="text-emerald-400" />
                          : <X size={16} className="text-red-400" />
                        }
                      </span>
                    )}
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms}
                    onChange={e => { setFormData({ ...formData, terms: e.target.checked }); setErrors({ ...errors, terms: '' }); }}
                    className="accent-blue-500 mt-1 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-muted leading-relaxed">
                    Acepto los <Link to="/terms" className="text-blue-400 hover:underline">Términos de Servicio</Link> y la{' '}
                    <Link to="/privacy" className="text-blue-400 hover:underline">Política de Privacidad</Link>
                  </label>
                </div>
                {errors.terms && <p className="text-red-400 text-xs ml-1">{errors.terms}</p>}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrors({}); }}
                  className="flex-1 py-3.5 rounded-xl font-semibold card text-heading transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[var(--bg-card-hover)]"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </>
                ) : step < 2 ? (
                  <>
                    Continuar
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-faint mt-8">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
