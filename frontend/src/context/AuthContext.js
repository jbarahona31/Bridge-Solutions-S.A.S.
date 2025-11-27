import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authData, setAuthDataState] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAuthDataState({ token, usuario: parsedUser });
    }
    setLoading(false);
  }, []);

  const setAuthData = (data) => {
    const { token, usuario } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    setUser(usuario);
    setAuthDataState({ token, usuario });
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    // Handle both old and new response formats
    const usuario = response.usuario || response.user;
    const token = response.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    setUser(usuario);
    setAuthDataState({ token, usuario });
    return { ...response, usuario };
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const token = response.token;
    const usuario = response.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    setUser(usuario);
    setAuthDataState({ token, usuario });
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthDataState(null);
  };

  const updateUserProfile = (updatedUser) => {
    const token = localStorage.getItem('token');
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    if (token) {
      setAuthDataState({ token, usuario: updatedUser });
    }
  };

  const isAdmin = () => {
    return user?.rol === 'administrador' || user?.rol === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateUserProfile,
      isAdmin,
      isAuthenticated: !!user,
      authData,
      setAuthData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
