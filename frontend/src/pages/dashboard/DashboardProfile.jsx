import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Heart, Shield, Calendar, MapPin,
  Droplets, AlertTriangle, Pill, Save, CheckCircle,
  Building2, Stethoscope, Award, FileText, DollarSign, Clock,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function DashboardProfile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (user) setForm({ ...user });
  }, [user]);

  const isDoctor = user?.role === 'doctor';
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    const { _pw, id, createdAt, ...updates } = form;
    updateProfile(updates);
    setEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const InfoRow = ({ icon: Icon, label, value, field }) => (
    <div className="flex items-start gap-3 py-3 border-b border-themed last:border-0">
      <Icon size={16} className="text-muted mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
        {editing && field ? (
          <input
            value={form[field] || ''}
            onChange={e => set(field, e.target.value)}
            className="input-base w-full rounded-lg px-3 py-1.5 text-sm"
          />
        ) : (
          <p className="text-sm text-heading font-medium">{value || '—'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h2 className="text-2xl font-bold text-heading mb-1">Mi Perfil</h2>
          <p className="text-muted text-sm">Información personal y médica</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
            editing
              ? 'bg-gradient-to-r from-sky-600 to-teal-500 text-white hover:opacity-90'
              : 'bg-[var(--bg-input)] border border-themed text-body hover:border-sky-500/30'
          }`}
        >
          {editing ? <><Save size={15} /> Guardar Cambios</> : <><User size={15} /> Editar Perfil</>}
        </button>
      </div>

      {/* Avatar + Basic Info */}
      <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-600/20">
              {user?.fullName?.charAt(0) || '?'}
            </div>
            {editing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Camera size={13} />
              </button>
            )}
          </div>
          <div>
            {editing ? (
              <input
                value={form.fullName || ''}
                onChange={e => set('fullName', e.target.value)}
                className="input-base rounded-lg px-3 py-1.5 text-lg font-bold mb-1"
              />
            ) : (
              <h3 className="text-xl font-bold text-heading">{user?.fullName}</h3>
            )}
            <p className="text-sm text-muted flex items-center gap-1.5">
              {isDoctor ? <Stethoscope size={13} /> : <Heart size={13} />}
              {isDoctor ? (user?.specialty || 'Médico') : 'Paciente'}
            </p>
            <p className="text-xs text-faint mt-1">Miembro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' }) : '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <InfoRow icon={Mail} label="Correo Electrónico" value={user?.email} field="email" />
          <InfoRow icon={Phone} label="Teléfono" value={user?.phone} field="phone" />
        </div>
      </div>

      {/* Role-specific info */}
      {!isDoctor ? (
        <>
          {/* Patient Medical Info */}
          <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-4">
              <Heart size={18} className="text-rose-400" />
              Información Médica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={Droplets} label="Tipo de Sangre" value={user?.bloodType} field="bloodType" />
              <InfoRow icon={Calendar} label="Fecha de Nacimiento" value={user?.dateOfBirth} field="dateOfBirth" />
              <InfoRow icon={User} label="Género" value={user?.gender} field="gender" />
              <InfoRow icon={AlertTriangle} label="Alergias" value={user?.allergies} field="allergies" />
              <InfoRow icon={Pill} label="Medicamentos Actuales" value={user?.currentMedications} field="currentMedications" />
            </div>

            {user?.conditions?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-themed">
                <p className="text-xs text-muted uppercase tracking-wider mb-3">Condiciones Médicas</p>
                <div className="flex flex-wrap gap-2">
                  {user.conditions.map(c => (
                    <span key={c} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-4">
              <Shield size={18} className="text-red-400" />
              Contacto de Emergencia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={User} label="Nombre" value={user?.emergencyContact} field="emergencyContact" />
              <InfoRow icon={Phone} label="Teléfono" value={user?.emergencyPhone} field="emergencyPhone" />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Doctor Professional Info */}
          <div className={`card-elevated rounded-2xl p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 mb-4">
              <Award size={18} className="text-amber-400" />
              Información Profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={Stethoscope} label="Especialidad Principal" value={user?.specialty} field="specialty" />
              <InfoRow icon={Stethoscope} label="Especialidad Secundaria" value={user?.secondarySpecialty} field="secondarySpecialty" />
              <InfoRow icon={FileText} label="Exequátur / Licencia" value={user?.licenseNumber} field="licenseNumber" />
              <InfoRow icon={Building2} label="Hospital / Centro" value={user?.hospital} field="hospital" />
              <InfoRow icon={MapPin} label="Ciudad" value={user?.city} field="city" />
              <InfoRow icon={Clock} label="Años de Experiencia" value={user?.yearsExperience} field="yearsExperience" />
              <InfoRow icon={DollarSign} label="Precio Consulta (RD$)" value={user?.consultationPrice} field="consultationPrice" />
            </div>

            {user?.availableDays?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-themed">
                <p className="text-xs text-muted uppercase tracking-wider mb-3">Días Disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {user.availableDays.map(d => (
                    <span key={d} className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-medium border border-sky-500/20">{d}</span>
                  ))}
                </div>
              </div>
            )}

            {user?.bio && (
              <div className="mt-4 pt-4 border-t border-themed">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Biografía</p>
                {editing ? (
                  <textarea
                    value={form.bio || ''}
                    onChange={e => set('bio', e.target.value)}
                    rows={3}
                    className="input-base w-full rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm text-body">{user.bio}</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
