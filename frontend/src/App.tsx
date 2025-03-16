import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import UserPage from "./components/UserPage"; 
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserPage />} /> {}
      </Routes>
    </Router>
  );
};

export default App;
