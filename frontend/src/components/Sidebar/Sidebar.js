import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div>
      {/* Mobile Navbar */}
      <div className="mobile-navbar">
        <button
          onClick={toggleSidebar}
          aria-controls="sidebar-collapse"
          aria-expanded={open}
          className="navbar-toggler"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div id="sidebar-collapse" className="mobile-sidebar">
          <h2 className="sidebar-title">Dashboard</h2>
          <nav className="sidebar-nav">
            <Link to="/dashboard/overview" className="sidebar-link" onClick={toggleSidebar}>
              Overview
            </Link>
            <hr className="sidebar-divider" />
            <Link to="/dashboard/couriers" className="sidebar-link" onClick={toggleSidebar}>
              Courier Service
            </Link>
            <hr className="sidebar-divider" />
            <Link to="/dashboard/suppliers" className="sidebar-link" onClick={toggleSidebar}>
              Suppliers Management
            </Link>
            <hr className="sidebar-divider" />
            <Link to="/dashboard/supply-orders" className="sidebar-link">
              Supply Orders
            </Link>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="sidebar-nav">
          <Link to="/dashboard/overview" className="sidebar-link">
            Overview
          </Link>
          <hr className="sidebar-divider" />
          <Link to="/dashboard/couriers" className="sidebar-link">
            Courier Service
          </Link>
          <hr className="sidebar-divider" />
          <Link to="/dashboard/suppliers" className="sidebar-link">
            Suppliers Management
          </Link>
          <hr className="sidebar-divider" />
          <Link to="/dashboard/supply-orders" className="sidebar-link">
            Supply Orders
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;