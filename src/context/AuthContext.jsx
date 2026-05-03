import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create a context to share Authentication state globally across the app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State to hold the logged-in user object (null if not logged in)
  const [user, setUser] = useState(null);
  
  // State to track if the authentication check is still loading
  const [loading, setLoading] = useState(true);

  // useEffect runs ONCE when the app first loads (like upon refreshing the browser)
  // We use this to check if the user has a valid token and automatically log them back in.
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Because we are using cookies with withCredentials: true,
        // we can simply make the request. The browser automatically sends the cookie.
        const response = await api.get('/users/me');
        setUser(response.data.user);
        console.log(response.data.user);
        
      } catch (error) {
        // If the cookie is expired, missing, or invalid, the backend returns an error.
        console.error("Session expired or invalid token:", error);
        setUser(null);
      }
      // Finished checking
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Function to execute upon a successful login
  // 1. Updates the global `user` state (cookie is automatically set by response)
  const login = (userData) => {
    setUser(userData);
  };

  // Function to execute to securely wipe session
  const logout = async () => {
    try {
      // Call the backend to clear the HttpOnly cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear the local state regardless of server response
      setUser(null);
    }
  };

  return (
    // We provide `user`, `login`, `logout`, and `loading` to any component that needs it
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
};
