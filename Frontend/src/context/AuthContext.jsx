import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(email, password, fullName, role) {
    try {
      const response = await axiosInstance.post('/auth/register', {
        email: email,
        password: password,
        fullName: fullName,
        role: role,
        provider: 'EMAIL'
      });
      
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      
      setCurrentUser(user);
      setDbUser(user);
      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password
      });
      
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      
      setCurrentUser(user);
      setDbUser(user);
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    // Note: Google login without Firebase usually involves redirecting to backend OAuth endpoint
    // We will keep this as a stub that requires further backend support (e.g., OAuth2 Login)
    console.warn("Google Login requires OAuth2 implementation on Spring Boot backend.");
    alert("Google login is temporarily disabled during migration.");
    throw new Error("Not implemented yet");
  }

  function logout() {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setDbUser(null);
  }

  function resetPassword(email) {
    // Requires a forgot-password endpoint on the backend
    console.warn("Reset password not fully implemented in backend yet.");
    return Promise.resolve();
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user details
          const response = await axiosInstance.get('/auth/me');
          setCurrentUser(response.data.data);
          setDbUser(response.data.data);
        } catch (error) {
          console.error("Error fetching DB user, token might be invalid", error);
          localStorage.removeItem('token');
          setCurrentUser(null);
          setDbUser(null);
        }
      } else {
        setCurrentUser(null);
        setDbUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const value = {
    currentUser,
    dbUser,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
