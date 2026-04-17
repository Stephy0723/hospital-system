import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'medagenda-auth';
const USERS_KEY = 'medagenda-users';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!loadSession());

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const register = useCallback(({ fullName, email, phone, password, role, ...extraFields }) => {
    const users = loadUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico' };
    }

    const newUser = {
      id: Date.now().toString(),
      fullName,
      email: email.toLowerCase(),
      phone: phone || '',
      role: role || 'patient',
      createdAt: new Date().toISOString(),
      avatar: null,
      ...extraFields,
    };

    // Store user with password hash (simple base64 for demo - in production use bcrypt on backend)
    users.push({ ...newUser, _pw: btoa(password) });
    saveUsers(users);

    const sessionUser = { ...newUser };
    setUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, user: sessionUser };
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { success: false, error: 'No se encontró una cuenta con este correo' };
    }

    if (found._pw !== btoa(password)) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    const { _pw, ...sessionUser } = found;
    setUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, user: sessionUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      const users = loadUsers();
      const idx = users.findIndex(u => u.id === prev.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        saveUsers(users);
      }
      return updated;
    });
  }, []);

  const resetPassword = useCallback(({ email, newPassword }) => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      return { success: false, error: 'No se encontró una cuenta con este correo' };
    }
    users[idx]._pw = btoa(newPassword);
    saveUsers(users);
    return { success: true };
  }, []);

  const value = {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
