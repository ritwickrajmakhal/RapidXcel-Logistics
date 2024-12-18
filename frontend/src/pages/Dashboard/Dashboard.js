import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Overview from './Overview';
import CourierService from './CourierService/CourierService';

const Dashboard = () => (
  <div className="container-fluid">
    <div className="row">
      {/* Sidebar */}
      <div className="col-12 col-md-3 col-lg-2 p-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="col-12 col-md-9 col-lg-10 p-4">
        <Routes>
          {/* Default Route Redirects to Overview */}
          <Route path="/" element={<Navigate to="overview" />} />
          {/* Overview Route */}
          <Route path="overview" element={<Overview />} />
          {/* Couriers Route */}
          <Route path="couriers" element={<CourierService />} />
        </Routes>
      </div>
    </div>
  </div>
);

export default Dashboard;