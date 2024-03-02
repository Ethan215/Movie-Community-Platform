import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./components/Signup";
// import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import Fetch from "./Fetch"; 
import MovieDetail from "./MovieDetail"; 
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 主界面路由 */}
          <Route path="/" element={<Login />} ></Route>
          <Route path="/fetch" element={<Fetch />} />
          <Route path="/movie/:id" element={<MovieDetail />} />

          {/* 用户认证路由 */}
          <Route path="/signup" element={<ContainerComponent><Signup /></ContainerComponent>} />
          <Route path="/login" element={<ContainerComponent><Login /></ContainerComponent>} />
          <Route path="/forgot-password" element={<ContainerComponent><ForgotPassword /></ContainerComponent>} />
          
          {/* 保护的路由 */}
          {/* <Route path="/" element={<ContainerComponent><PrivateRoute><Dashboard /></PrivateRoute></ContainerComponent>} /> */}
          <Route path="/update-profile" element={<ContainerComponent><PrivateRoute><UpdateProfile /></PrivateRoute></ContainerComponent>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// 将共享的布局组件抽象出来
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

export default App;
