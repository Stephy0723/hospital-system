import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  patient: {
    id: 101,
    fullName: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '+1 809 555 1234',
    role: 'patient',
    avatar: null,
    since: '2024',
  },
  doctor: {
    id: 1,
    fullName: 'Dra. María González',
    email: 'maria.gonzalez@medagenda.do',
    phone: '+1 809 555 5678',
    role: 'doctor',
    specialty: 'Cardiología',
    location: 'Santo Domingo',
    experience: '15 años',
    education: 'UASD — Facultad de Ciencias de la Salud',
    bio: 'Cardióloga certificada con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares.',
    price: 'RD$ 3,500',
    tags: ['Hipertensión', 'Arritmias', 'Check-up'],
    rating: 4.9,
    reviews: 127,
    avatar: null,
    since: '2022',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medagenda-user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medagenda-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medagenda-user');
    }
  }, [user]);

  const login = (role = 'patient') => {
    const mockUser = MOCK_USERS[role] || MOCK_USERS.patient;
    setUser(mockUser);
  };

  const register = (formData) => {
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || '',
      role: formData.role || 'patient',
      avatar: null,
      since: new Date().getFullYear().toString(),
      ...(formData.role === 'doctor' ? {
        specialty: '',
        location: '',
        experience: '',
        education: '',
        bio: '',
        price: '',
        tags: [],
        rating: 0,
        reviews: 0,
      } : {}),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
