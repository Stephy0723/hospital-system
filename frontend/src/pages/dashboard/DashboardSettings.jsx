import { useState, useEffect } from 'react';
import {
  Settings, Bell, Lock, Eye, EyeOff, Shield, Globe, Moon, Sun,
  Smartphone, Mail, Save, CheckCircle, Trash2, LogOut, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function DashboardSettings() {
  const { user, updateProfile, logout, resetPassword } = useAuth();
  const toast = useToast();
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointments: true,
    prescriptions: true,
    promotions: false,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error('Completa todos los campos');
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    const result = resetPassword({ email: user.email, newPassword: passwordForm.new });
    if (result.success) {
      toast.success('Contraseña actualizada correctamente');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } else {
      toast.error(result.error || 'Error al cambiar la contraseña');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      const users = JSON.parse(localStorage.getItem('medagenda-users') || '[]');
      const filtered = users.filter(u => u.id !== user.id);
      localStorage.setItem('medagenda-users', JSON.stringify(filtered));
      logout();
      toast.success('Cuenta eliminada correctamente');
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-sky-500' : 'bg-[var(--bg-input)] border border-themed'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-bold text-heading mb-1 flex items-center gap-2">
          <Settings size={22} className="text-sky-400" /> Configuración
        </h2>
        <p className="text-muted text-sm">Gestiona tu cuenta, notificaciones y seguridad</p>
      </div>

      {/* Notifications */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
          <Bell size={18} className="text-amber-400" />
          Notificaciones
        </h3>
        <div className="space-y-4">
          {[
            { key: 'email', icon: Mail, label: 'Notificaciones por correo', desc: 'Recibe actualizaciones por email' },
            { key: 'sms', icon: Smartphone, label: 'Notificaciones SMS', desc: 'Recordatorios de citas por SMS' },
            { key: 'appointments', icon: CheckCircle, label: 'Recordatorio de citas', desc: '24 horas antes de cada cita' },
            { key: 'prescriptions', icon: Shield, label: 'Alertas de recetas', desc: 'Cuando una receta está por vencer' },
            { key: 'promotions', icon: Globe, label: 'Promociones', desc: 'Ofertas y novedades de MedAgenda' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <item.icon size={16} className="text-muted" />
                <div>
                  <p className="text-sm font-medium text-heading">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={notifications[item.key]}
                onChange={val => setNotifications(prev => ({ ...prev, [item.key]: val }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-5">
          <Lock size={18} className="text-emerald-400" />
          Seguridad
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-body mb-2">Contraseña actual</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                className="input-base w-full rounded-xl px-4 py-3 pr-12 text-sm"
                placeholder="Tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-body mb-2">Nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                className="input-base w-full rounded-xl px-4 py-3 text-sm"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-body mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                className="input-base w-full rounded-xl px-4 py-3 text-sm"
                placeholder="Repetir nueva contraseña"
              />
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Save size={15} /> Cambiar Contraseña
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`card-elevated rounded-2xl p-6 border-red-500/20 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-400" />
          Zona de Peligro
        </h3>
        <p className="text-sm text-muted mb-4">
          Estas acciones son permanentes y no se pueden deshacer.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl border border-themed text-sm font-medium text-body hover:bg-[var(--bg-input)] transition-colors flex items-center gap-2"
          >
            <LogOut size={15} /> Cerrar Sesión
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <Trash2 size={15} /> Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
