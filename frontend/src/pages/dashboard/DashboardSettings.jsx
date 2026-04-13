import { useState, useEffect } from 'react';
import {
  Settings, Sun, Moon, Bell, BellOff, Lock, Shield,
  Globe, Trash2, LogOut, ChevronRight, Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export default function DashboardSettings() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-bold text-heading mb-1">Configuración</h2>
        <p className="text-muted text-sm">Personaliza tu experiencia en MedAgenda</p>
      </div>

      {/* Appearance */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
          <Monitor size={14} /> Apariencia
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-heading">Tema</p>
              <p className="text-xs text-muted">Selecciona el estilo visual de la aplicación</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  theme === 'light'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'text-muted border-themed hover:text-heading'
                }`}
              >
                <Sun size={14} /> Claro
              </button>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  theme === 'dark'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'text-muted border-themed hover:text-heading'
                }`}
              >
                <Moon size={14} /> Oscuro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bell size={14} /> Notificaciones
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Notificaciones Push"
            description="Recibe alertas de citas y recordatorios"
            enabled={notifications}
            onToggle={() => {
              setNotifications(!notifications);
              showToast(notifications ? 'Notificaciones desactivadas' : 'Notificaciones activadas', 'info');
            }}
          />
          <ToggleSetting
            label="Notificaciones por Email"
            description="Recibe confirmaciones y recordatorios por correo"
            enabled={emailNotifs}
            onToggle={() => {
              setEmailNotifs(!emailNotifs);
              showToast(emailNotifs ? 'Emails desactivados' : 'Emails activados', 'info');
            }}
          />
        </div>
      </div>

      {/* Language */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe size={14} /> Idioma y Región
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-heading">Idioma</p>
            <p className="text-xs text-muted">Idioma de la interfaz</p>
          </div>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="input-base rounded-xl px-4 py-2 text-sm"
          >
            <option value="es">Español (RD)</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Security */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-[400ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield size={14} /> Seguridad
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-themed hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-muted group-hover:text-blue-400 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-heading">Cambiar Contraseña</p>
                <p className="text-xs text-muted">Actualiza tu contraseña de acceso</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-faint group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`card-elevated rounded-2xl p-6 border-red-500/10 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">Zona de Peligro</h3>
        <div className="space-y-3">
          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-themed hover:border-red-500/20 hover:bg-red-500/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} className="text-muted group-hover:text-red-400 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-heading group-hover:text-red-400">Cerrar Sesión</p>
                <p className="text-xs text-muted">Salir de tu cuenta</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-faint group-hover:text-red-400 transition-colors" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all group">
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-red-400/50 group-hover:text-red-400 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-400/70 group-hover:text-red-400">Eliminar Cuenta</p>
                <p className="text-xs text-muted">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-faint group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-heading">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : 'bg-[var(--bg-input)]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
