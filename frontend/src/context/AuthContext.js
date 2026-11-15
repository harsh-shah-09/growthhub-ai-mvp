import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while restoring session

  // On mount: check SecureStore for a saved token from a previous session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('userToken');
        if (savedToken) {
          setUserToken(savedToken);
          // Fetch the user profile using the saved token
          const response = await axiosClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        // Token is invalid or expired — clear it
        console.warn('Session restore failed, logging out:', error.message);
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * login(token)
   * Called by LoginScreen after a successful /auth/login API call.
   * Saves the token to SecureStore and fetches the user profile.
   */
  const login = async (token) => {
    await SecureStore.setItemAsync('userToken', token);
    setUserToken(token);
    try {
      const response = await axiosClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.warn('Could not fetch user profile after login:', error.message);
    }
  };

  /**
   * logout()
   * Clears the token from SecureStore and resets state.
   */
  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook — use this in every screen instead of raw useContext
export const useAuth = () => useContext(AuthContext);
