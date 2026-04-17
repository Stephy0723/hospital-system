import { useState } from 'react';
import {
  FileText, Plus, Search, Pill, User, Calendar, Stethoscope,
  CheckCircle, AlertCircle, Package, Send, Download, Eye,
  X, Save,
} from 'lucide-react';
import { doctors, medicines } from '../../services/mockData';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  active: { label: 'Activa', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  dispensed: { label: 'Surtida', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  expired: { label: 'Vencida', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

const emptyMedication = { name: '', dosage: '', duration: '', notes: '' };

export default function DashboardPrescriptions() {
  const { prescriptions, addPrescription } = useAppData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRx, setNewRx] = useState({
    patient: '',
    patientAge: '',
    diagnosis: '',
    notes: '',
    followUp: '',
    medications: [{ ...emptyMedication }],
  });

  const filtered = prescriptions.filter(rx => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return rx.patient.toLowerCase().includes(q) ||
      rx.doctor.toLowerCase().includes(q) ||
      rx.id.toLowerCase().includes(q) ||
      rx.diagnosis.toLowerCase().includes(q);
  });

  const addMedication = () => {
    setNewRx(prev => ({
      ...prev,
      medications: [...prev.medications, { ...emptyMedication }],
    }));
  };

  const removeMedication = (index) => {
    setNewRx(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const updateMedication = (index, field, value) => {
    setNewRx(prev => ({
      ...prev,
      medications: prev.medications.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPrescription({
      patient: newRx.patient,
      patientAge: newRx.patientAge,
      diagnosis: newRx.diagnosis,
      notes: newRx.notes,
      followUp: newRx.followUp,
      medications: newRx.medications.filter(m => m.name.trim()),
      doctor: user?.fullName || 'Doctor',
      doctorId: user?.id,
      doctorEmail: user?.email,
      specialty: user?.specialty || 'Medicina General',
    });
    setShowForm(false);
    setNewRx({
      patient: '',
      patientAge: '',
      diagnosis: '',
      notes: '',
      followUp: '',
      medications: [{ ...emptyMedication }],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-heading flex items-center gap-2">
            <FileText size={24} className="text-purple-400" />
            Gestión de Recetas
          </h2>
          <p className="text-sm text-muted mt-1">Crear, gestionar y enviar recetas médicas digitales</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Nueva Receta
        </button>
      </div>

      {/* New Prescription Form */}
      {showForm && (
        <div className="card-elevated rounded-2xl p-6 gradient-border animate-fade-in">
          <h3 className="text-lg font-bold text-heading mb-6 flex items-center gap-2">
            <FileText size={18} className="text-sky-400" />
            Crear Nueva Receta
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">Paciente</label>
                <input
                  type="text"
                  value={newRx.patient}
                  onChange={e => setNewRx({ ...newRx, patient: e.target.value })}
                  placeholder="Nombre completo"
                  className="w-full input-base rounded-xl px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">Edad</label>
                <input
                  type="number"
                  value={newRx.patientAge}
                  onChange={e => setNewRx({ ...newRx, patientAge: e.target.value })}
                  placeholder="Años"
                  className="w-full input-base rounded-xl px-4 py-3 text-sm"
                  min="0"
                  max="150"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">Fecha de Seguimiento</label>
                <input
                  type="date"
                  value={newRx.followUp}
                  onChange={e => setNewRx({ ...newRx, followUp: e.target.value })}
                  className="w-full input-base rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">Diagnóstico</label>
              <input
                type="text"
                value={newRx.diagnosis}
                onChange={e => setNewRx({ ...newRx, diagnosis: e.target.value })}
                placeholder="Diagnóstico del paciente"
                className="w-full input-base rounded-xl px-4 py-3 text-sm"
                required
              />
            </div>

            {/* Medications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">Medicamentos</label>
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus size={12} />
                  Agregar
                </button>
              </div>
              <div className="space-y-3">
                {newRx.medications.map((med, i) => (
                  <div key={i} className="card rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted">Medicamento {i + 1}</span>
                      {newRx.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(i)}
                          className="w-6 h-6 rounded-md border border-themed flex items-center justify-center text-faint hover:text-rose-400 hover:border-rose-500/30 transition-all"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={med.name}
                        onChange={e => updateMedication(i, 'name', e.target.value)}
                        placeholder="Nombre del medicamento"
                        className="input-base rounded-lg px-3 py-2 text-sm"
                        required
                        list="medicine-suggestions"
                      />
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={e => updateMedication(i, 'dosage', e.target.value)}
                        placeholder="Ej: 1 tableta cada 8h"
                        className="input-base rounded-lg px-3 py-2 text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={med.duration}
                        onChange={e => updateMedication(i, 'duration', e.target.value)}
                        placeholder="Ej: 10 días"
                        className="input-base rounded-lg px-3 py-2 text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={med.notes}
                        onChange={e => updateMedication(i, 'notes', e.target.value)}
                        placeholder="Notas adicionales (opcional)"
                        className="input-base rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <datalist id="medicine-suggestions">
                {medicines.map(m => (
                  <option key={m.id} value={`${m.name} ${m.genericName}`} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">Indicaciones Generales</label>
              <textarea
                value={newRx.notes}
                onChange={e => setNewRx({ ...newRx, notes: e.target.value })}
                placeholder="Indicaciones y recomendaciones para el paciente..."
                rows={3}
                className="w-full input-base rounded-xl px-4 py-3 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium card text-muted hover:text-heading transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <Save size={14} />
                Guardar Receta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="card rounded-2xl p-2 flex items-center gap-3 px-4">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar por paciente, doctor, ID o diagnóstico..."
          className="w-full bg-transparent text-heading placeholder-[var(--text-faint)] outline-none py-2.5 text-sm"
        />
      </div>

      {/* Prescriptions Table */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-themed">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">ID</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Paciente</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Doctor</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Diagnóstico</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Fecha</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Estado</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rx => {
                const status = statusConfig[rx.status] || statusConfig.active;
                return (
                  <tr key={rx.id} className="border-b border-themed hover:bg-[var(--bg-card)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-semibold text-heading">{rx.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <User size={14} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-heading">{rx.patient}</p>
                          <p className="text-[10px] text-muted">{rx.patientAge} años</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-body">{rx.doctor}</p>
                      <p className="text-[10px] text-muted">{rx.specialty}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-body max-w-[200px] truncate">{rx.diagnosis}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted">{new Date(rx.date).toLocaleDateString('es-DO')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-md border border-themed flex items-center justify-center text-muted hover:text-sky-400 hover:border-sky-500/30 transition-all" title="Ver detalle">
                          <Eye size={13} />
                        </button>
                        <button className="w-7 h-7 rounded-md border border-themed flex items-center justify-center text-muted hover:text-emerald-400 hover:border-emerald-500/30 transition-all" title="Descargar">
                          <Download size={13} />
                        </button>
                        <button className="w-7 h-7 rounded-md border border-themed flex items-center justify-center text-muted hover:text-purple-400 hover:border-purple-500/30 transition-all" title="Enviar a farmacia">
                          <Send size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={40} className="mx-auto text-faint mb-3" />
            <p className="text-sm text-muted">No se encontraron recetas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
