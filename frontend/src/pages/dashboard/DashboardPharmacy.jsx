import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill, MapPin, Phone, Clock, Star, Truck, Search,
  ExternalLink, CheckCircle, Shield, ShoppingBag,
} from 'lucide-react';
import { pharmacies, medicines } from '../../services/mockData';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPharmacy() {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pharmacies');
  const { prescriptions } = useAppData();
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const myPrescriptions = prescriptions.filter(rx =>
    rx.patientId === user?.id || rx.patientEmail === user?.email
  );
  const activeRx = myPrescriptions.filter(rx => rx.status === 'active');

  // All medications from active prescriptions
  const myMeds = activeRx.flatMap(rx => rx.medications || []);

  const filteredPharmacies = pharmacies.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMedicines = medicines.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-bold text-heading mb-1 flex items-center gap-2">
          <Pill size={22} className="text-teal-400" />
          Farmacia
        </h2>
        <p className="text-muted text-sm">Encuentra farmacias, medicamentos y gestiona tus recetas</p>
      </div>

      {/* My Active Medications Banner */}
      {myMeds.length > 0 && (
        <div className={`card-elevated rounded-2xl p-5 border-l-4 border-l-teal-500 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="font-bold text-heading text-sm mb-3 flex items-center gap-2">
            <ShoppingBag size={15} className="text-teal-400" />
            Mis Medicamentos Activos ({myMeds.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {myMeds.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-medium border border-teal-500/20">
                <Pill size={11} /> {m.name} — {m.dosage}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs + Search */}
      <div className={`flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-input)]">
          {[
            { key: 'pharmacies', label: 'Farmacias' },
            { key: 'medicines', label: 'Medicamentos' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? 'bg-sky-500/15 text-sky-400' : 'text-muted hover:text-body'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'pharmacies' ? 'Buscar farmacia...' : 'Buscar medicamento...'}
            className="input-base w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      {tab === 'pharmacies' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPharmacies.map((pharmacy, i) => (
            <div
              key={pharmacy.id}
              className={`card-interactive rounded-2xl p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-heading">{pharmacy.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star size={12} fill="currentColor" /> {pharmacy.rating}
                    </div>
                    <span className="text-xs text-muted">({pharmacy.reviews})</span>
                    {pharmacy.distance && (
                      <span className="text-xs text-muted">· {pharmacy.distance}</span>
                    )}
                  </div>
                </div>
                {pharmacy.available24h && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    24h
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-muted mb-3">
                <p className="flex items-center gap-1.5"><MapPin size={12} /> {pharmacy.address}</p>
                <p className="flex items-center gap-1.5"><Phone size={12} /> {pharmacy.phone}</p>
                <p className="flex items-center gap-1.5"><Clock size={12} /> {pharmacy.hours}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {pharmacy.services?.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-medium">{s}</span>
                ))}
              </div>

              {pharmacy.hasDelivery && (
                <div className="mt-3 pt-3 border-t border-themed flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Truck size={13} /> Entrega a domicilio disponible
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map((med, i) => (
            <div
              key={med.id}
              className={`card-interactive rounded-2xl p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-heading text-sm">{med.name}</h4>
                  <p className="text-xs text-muted">{med.genericName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  med.requiresPrescription
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {med.requiresPrescription ? 'Receta' : 'Libre'}
                </span>
              </div>

              <span className="inline-block px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium mb-2">{med.category}</span>
              <p className="text-xs text-muted mb-3">{med.description}</p>

              <div className="space-y-1 text-xs mb-3">
                <p className="text-body"><span className="text-muted">Presentación:</span> {med.presentation}</p>
                <p className="text-body"><span className="text-muted">Dosis:</span> {med.dosage}</p>
                <p className="text-body"><span className="text-muted">Laboratorio:</span> {med.laboratory}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-themed">
                <span className="text-lg font-bold text-heading">{med.price}</span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle size={12} /> {med.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
