import React, { useRef, useState } from "react"
import { useAuthUser } from "../contexts/AuthUserContext"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../contexts/firebase"
import { collection, addDoc, where, query, getDocs } from "firebase/firestore";
import "./Signup.css"
export default function Signup() {
  // Create references for the email, password, and password confirm inputs
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const usernameRef = useRef()
  const { signup } = useAuthUser()
  // Create state for error and loading
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  // Use the useNavigate hook to navigate
  const navigate = useNavigate()

  // Function to handle the form submission
  async function handleSubmit(e) {
    // Prevent the default form submission
    e.preventDefault()

    // If the passwords do not match, set an error
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    setError(""); // Clear previous error messages
    setLoading(true); 
      const q = query(collection(db, "users"), where("username", "==", usernameRef.current.value));
      const q2 = query(collection(db, "users"), where("email", "==", emailRef.current.value));
      const querySnapshot = await getDocs(q);
      const querySnapshot2 = await getDocs(q2);
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
      const reviewsData2 = querySnapshot2.docs.map(doc => doc.data());
      if(reviewsData.length!==0){
        setErrorText("Error: Username is taken")
      }else if(reviewsData2.length!==0){
        setErrorText("Error: Email is taken")
      }else{
        await addDoc(collection(db, "users"),{
          username: usernameRef.current.value,
          email: emailRef.current.value
        });
        const user = await signup(emailRef.current.value, passwordRef.current.value);
        try{
        console.log("Successful registration:", user);
        navigate("/login"); // Jump after successful registration
        }catch (error) {
          console.error("Registration Failure:", error);
          setError("Failed to create an account. Error: " + error.message); // Display error messages
        }
      }
      
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-body">
          <h2 className="signup-header">Sign Up</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {errorText && <div className="alert alert-danger">{errorText}</div>}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" ref={emailRef} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" ref={passwordRef} required />
            </div>
            <div className="form-group">
              <label>Password Confirmation</label>
              <input type="password" ref={passwordConfirmRef} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" ref={usernameRef} required />
            </div>
            <button disabled={loading} type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="login-link-container">
        Already have an account? <Link to="/">Log In</Link>
      </div>
    </div>
  );
}