import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole }) => {
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
          <h2 className="sidebar-title">{userRole}'s Dashboard</h2>
          <nav className="sidebar-nav">
            <Link to="/dashboard/overview" className="sidebar-link" onClick={toggleSidebar}>
              Overview
            </Link>
            <hr className="sidebar-divider" />

            {userRole === 'Courier Service' && <>
              <Link to="/dashboard/couriers" className="sidebar-link" onClick={toggleSidebar}>Courier Service</Link><hr className="sidebar-divider" />
            </>}

            {userRole === 'Inventory Manager' && <>
              <Link to="/dashboard/suppliers" className="sidebar-link" onClick={toggleSidebar}>Suppliers Management</Link><hr className="sidebar-divider" />
              <Link to="/dashboard/stock-management" className="sidebar-link" onClick={toggleSidebar}>Stock Management</Link><hr className="sidebar-divider" />
              <Link to="/dashboard/stock-replenishment" className="sidebar-link" onClick={toggleSidebar}>Stock Replenishment</Link><hr className="sidebar-divider" />
              <Link to="/dashboard/my-orders" className="sidebar-link" onClick={toggleSidebar}>My Orders</Link><hr className="sidebar-divider" />
            </>}

            {userRole === 'Supplier' && <>
              <Link to="/dashboard/supply-products" className="sidebar-link" onClick={toggleSidebar}>Products</Link><hr className="sidebar-divider" />
              <Link to="/dashboard/supply-orders" className="sidebar-link" onClick={toggleSidebar}>Supply Orders</Link><hr className="sidebar-divider" />
            </>}

            {userRole === 'Customer' && <>
              <Link to="/dashboard/products" className="sidebar-link" onClick={toggleSidebar}>Products</Link><hr className="sidebar-divider" />
              <Link to="/dashboard/notifications" className="sidebar-link" onClick={toggleSidebar}>Notifications</Link><hr className="sidebar-divider" />
            </>}
            <Link to="/logout" className="sidebar-link">
              Logout
            </Link>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <h2 className="sidebar-title">{userRole}'s Dashboard</h2>
        <nav className="sidebar-nav">
          <Link to="/dashboard/overview" className="sidebar-link">
            Overview
          </Link>
          <hr className="sidebar-divider" />

          {userRole === 'Courier Service' && <>
            <Link to="/dashboard/couriers" className="sidebar-link" onClick={toggleSidebar}>Courier Service</Link><hr className="sidebar-divider" />
          </>}

          {userRole === 'Inventory Manager' && <>
            <Link to="/dashboard/suppliers" className="sidebar-link" onClick={toggleSidebar}>Suppliers Management</Link><hr className="sidebar-divider" />
            <Link to="/dashboard/stock-management" className="sidebar-link" onClick={toggleSidebar}>Stock Management</Link><hr className="sidebar-divider" />
            <Link to="/dashboard/stock-replenishment" className="sidebar-link" onClick={toggleSidebar}>Stock Replenishment</Link><hr className="sidebar-divider" />
            <Link to="/dashboard/my-orders" className="sidebar-link" onClick={toggleSidebar}>My Orders</Link><hr className="sidebar-divider" />
          </>}

          {userRole === 'Supplier' && <>
            <Link to="/dashboard/supply-products" className="sidebar-link" onClick={toggleSidebar}>Products</Link><hr className="sidebar-divider" />
            <Link to="/dashboard/supply-orders" className="sidebar-link" onClick={toggleSidebar}>Supply Orders</Link><hr className="sidebar-divider" />
          </>}

          {userRole === 'Customer' && <>
            <Link to="/dashboard/products" className="sidebar-link" onClick={toggleSidebar}>Products</Link><hr className="sidebar-divider" />
            <Link to="/dashboard/notifications" className="sidebar-link" onClick={toggleSidebar}>Notifications</Link><hr className="sidebar-divider" />
          </>}
          <Link to="/logout" className="sidebar-link">
            Logout
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;