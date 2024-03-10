import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { auth } from './firebase' // Make sure this path is correct

// Create a context for the current user
const AuthUserContext = createContext()

// Custom hook to access the current user
export function useAuthUser() {
  return useContext(AuthUserContext)
}

// Provider component to wrap your app and provide the current user to all child components
export function AuthUserProvider({ children }) {
  // Set the initial state of the current user
  const [currentUser, setCurrentUser] = useState(() => {   //currentUser: Stores information about the current authenticated user.
    const user = getAuth().currentUser
    const userDetails = localStorage.getItem('userDetails')
    return user ? JSON.parse(userDetails) ?? user : null
  })

  // Effect to listen for changes in the auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        //If the user is logged in, an attempt is made to retrieve the user details from local storage and set them to the current user's status.
        const storedUserDetails = localStorage.getItem('userDetails')
        if (storedUserDetails) {
          setCurrentUser(JSON.parse(storedUserDetails))
        }
      } else {
        setCurrentUser(null)
        //Old user details are no longer retained when a user logs out or does not log in.
        localStorage.removeItem('userDetails')
      }
    })
    // Return the unsubscribe function to clean up on component unmount
    return unsubscribe
  }, [])

  // Sign up function
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error("Login failed:", error.message)
      throw error // Re-throw the error so you can catch it and handle/display it where the function is called.
    }
  }

  // Logout function
  const logout = async () => {
    return auth.signOut().then(() => {
      setCurrentUser(null)
      localStorage.removeItem('userDetails')
    })
  }

  // Reset password function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  // Add any other auth/user functions here

  // Value to be provided to child components
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    setCurrentUser
  }

  // Provide the current user to child components
  return (
    <AuthUserContext.Provider value={value}>
      {children}
    </AuthUserContext.Provider>
  )
}