import { useState, useEffect } from 'react';
import { User } from '@/types';

/**
 * Professional hook to manage and access the current user session.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
    // Optional: Add event listener for storage changes if multiple tabs are expected
  }, []);

  const login = (newUser: User) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return {
    user,
    isAuthenticated: !!user,
    role: user?.role,
    loading,
    login,
    logout
  };
}
