import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

// Create a PrivateRoute component that checks if there is a current user
// If there is a current user, render the component, otherwise redirect to the login page
const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;