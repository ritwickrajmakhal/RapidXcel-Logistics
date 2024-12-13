import React, { useState } from 'react';
import { Navbar, Nav, Collapse, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="d-lg-none">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="sidebar-collapse"
          aria-expanded={open}
          className="m-2"
        >
          Menu
        </Button>
      </Navbar>
      <Collapse in={open} className="d-lg-none">
        <div id="sidebar-collapse" className="bg-dark text-white p-3">
          <h2 className="text-center">Dashboard</h2>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/dashboard/overview" className="text-white">
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/dashboard/couriers" className="text-white">
                Couriers
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Collapse>
      <div className="d-none d-lg-flex flex-column bg-dark text-white vh-100" style={{ width: '200px' }}>
        <div className="p-3">
          <h2 className="text-center">Dashboard</h2>
        </div>
        <Nav className="flex-column p-3">
          <Nav.Item>
            <Nav.Link as={Link} to="/dashboard/overview" className="text-white">
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/dashboard/couriers" className="text-white">
              Couriers
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;