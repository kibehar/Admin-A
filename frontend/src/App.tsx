import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import UserPage from "./components/UserPage"; 
import Inventorypage from "./components/InventoryPage";
import SalesPage from "./components/SalesPage";
import WarehousePage from "./components/WarehousePage";
import SupplierPage from "./components/SupplierPage";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserPage />} /> 
        <Route path="/inventory" element={<Inventorypage />} /> 
        <Route path="/sales" element={<SalesPage />} /> 
        <Route path="/warehouse" element={<WarehousePage />} /> 
        <Route path="/supplier" element={<SupplierPage />} /> 



      </Routes>
    </Router>
  );
};

export default App;
