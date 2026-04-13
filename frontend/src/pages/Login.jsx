import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, Apple, Stethoscope, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Correo inválido';
    if (!formData.password) e.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('¡Bienvenido de vuelta! Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 1200);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-600/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/6 blur-[180px] rounded-full" />
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 transition-transform duration-300 hover:scale-105">
            <Stethoscope size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-heading">Bienvenido de vuelta</h1>
          <p className="text-muted">Ingresa a tu cuenta de MediFlow</p>
        </div>

        {/* Form */}
        <div className="card-elevated rounded-2xl p-8 gradient-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-body mb-2">Correo Electrónico</label>
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

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-body">Contraseña</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  className={`input-base w-full rounded-xl px-4 py-3.5 pl-12 pr-12 ${errors.password ? '!border-red-500/50' : ''}`}
                  placeholder="••••••••"
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
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-blue-500 rounded" />
              <label htmlFor="remember" className="text-sm text-muted">Recordarme</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 glow-line" />
            <span className="text-xs text-faint font-medium tracking-wider">O CONTINÚA CON</span>
            <div className="flex-1 glow-line" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => toast.info('Inicio con Google disponible próximamente')} className="card-interactive rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 text-heading">
              <Globe size={16} className="text-blue-400" /> Google
            </button>
            <button onClick={() => toast.info('Inicio con Apple disponible próximamente')} className="card-interactive rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 text-heading">
              <Apple size={16} /> Apple
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-faint mt-8">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
