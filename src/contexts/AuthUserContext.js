import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './firebase'; // Make sure this path is correct

const AuthUserContext = createContext();

export function useAuthUser() {
  return useContext(AuthUserContext);
}

export function AuthUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = getAuth().currentUser;
    const userDetails = localStorage.getItem('userDetails');
    return user ? JSON.parse(userDetails) ?? user : null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // Optionally fetch more detailed user information from your database here
        const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
        setCurrentUser(JSON.parse(storedUserDetails));
      }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('userDetails');
      }
    });

    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // Re-throw the error so you can catch it and handle/display it where the function is called.
    }
  };

  const logout = () => {
    return auth.signOut().then(() => {
      setCurrentUser(null);
      localStorage.removeItem('userDetails');
    });
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Consider adding updateEmail and updatePassword functions similar to above if needed

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    setCurrentUser
    // Add any other auth/user functions here
  };

  return (
    <AuthUserContext.Provider value={value}>
      {children}
    </AuthUserContext.Provider>
  );
}
