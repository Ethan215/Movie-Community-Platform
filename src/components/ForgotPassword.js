import React, { useRef, useState } from "react"
// import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuthUser } from "../contexts/AuthUserContext"
import { Link } from "react-router-dom"
import "./ForgotPassword.css"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuthUser()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")  
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch (error) {
      console.error(error);
      setError("Failed to log in. Error: " + error.message);
    }

    setLoading(false)
  }

    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2 className="forgot-password-header">Password Reset</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                required
                className="form-control"
              />
            </div>
            <button disabled={loading} className="forgot-password-button" type="submit">
              Reset Password
            </button>
          </form>
          <div className="forgot-password-signup-link">
            <Link className="forgot-password-link" to="/login">Login</Link>
          </div>
          <div className="forgot-password-signup-link">
            Need an account? <Link className="forgot-password-link" to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    )
}