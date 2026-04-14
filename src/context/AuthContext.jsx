import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('guest');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session on initial load
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(parsedUser.user_metadata?.role || 'seeker');
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, role, fullName) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, fullName })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);
    setUserRole(data.user.user_metadata?.role || 'seeker');
    return data;
  };

  const login = async (email, password, role) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);
    setUserRole(data.user.user_metadata?.role || 'seeker');
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setUserRole('guest');
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const uploadAvatar = async (file) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/auth/upload-avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ userRole, user, loading, login, signup, logout, updateProfile, uploadAvatar }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
