import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../config/firebase';
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    try {
      const response = await axiosInstance.post('/auth/register', {
        email: user.email,
        fullName: fullName,
        role: role,
        provider: 'EMAIL'
      });
      
      setDbUser(response.data.data);
      // Force refresh token to pull the new Custom Claims injected by backend
      await user.getIdToken(true); 
      return user;
    } catch (error) {
      // Rollback orphaned account
      await user.delete();
      await signOut(auth);
      throw error;
    }
  }

  async function login(email, password) {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Login API now extracts uid from JWT, requires no payload
    const response = await axiosInstance.post('/auth/login');
    setDbUser(response.data.data);
    return userCredential.user;
  }

  async function loginWithGoogle() {
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    try {
      const response = await axiosInstance.post('/auth/google', {
        email: user.email,
        fullName: user.displayName,
        role: 'ROLE_JOB_SEEKER',
        provider: 'GOOGLE'
      });
      setDbUser(response.data.data);
      await user.getIdToken(true);
      return user;
    } catch (error) {
      await user.delete();
      await signOut(auth);
      throw error;
    }
  }

  function logout() {
    axiosInstance.post('/auth/logout').catch(console.error);
    setDbUser(null);
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && !dbUser) {
        try {
          const response = await axiosInstance.get('/auth/me');
          setDbUser(response.data.data);
        } catch (error) {
          console.error("Error fetching DB user", error);
        }
      } else if (!user) {
        setDbUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
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
