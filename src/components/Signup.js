import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuthUser } from "../contexts/AuthUserContext"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../contexts/firebase"
import { collection, addDoc, where, query, getDocs } from "firebase/firestore";

export default function Signup() {
  // Create references for the email, password, and password confirm inputs
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const usernameRef = useRef()
  const { signup } = useAuthUser()
  // Destructure signup from the useAuth context
  //const { signup } = useAuth()
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
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {/* Display any errors */}
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Display error related to username being taken */}
          {errorText && <Alert variant="danger">{errorText}</Alert>}
          {/* Display sign up form table */}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            {/* Disable the button if loading */}
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        {/* Link to the login page */}
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}