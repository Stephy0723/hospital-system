import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { appointments as defaultAppointments, prescriptions as defaultPrescriptions } from '../services/mockData';

const AppDataContext = createContext();

const APPOINTMENTS_KEY = 'medagenda-appointments';
const PRESCRIPTIONS_KEY = 'medagenda-prescriptions';
const CONTACTS_KEY = 'medagenda-contacts';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function AppDataProvider({ children }) {
  const [appointments, setAppointments] = useState(() => load(APPOINTMENTS_KEY, defaultAppointments));
  const [prescriptions, setPrescriptions] = useState(() => load(PRESCRIPTIONS_KEY, defaultPrescriptions));
  const [contactMessages, setContactMessages] = useState(() => load(CONTACTS_KEY, []));

  useEffect(() => { save(APPOINTMENTS_KEY, appointments); }, [appointments]);
  useEffect(() => { save(PRESCRIPTIONS_KEY, prescriptions); }, [prescriptions]);
  useEffect(() => { save(CONTACTS_KEY, contactMessages); }, [contactMessages]);

  const addAppointment = useCallback((apt) => {
    const newApt = {
      ...apt,
      id: Date.now(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  }, []);

  const cancelAppointment = useCallback((id) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'cancelled' } : a
    ));
  }, []);

  const completeAppointment = useCallback((id) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'completed' } : a
    ));
  }, []);

  const addPrescription = useCallback((rx) => {
    const newRx = {
      ...rx,
      id: `RX-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setPrescriptions(prev => [newRx, ...prev]);
    return newRx;
  }, []);

  const updatePrescriptionStatus = useCallback((id, status) => {
    setPrescriptions(prev => prev.map(rx =>
      rx.id === id ? { ...rx, status } : rx
    ));
  }, []);

  const addContactMessage = useCallback((msg) => {
    const newMsg = {
      ...msg,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setContactMessages(prev => [newMsg, ...prev]);
    return newMsg;
  }, []);

  const value = {
    appointments,
    addAppointment,
    cancelAppointment,
    completeAppointment,
    prescriptions,
    addPrescription,
    updatePrescriptionStatus,
    contactMessages,
    addContactMessage,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
