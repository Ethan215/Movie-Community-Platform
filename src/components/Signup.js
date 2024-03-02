import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Signup() {
  // Create references for the email, password, and password confirm inputs
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  // Destructure signup from the useAuth context
  const { signup } = useAuth()
  // Create state for error and loading
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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

    try {
      // Clear any existing errors
      setError("")
      // Set loading to true
      setLoading(true)

      // Call the signup function with the email and password
      await signup(emailRef.current.value, passwordRef.current.value)
      // Navigate to the home page
      navigate("/login")
    } catch (error) {
        console.error(error);
        setError("Failed to create an account. Error: " + error.message);
    }
      
    // Set loading to false
    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {/* Display any errors */}
          {error && <Alert variant="danger">{error}</Alert>}
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