import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthUserProvider } from "./contexts/AuthUserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Fetch from "./Fetch"; 
import MovieDetail from "./MovieDetail"; 
import UserPage from "./UserPage";

function App() {
  return (
    <Router>
      <AuthUserProvider>
        <Routes>
          {/* Main interface routing */}
          <Route path="/" element={<Login />} ></Route>
          <Route path="/home" element={<Fetch />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path ="/user/:username" element = {<UserPage />} />
          {/* User Authentication Routing */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthUserProvider>
    </Router>
  );
}

export default App;
