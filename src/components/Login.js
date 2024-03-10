import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuthUser } from "../contexts/AuthUserContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../contexts/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

// Export the login component
export default function Login() {
  // create email and password references
  const emailRef = useRef();
  const passwordRef = useRef();
  // get login and setCurrentUser methods from AuthUserContext
  const { login, setCurrentUser } = useAuthUser();
  // Create the error and loading states.
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Get Navigation Methods
  const navigate = useNavigate();

  // Handling of submission events
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      // Detect whether the user has entered the correct e-mail and password
      await login(emailRef.current.value, passwordRef.current.value);
      // Get user information
      const q = query(collection(db, "users"), where("email", "==", emailRef.current.value));
      const querySnapshot = await getDocs(q);
      // check if user is exist, get the username
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        // Set current user information
        setCurrentUser({
          username: userDoc.data().username,
          email: userDoc.data().email 
        });
        // Store user information in localStorage
        localStorage.setItem('userDetails', JSON.stringify({
          username: userDoc.data().username,
          email: userDoc.data().email
        }));
      } else {
        console.log("No user found with that email");
      }
      navigate("/home"); 

    } catch (error) {
       console.error(error);
      //setError("Failed to log in. Error: " + error.message);
      setError("Please enter the correct e-mail and password");

    }

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                name="email" 
                required
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                name="password" 
                required
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/signup">Need an account? Sign Up</Link>
      </div>
    </>
  );
}
