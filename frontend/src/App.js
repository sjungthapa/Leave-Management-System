import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import Login from './assets/pages/login'
import Register from './assets/pages/register'
import Home from './assets/pages/home'
import MyLeaves from './assets/pages/MyLeaves'
import AdminLeaveList from './assets/pages/AdminLeaveList'
import Navbar from './components/Navbar'

import { Toaster } from "react-hot-toast"

const { Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage events
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab updates
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return !token ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout style={{ minHeight: "100vh" }}>
        {isAuthenticated && <Navbar />}
        <Content style={{ padding: isAuthenticated ? "20px" : "0" }}>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Myleaves"
              element={
                <ProtectedRoute>
                  <MyLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminleavelist"
              element={
                <ProtectedRoute>
                  <AdminLeaveList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
