import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthUserProvider } from "./contexts/AuthUserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Fetch from "./Fetch"; 
import MovieDetail from "./MovieDetail"; 
import UserPage from "./UserPage";
import Navbar from "./Navbar";

function App() {
  const location = useLocation();
  const isEmptyPath = location.pathname === '/';
  let component
  // switch (window.location.pathname) {
  //   case "/":
  //     component = <App />
  //     break
  //   case "/genres":
  //     component = <Genres />
  //     break;
  //   case "/discover":
  //     component = <Discover />
  //     break;
  // }

  return (
    <>
      <AuthUserProvider>
      {!isEmptyPath && <Navbar />}
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
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
