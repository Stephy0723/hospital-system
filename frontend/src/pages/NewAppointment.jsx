import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Video, Building2, UserCheck,
  ChevronRight, CheckCircle, AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { doctors } from '../services/mockData';

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const getNextDays = (count = 7) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

export default function NewAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addAppointment } = useAppData();
  const { user } = useAuth();

  const doctorId = searchParams.get('doctor');
  const preselectedDoctor = doctors.find(d => d.id === Number(doctorId));

  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor?.id || '');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [consultType, setConsultType] = useState('presencial');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const days = getNextDays();
  const doctor = doctors.find(d => d.id === Number(selectedDoctor));

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) { toast.error('Selecciona un médico'); return; }
    if (!selectedDate) { toast.error('Selecciona una fecha'); return; }
    if (!selectedTime) { toast.error('Selecciona un horario'); return; }

    setLoading(true);
    setTimeout(() => {
      const newApt = addAppointment({
        doctorId: doctor.id,
        doctor: doctor.name,
        specialty: doctor.specialty,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        type: consultType === 'presencial' ? 'Presencial' : 'Telemedicina',
        reason: reason || '',
        price: doctor.price,
        patientId: user?.id,
        patientEmail: user?.email,
        patientName: user?.fullName,
        patient: user?.fullName,
      });
      setLoading(false);
      toast.success(`¡Cita #${newApt.id} agendada exitosamente con ${doctor.name}!`);
      setTimeout(() => navigate('/appointments'), 1000);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          onClick={() => navigate(-1)}
          className="text-muted hover:text-heading text-sm font-medium transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Volver
        </button>
      </div>

      {/* Header */}
      <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading mb-2">
          Agendar <span className="text-gradient-premium">Cita</span>
        </h1>
        <p className="text-muted text-lg">Selecciona tu médico, fecha y horario preferido</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Doctor Selection */}
        <div className={`card-elevated rounded-2xl p-6 gradient-border transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
            <UserCheck size={18} className="text-blue-400" />
            Seleccionar Médico
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctors.filter(d => d.available).map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDoctor(d.id)}
                className={`card-interactive rounded-xl p-4 text-left flex items-center gap-3 transition-all duration-300 ${
                  selectedDoctor === d.id
                    ? '!border-blue-500/50 !bg-blue-500/10'
                    : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center shrink-0">
                  <UserCheck size={16} className="text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-heading text-sm truncate">{d.name}</p>
                  <p className="text-xs text-cyan-400">{d.specialty}</p>
                </div>
                {selectedDoctor === d.id && <CheckCircle size={16} className="text-blue-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className={`card-elevated rounded-2xl p-6 gradient-border transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" />
            Seleccionar Fecha
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {days.map((d, i) => {
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`shrink-0 w-[72px] py-4 rounded-xl text-center transition-all duration-300 border ${
                    isSelected
                      ? 'bg-gradient-to-b from-blue-600 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-500/25'
                      : 'card-interactive'
                  }`}
                >
                  <p className={`text-xs font-medium mb-1 ${isSelected ? 'text-blue-100' : 'text-muted'}`}>
                    {isToday ? 'Hoy' : d.toLocaleDateString('es-DO', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-heading'}`}>
                    {d.getDate()}
                  </p>
                  <p className={`text-xs ${isSelected ? 'text-blue-100' : 'text-faint'}`}>
                    {d.toLocaleDateString('es-DO', { month: 'short' })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div className={`card-elevated rounded-2xl p-6 gradient-border transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
            <Clock size={18} className="text-cyan-400" />
            Seleccionar Horario
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeSlots.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTime(t)}
                className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  selectedTime === t
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-500/20'
                    : 'card-interactive'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Consultation Type */}
        <div className={`card-elevated rounded-2xl p-6 gradient-border transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading mb-4">Tipo de Consulta</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setConsultType('presencial')}
              className={`card-interactive rounded-xl p-5 flex items-center gap-3 transition-all duration-300 ${
                consultType === 'presencial' ? '!border-blue-500/50 !bg-blue-500/10' : ''
              }`}
            >
              <Building2 size={20} className={consultType === 'presencial' ? 'text-blue-400' : 'text-muted'} />
              <div className="text-left">
                <p className="font-semibold text-heading text-sm">Presencial</p>
                <p className="text-xs text-muted">En consultorio</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setConsultType('telemedicina')}
              className={`card-interactive rounded-xl p-5 flex items-center gap-3 transition-all duration-300 ${
                consultType === 'telemedicina' ? '!border-cyan-500/50 !bg-cyan-500/10' : ''
              }`}
            >
              <Video size={20} className={consultType === 'telemedicina' ? 'text-cyan-400' : 'text-muted'} />
              <div className="text-left">
                <p className="font-semibold text-heading text-sm">Telemedicina</p>
                <p className="text-xs text-muted">Videollamada</p>
              </div>
            </button>
          </div>
        </div>

        {/* Reason */}
        <div className={`card-elevated rounded-2xl p-6 gradient-border transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-400" />
            Motivo de Consulta <span className="text-xs text-faint font-normal">(opcional)</span>
          </h3>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Describe brevemente el motivo de tu consulta..."
            className="input-base w-full rounded-xl px-4 py-3 text-sm resize-none"
          />
        </div>

        {/* Summary */}
        {selectedDoctor && selectedDate && selectedTime && (
          <div className="card-elevated rounded-2xl p-6 gradient-border animate-fade-in-up">
            <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" />
              Resumen
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Médico</span><span className="text-heading font-medium">{doctor?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted">Especialidad</span><span className="text-heading font-medium">{doctor?.specialty}</span></div>
              <div className="flex justify-between"><span className="text-muted">Fecha</span><span className="text-heading font-medium">{selectedDate.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
              <div className="flex justify-between"><span className="text-muted">Horario</span><span className="text-heading font-medium">{selectedTime}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tipo</span><span className="text-heading font-medium capitalize">{consultType}</span></div>
              <div className="flex justify-between"><span className="text-muted">Precio</span><span className="text-emerald-400 font-bold">{doctor?.price}</span></div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Agendando...
            </>
          ) : (
            <>
              Confirmar Cita
              <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
