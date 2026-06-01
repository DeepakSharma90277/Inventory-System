import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon">📦</span>
            <span className="logo-text">InvenTrack</span>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">🏠</span> Dashboard
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">🛍️</span> Products
            </NavLink>
            <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">👥</span> Customers
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">📋</span> Orders
            </NavLink>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
