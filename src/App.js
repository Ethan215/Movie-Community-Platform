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
import Navbar from "./navbar/Navbar";
import Discover from "./navbar/Discover";
import New from "./navbar/New";
import Action from "./genres/Action";
import Adventure from "./genres/Adventure";
import Animation from "./genres/Animation";
import Comedy from "./genres/Comedy";
import Crime from "./genres/Crime";
import Drama from "./genres/Drama";
import Horror from "./genres/Horror";
import Music from "./genres/Music";
import Mystery from "./genres/Mystery";
import Romance from "./genres/Romance";
import Scifi from "./genres/Scifi";
import Thriller from "./genres/Thriller";


function App() {
  const location = useLocation();
  const isEmptyPath = (location.pathname === '/');


  return (
    <>
      <AuthUserProvider>
      
      {!isEmptyPath && <Navbar />}

        <Routes>
          <Route path="/" element={<Login />} ></Route>
          <Route path="/home" element={<Fetch />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path ="/user/:username" element = {<UserPage />} />

          <Route path ="discover" element = {<Discover />} />
          <Route path ="new" element = {<New />} />
          
          <Route path ="action" element = {<Action />} />
          <Route path ="adventure" element = {<Adventure />} />
          <Route path ="animation" element = {<Animation />} />
          <Route path ="comedy" element = {<Comedy />} />
          <Route path ="crime" element = {<Crime />} />
          <Route path ="drama" element = {<Drama />} />
          <Route path ="horror" element = {<Horror />} />
          <Route path ="music" element = {<Music />} />
          <Route path ="romance" element = {<Romance />} />
          <Route path ="mystery" element = {<Mystery />} />
          <Route path ="scifi" element = {<Scifi />} />
          <Route path ="thriller" element = {<Thriller />} />

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
