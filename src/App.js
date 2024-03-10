import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthUserProvider } from "./contexts/AuthUserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Fetch from "./Fetch";
import MovieDetail from "./MovieDetail";
import UserPage from "./UserPage";
import Navbar from "./navbar/Navbar";
import Discover from "./navbar/Discover";
import Upcoming from "./navbar/Upcoming";
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
import "./components/PrivateWrapped";
import PrivateWrapped from "./components/PrivateWrapped";

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
          <Route path ="/user/:username/privateWrapped" element = {<PrivateWrapped />} />

          <Route path ="discover" element = {<Discover />} />
          <Route path ="upcoming" element = {<Upcoming />} />
          
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
