import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Riders from './pages/Riders';
import Attendance from './pages/Attendance';
import Shipments from './pages/Shipments';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Returns from './pages/Returns';
import Revenue from './pages/Revenue';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import Expenses from './pages/Expenses';
import DamagedProducts from './pages/DamagedProducts';
import Products from './pages/Products';
import Notepad from './pages/Notepad';
import Calendar from './pages/Calendar';

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
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="riders" element={<Riders />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="orders" element={<Orders />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="returns" element={<Returns />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="reports" element={<Reports />} />
        <Route path="customers" element={<Customers />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="damaged" element={<DamagedProducts />} />
        <Route path="products" element={<Products />} />
        <Route path="notepad" element={<Notepad />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;



