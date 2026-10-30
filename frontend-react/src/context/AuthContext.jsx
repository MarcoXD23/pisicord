import { createContext, useContext, useState, useEffect } from 'react';
import { loginService, registerService, logoutService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Iniciar sesión
  const login = async (credentials) => {
    const response = await loginService(credentials);
    const { user: userData, token: userToken } = response.data;

    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return response;
  };

  // Registro de nuevo usuario
  const register = async (formData) => {
    const response = await registerService(formData);
    const { user: userData, token: userToken } = response.data;

    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return response;
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      if (token) {
        await logoutService();
      }
    } catch {
      // Ignorar fallo de red en logout para garantizar la salida local
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

