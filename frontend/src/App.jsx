import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Customer
import CustomerLayout from './components/Customer/CustomerLayout';
import Menu from './pages/Customer/Menu';
import Checkout from './pages/Customer/Checkout';
import TrackOrder from './pages/Customer/TrackOrder';
import CartDrawer from './components/Customer/CartDrawer';

// Admin
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import OrderManager from './pages/Admin/OrderManager';
import MenuManager from './pages/Admin/MenuManager';
import AdminLogin from './pages/Admin/AdminLogin'; // 1. Import Login Page
import ProtectedRoute from './components/Admin/ProtectedRoute'; // 2. Import Protector

function App() {
  return (
    <CartProvider>
      <Router>
        <CartDrawer />
        
        <ToastContainer 
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />

        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Menu />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="track" element={<TrackOrder />} />
          </Route>

          {/* 3. Admin Login Route (Public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 4. Admin Protected Routes (Private) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="menu" element={<MenuManager />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;