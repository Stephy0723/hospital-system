import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Stethoscope, Mail, Phone, Lock, Eye, EyeOff, Check, X,
  ArrowLeft, ArrowRight, Shield, MapPin, Briefcase, Heart,
  AlertTriangle, FileText, Calendar, Building2, ClipboardList,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const SPECIALTIES = [
  'Cardiología', 'Dermatología', 'Pediatría', 'Neurología',
  'Ginecología', 'Traumatología', 'Oftalmología', 'Psiquiatría',
  'Medicina General', 'Cirugía General', 'Endocrinología',
  'Gastroenterología', 'Urología', 'Otorrinolaringología',
];

const LOCATIONS = [
  'Santo Domingo', 'Santiago de los Caballeros', 'Punta Cana',
  'La Romana', 'San Pedro de Macorís', 'Puerto Plata',
  'San Francisco de Macorís', 'La Vega',
];

const HOSPITALS = [
  'Hospital General de la Plaza de la Salud',
  'Centro Médico UCE',
  'Clínica Abreu',
  'Hospital Metropolitano de Santiago (HOMS)',
  'Centro de Medicina Avanzada (CEDIMAT)',
  'Hospital Pediátrico Hugo Mendoza',
  'Clínica Unión Médica del Norte',
  'Centro Médico Punta Cana',
  'Consultorio privado',
  'Otro',
];

const CONDITIONS = [
  'Diabetes', 'Hipertensión', 'Asma', 'Artritis',
  'Problemas cardíacos', 'Tiroides', 'Colesterol alto',
  'Alergias graves', 'Epilepsia', 'Depresión / Ansiedad',
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const InputField = ({ label, icon: Icon, error, required, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-body mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children || (
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />}
        <input
          {...props}
          className={`input-base w-full rounded-xl px-4 py-3 ${Icon ? 'pl-12' : ''} text-sm ${error ? '!border-red-500/50' : ''}`}
        />
      </div>
    )}
    {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}
  </div>
);

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    terms: false,
    // Patient fields
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    conditions: [],
    allergies: '',
    currentMeds: '',
    emergencyContact: '',
    emergencyPhone: '',
    // Doctor fields
    specialty: '',
    secondarySpecialty: '',
    licenseNumber: '',
    location: '',
    hospital: '',
    yearsExperience: '',
    consultationPrice: '',
    bio: '',
    availableDays: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: personal, 2: role-specific, 3: security
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const set = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  // --- Validations ---
  const validateStep1 = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'El nombre es requerido';
    else if (formData.fullName.trim().length < 3) e.fullName = 'Mínimo 3 caracteres';
    if (!formData.email.trim()) e.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Correo electrónico inválido';
    if (formData.phone && !/^[\d\s\-+()]{7,20}$/.test(formData.phone)) e.phone = 'Número de teléfono inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2Patient = () => {
    const e = {};
    if (!formData.dateOfBirth) e.dateOfBirth = 'La fecha de nacimiento es requerida';
    if (!formData.gender) e.gender = 'Selecciona tu género';
    if (!formData.emergencyContact.trim()) e.emergencyContact = 'El contacto de emergencia es requerido';
    if (!formData.emergencyPhone.trim()) e.emergencyPhone = 'El teléfono de emergencia es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2Doctor = () => {
    const e = {};
    if (!formData.specialty) e.specialty = 'La especialidad es requerida';
    if (!formData.licenseNumber.trim()) e.licenseNumber = 'El número de licencia/exequátur es requerido';
    if (!formData.location) e.location = 'La ubicación es requerida';
    if (!formData.hospital) e.hospital = 'Selecciona dónde operas';
    if (!formData.yearsExperience) e.yearsExperience = 'Los años de experiencia son requeridos';
    if (!formData.consultationPrice) e.consultationPrice = 'El precio de consulta es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!formData.password) e.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) e.password = 'Mínimo 8 caracteres';
    else if (!/[A-Z]/.test(formData.password)) e.password = 'Incluye al menos una mayúscula';
    else if (!/\d/.test(formData.password)) e.password = 'Incluye al menos un número';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.terms) e.terms = 'Debes aceptar los términos y condiciones';
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
  const strengthColors = ['', 'text-red-400', 'text-amber-400', 'text-sky-400', 'text-emerald-400'];
  const strength = getPasswordStrength();

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) { toast.error('Completa los campos correctamente'); return; }
      setStep(2);
    } else if (step === 2) {
      const valid = formData.role === 'patient' ? validateStep2Patient() : validateStep2Doctor();
      if (!valid) { toast.error('Completa los campos requeridos'); return; }
      setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) { handleNext(); return; }
    if (!validateStep3()) { toast.error('Corrige los errores de seguridad'); return; }

    setLoading(true);
    setTimeout(() => {
      const extra = formData.role === 'patient'
        ? {
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            bloodType: formData.bloodType,
            conditions: formData.conditions,
            allergies: formData.allergies,
            currentMeds: formData.currentMeds,
            emergencyContact: formData.emergencyContact,
            emergencyPhone: formData.emergencyPhone,
          }
        : {
            specialty: formData.specialty,
            secondarySpecialty: formData.secondarySpecialty,
            licenseNumber: formData.licenseNumber,
            location: formData.location,
            hospital: formData.hospital,
            yearsExperience: formData.yearsExperience,
            consultationPrice: formData.consultationPrice,
            bio: formData.bio,
            availableDays: formData.availableDays,
          };

      const result = register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        ...extra,
      });

      setLoading(false);
      if (!result.success) {
        toast.error(result.error);
        if (result.error.includes('correo')) {
          setStep(1);
          setErrors({ email: result.error });
        }
        return;
      }
      toast.success(`¡Bienvenido a MedAgenda, ${result.user.fullName}!`);
      setTimeout(() => navigate('/dashboard'), 800);
    }, 1000);
  };

  const stepLabels = ['Datos personales', formData.role === 'patient' ? 'Historial médico' : 'Perfil profesional', 'Seguridad'];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-sky-600/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-teal-500/6 blur-[180px] rounded-full" />
      </div>

      <div className={`w-full max-w-lg transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-sky-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-600/25 transition-transform duration-300 hover:scale-105">
            <Stethoscope size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-heading">Crea tu cuenta</h1>
          <p className="text-muted">Empieza a cuidar tu salud con MedAgenda</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { if (s < step) setStep(s); }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  step >= s
                    ? 'bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/25 cursor-pointer'
                    : 'bg-[var(--bg-input)] text-faint border border-themed cursor-default'
                }`}
              >
                {step > s ? <Check size={14} /> : s}
              </button>
              {i < 2 && (
                <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step > s ? 'bg-sky-500' : 'bg-[var(--bg-input)]'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted mb-6 font-medium">{stepLabels[step - 1]}</p>

        {/* Form Card */}
        <div className="card-elevated rounded-2xl p-7 md:p-8 gradient-border">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ========== STEP 1: Personal Info ========== */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-body mb-3">Soy</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'patient', icon: User, label: 'Paciente', desc: 'Busco atención médica' },
                      { value: 'doctor', icon: Stethoscope, label: 'Médico', desc: 'Ofrezco consultas' },
                    ].map(role => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => set('role', role.value)}
                        className={`card-interactive rounded-xl py-4 px-3 text-sm font-medium flex flex-col items-center gap-2 transition-all duration-300 ${
                          formData.role === role.value
                            ? '!border-sky-500/50 !bg-sky-500/10 text-heading shadow-sm ring-1 ring-sky-500/20'
                            : 'text-muted'
                        }`}
                      >
                        <role.icon size={22} className={formData.role === role.value ? 'text-sky-400' : 'text-muted'} />
                        <span className="font-semibold">{role.label}</span>
                        <span className="text-xs text-faint">{role.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <InputField label="Nombre completo" icon={User} error={errors.fullName} required
                  type="text" value={formData.fullName} onChange={e => set('fullName', e.target.value)}
                  placeholder="Juan Pérez García"
                />

                <InputField label="Correo electrónico" icon={Mail} error={errors.email} required
                  type="email" value={formData.email} onChange={e => set('email', e.target.value)}
                  placeholder="correo@ejemplo.com" autoComplete="email"
                />

                <InputField label="Teléfono" icon={Phone} error={errors.phone}
                  type="tel" value={formData.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+1 809-555-1234"
                />
              </div>
            )}

            {/* ========== STEP 2: Patient Medical History ========== */}
            {step === 2 && formData.role === 'patient' && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-1 p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                  <Heart size={16} className="text-sky-400 shrink-0" />
                  <p className="text-xs text-muted">Esta información ayuda a tu médico a brindarte mejor atención. Es confidencial.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Fecha de nacimiento" icon={Calendar} error={errors.dateOfBirth} required
                    type="date" value={formData.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Género <span className="text-red-400">*</span></label>
                    <select
                      value={formData.gender}
                      onChange={e => set('gender', e.target.value)}
                      className={`input-base w-full rounded-xl px-4 py-3 text-sm ${errors.gender ? '!border-red-500/50' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.gender && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.gender}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-body mb-2">Tipo de sangre</label>
                  <div className="flex flex-wrap gap-2">
                    {BLOOD_TYPES.map(bt => (
                      <button
                        key={bt} type="button" onClick={() => set('bloodType', formData.bloodType === bt ? '' : bt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                          formData.bloodType === bt
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'border-themed text-muted hover:text-heading hover:bg-[var(--bg-card)]'
                        }`}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    <AlertTriangle size={14} className="inline mr-1.5 text-amber-400" />
                    ¿Sufres de alguna condición? <span className="text-faint">(selecciona todas las que apliquen)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CONDITIONS.map(cond => (
                      <button
                        key={cond} type="button" onClick={() => toggleArrayItem('conditions', cond)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all duration-200 ${
                          formData.conditions.includes(cond)
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'border-themed text-muted hover:text-heading hover:bg-[var(--bg-card)]'
                        }`}
                      >
                        {formData.conditions.includes(cond) && <Check size={12} className="inline mr-1" />}
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <InputField label="Alergias conocidas" error={errors.allergies}
                  type="text" value={formData.allergies} onChange={e => set('allergies', e.target.value)}
                  placeholder="Ej: Penicilina, mariscos, polen..."
                />

                <InputField label="Medicamentos actuales" error={errors.currentMeds}
                  type="text" value={formData.currentMeds} onChange={e => set('currentMeds', e.target.value)}
                  placeholder="Ej: Metformina 500mg, Losartán 50mg..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Contacto de emergencia" icon={User} error={errors.emergencyContact} required
                    type="text" value={formData.emergencyContact} onChange={e => set('emergencyContact', e.target.value)}
                    placeholder="Nombre del contacto"
                  />
                  <InputField label="Tel. emergencia" icon={Phone} error={errors.emergencyPhone} required
                    type="tel" value={formData.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)}
                    placeholder="+1 809-555-0000"
                  />
                </div>
              </div>
            )}

            {/* ========== STEP 2: Doctor Professional Profile ========== */}
            {step === 2 && formData.role === 'doctor' && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-1 p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                  <Briefcase size={16} className="text-sky-400 shrink-0" />
                  <p className="text-xs text-muted">Completa tu perfil profesional para que los pacientes puedan encontrarte.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Especialidad principal <span className="text-red-400">*</span></label>
                    <select
                      value={formData.specialty}
                      onChange={e => set('specialty', e.target.value)}
                      className={`input-base w-full rounded-xl px-4 py-3 text-sm ${errors.specialty ? '!border-red-500/50' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.specialty && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.specialty}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Especialidad secundaria</label>
                    <select
                      value={formData.secondarySpecialty}
                      onChange={e => set('secondarySpecialty', e.target.value)}
                      className="input-base w-full rounded-xl px-4 py-3 text-sm"
                    >
                      <option value="">Ninguna</option>
                      {SPECIALTIES.filter(s => s !== formData.specialty).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <InputField label="No. de Exequátur / Licencia" icon={FileText} error={errors.licenseNumber} required
                  type="text" value={formData.licenseNumber} onChange={e => set('licenseNumber', e.target.value)}
                  placeholder="Ej: 12345-MSP"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Ciudad donde operas <span className="text-red-400">*</span></label>
                    <select
                      value={formData.location}
                      onChange={e => set('location', e.target.value)}
                      className={`input-base w-full rounded-xl px-4 py-3 text-sm ${errors.location ? '!border-red-500/50' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors.location && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">Centro médico <span className="text-red-400">*</span></label>
                    <select
                      value={formData.hospital}
                      onChange={e => set('hospital', e.target.value)}
                      className={`input-base w-full rounded-xl px-4 py-3 text-sm ${errors.hospital ? '!border-red-500/50' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    {errors.hospital && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.hospital}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Años de experiencia" error={errors.yearsExperience} required
                    type="number" min="0" max="60" value={formData.yearsExperience}
                    onChange={e => set('yearsExperience', e.target.value)}
                    placeholder="Ej: 10"
                  />
                  <InputField label="Precio consulta (RD$)" error={errors.consultationPrice} required
                    type="number" min="0" value={formData.consultationPrice}
                    onChange={e => set('consultationPrice', e.target.value)}
                    placeholder="Ej: 2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-body mb-2">Días disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => (
                      <button
                        key={d} type="button" onClick={() => toggleArrayItem('availableDays', d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                          formData.availableDays.includes(d)
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : 'border-themed text-muted hover:text-heading hover:bg-[var(--bg-card)]'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-body mb-2">Biografía profesional</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => set('bio', e.target.value)}
                    className="input-base w-full rounded-xl px-4 py-3 text-sm h-20 resize-none"
                    placeholder="Breve descripción de tu experiencia, formación y enfoque médico..."
                    maxLength={500}
                  />
                  <p className="text-xs text-faint mt-1 text-right">{formData.bio.length}/500</p>
                </div>
              </div>
            )}

            {/* ========== STEP 3: Security ========== */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-1 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <Shield size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-xs text-muted">Crea una contraseña segura para proteger tu cuenta.</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Contraseña <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => set('password', e.target.value)}
                      className={`input-base w-full rounded-xl px-4 py-3 pl-12 pr-12 text-sm ${errors.password ? '!border-red-500/50' : ''}`}
                      placeholder="Ingresa tu contraseña"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>}

                  {/* Password Requirements Checklist */}
                  <div className="mt-3 p-3 rounded-xl bg-[var(--bg-card)] border border-themed space-y-1.5">
                    <p className="text-xs font-semibold text-muted mb-2">Tu contraseña debe tener:</p>
                    {[
                      { ok: formData.password.length >= 8, text: 'Mínimo 8 caracteres' },
                      { ok: /[A-Z]/.test(formData.password), text: 'Al menos una letra mayúscula (A-Z)' },
                      { ok: /[a-z]/.test(formData.password), text: 'Al menos una letra minúscula (a-z)' },
                      { ok: /\d/.test(formData.password), text: 'Al menos un número (0-9)' },
                      { ok: /[^a-zA-Z0-9]/.test(formData.password), text: 'Un carácter especial (!@#$...) — opcional pero recomendado' },
                    ].map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                        !formData.password ? 'text-faint' : req.ok ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {!formData.password ? (
                          <span className="w-3.5 h-3.5 rounded-full border border-themed inline-flex shrink-0" />
                        ) : req.ok ? (
                          <Check size={14} className="shrink-0" />
                        ) : (
                          <X size={14} className="shrink-0" />
                        )}
                        {req.text}
                      </div>
                    ))}
                  </div>

                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                            strength >= i
                              ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-sky-500' : 'bg-emerald-500'
                              : 'bg-[var(--bg-input)]'
                          }`} />
                        ))}
                      </div>
                      <p className={`text-xs ${strengthColors[strength]}`}>
                        <Shield size={10} className="inline mr-1" />
                        Seguridad: {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Confirmar contraseña <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={e => set('confirmPassword', e.target.value)}
                      className={`input-base w-full rounded-xl px-4 py-3 pl-12 pr-12 text-sm ${errors.confirmPassword ? '!border-red-500/50' : ''}`}
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
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
                    type="checkbox" id="terms" checked={formData.terms}
                    onChange={e => set('terms', e.target.checked)}
                    className="accent-sky-500 mt-1 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-muted leading-relaxed">
                    Acepto los <Link to="/terms" className="text-sky-400 hover:underline">Términos de Servicio</Link> y la{' '}
                    <Link to="/privacy" className="text-sky-400 hover:underline">Política de Privacidad</Link>
                  </label>
                </div>
                {errors.terms && <p className="text-red-400 text-xs ml-1">{errors.terms}</p>}
              </div>
            )}

            {/* ========== Navigation Buttons ========== */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => { setStep(step - 1); setErrors({}); }}
                  className="flex-1 py-3 rounded-xl font-semibold card text-heading transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[var(--bg-card-hover)] border border-themed"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </>
                ) : step < 3 ? (
                  <>
                    Continuar
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                ) : (
                  <>
                    Crear Cuenta
                    <Check size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-faint mt-8">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
