import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./guard/ProtectedRoute";
import PublicRoute from "./guard/PublicRoute";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/forget-password" element={
            <PublicRoute>
              <ForgetPassword />
            </PublicRoute>
          } />

          <Route path="/reset-password" element={
            <ResetPassword />
          } />

        </Routes>
      </BrowserRouter >
    </AuthProvider>
  );
}

export default App;
