import React from "react";
import {Navigate } from "react-router-dom";
import { useAuthUser } from "../contexts/AuthUserContext"

// Create a PrivateRoute component that checks if there is a current user
// If there is a current user, render the component, otherwise redirect to the login page
const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuthUser();

    return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;