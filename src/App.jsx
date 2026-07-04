import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Riders from './pages/Riders';
import Attendance from './pages/Attendance';
import Shipments from './pages/Shipments';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Returns from './pages/Returns';
import Revenue from './pages/Revenue';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
<Route index element={<Home />} />
        <Route path="riders" element={<Riders />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="returns" element={<Returns />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;