import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Save,
  Camera, Stethoscope, GraduationCap, Award, Tag, Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function DashboardProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 809-555-0100',
    location: user?.location || 'Santo Domingo',
    birthDate: user?.birthDate || '1990-01-15',
    bio: user?.bio || '',
    specialty: user?.specialty || '',
    education: user?.education || '',
    experience: user?.experience || '',
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    showToast('Perfil actualizado correctamente', 'success');
  };

  const isDoctor = user?.role === 'doctor';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className={`flex items-center justify-between transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h2 className="text-2xl font-bold text-heading mb-1">Mi Perfil</h2>
          <p className="text-muted text-sm">{isDoctor ? 'Información profesional' : 'Información personal'}</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <Edit3 size={14} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted border border-themed hover:text-heading transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Save size={14} /> Guardar
            </button>
          </div>
        )}
      </div>

      {/* Avatar Card */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-themed flex items-center justify-center">
              <User size={32} className="text-blue-400" />
            </div>
            {editing && (
              <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-heading">{user?.name || 'Usuario'}</h3>
            <p className="text-sm text-cyan-400 font-medium">{isDoctor ? (user?.specialty || 'Especialista') : 'Paciente'}</p>
            <p className="text-xs text-muted mt-1">Miembro desde 2024</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className={`card-elevated rounded-2xl p-6 space-y-5 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Información Personal</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field icon={User} label="Nombre Completo" editing={editing}>
            {editing ? (
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.name || '—'}</span>
            )}
          </Field>

          <Field icon={Mail} label="Correo Electrónico" editing={editing}>
            {editing ? (
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.email || '—'}</span>
            )}
          </Field>

          <Field icon={Phone} label="Teléfono" editing={editing}>
            {editing ? (
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.phone}</span>
            )}
          </Field>

          <Field icon={MapPin} label="Ubicación" editing={editing}>
            {editing ? (
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.location}</span>
            )}
          </Field>

          <Field icon={Calendar} label="Fecha de Nacimiento" editing={editing}>
            {editing ? (
              <input type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.birthDate}</span>
            )}
          </Field>

          <Field icon={Shield} label="Tipo de Cuenta" editing={false}>
            <span className="text-sm text-heading capitalize">{user?.role || 'paciente'}</span>
          </Field>
        </div>
      </div>

      {/* Doctor-specific Fields */}
      {isDoctor && (
        <div className={`card-elevated rounded-2xl p-6 space-y-5 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Información Profesional</h3>

          <Field icon={Stethoscope} label="Especialidad" editing={editing}>
            {editing ? (
              <input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.specialty || '—'}</span>
            )}
          </Field>

          <Field icon={GraduationCap} label="Educación" editing={editing}>
            {editing ? (
              <textarea value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))} rows={2} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.education || '—'}</span>
            )}
          </Field>

          <Field icon={Award} label="Experiencia" editing={editing}>
            {editing ? (
              <input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className="input-base w-full rounded-lg px-3 py-2 text-sm" />
            ) : (
              <span className="text-sm text-heading">{form.experience || '—'}</span>
            )}
          </Field>

          <div>
            <label className="text-xs text-muted font-medium flex items-center gap-1.5 mb-2">
              <Tag size={12} /> Biografía
            </label>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={4}
                className="input-base w-full rounded-lg px-3 py-2 text-sm"
                placeholder="Escribe sobre tu experiencia y enfoque profesional..."
              />
            ) : (
              <p className="text-sm text-heading leading-relaxed">{form.bio || 'Sin biografía'}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, editing, children }) {
  return (
    <div>
      <label className="text-xs text-muted font-medium flex items-center gap-1.5 mb-1.5">
        <Icon size={12} /> {label}
      </label>
      {children}
    </div>
  );
}
