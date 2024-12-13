import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Overview from './Overview';
import Couriers from './Couriers';

const Dashboard = () => (
  <Container fluid>
    <Row>
      {/* Sidebar */}
      <Col xs={12} md={3} lg={2} className="p-0">
        <Sidebar />
      </Col>

      {/* Main Content */}
      <Col xs={12} md={9} lg={10} className="p-4">
        <Routes>
          {/* Default Route Redirects to Overview */}
          <Route path="/" element={<Navigate to="overview" />} />
          {/* Overview Route */}
          <Route path="overview" element={<Overview />} />
          {/* Couriers Route */}
          <Route path="couriers" element={<Couriers />} />
        </Routes>
      </Col>
    </Row>
  </Container>
);

export default Dashboard;