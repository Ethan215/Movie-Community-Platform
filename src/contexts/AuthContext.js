// Import React and the necessary firebase functions
import React, { useContext, useState, useEffect } from "react"
import { auth } from "./firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
// Create a context for authentication
const AuthContext = React.createContext()

// Export a hook to use authentication
export function useAuth() {
  return useContext(AuthContext)
}

// AuthProvider is a component that provides authentication functions to its children
export function AuthProvider({ children }) {
  // Set the current user and loading state
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  // Sign up function
  function signup(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Login function
  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // Logout function
  function logout() {
    return auth.signOut()
  }

  // Reset password function
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  // Update email function
  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  // Update password function
  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  // Use effect to set the current user and loading state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Set the value of the context （use useAuth() to access those function and variable )
  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  // Return the context provider
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}