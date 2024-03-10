import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthUserProvider } from "./contexts/AuthUserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Fetch from "./Fetch"; 
import MovieDetail from "./MovieDetail"; 
import { Container } from 'react-bootstrap';
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
          <Route path="/signup" element={<ContainerComponent><Signup /></ContainerComponent>} />
          <Route path="/login" element={<ContainerComponent><Login /></ContainerComponent>} />
          <Route path="/forgot-password" element={<ContainerComponent><ForgotPassword /></ContainerComponent>} />
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


// Shared layout components
function ContainerComponent({ children }) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {children}
      </div>
    </Container>
  );
}

export default AppWithRouter;
