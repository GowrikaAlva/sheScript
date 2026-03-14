import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import App from "./App";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("shescript_token");
  return token ? children : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
