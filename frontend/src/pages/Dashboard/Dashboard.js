import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Overview from './Overview';
import CourierService from './CourierService/CourierService';
import SupplierManagement from './SupplierManagement';
import SupplyOrders from './SupplyOrders';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const userDetails = localStorage.getItem('user');
    if (!userDetails) {
      const fetchUser = async () => {
        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
          credentials: 'include',
        });
        if (res.ok) {
          const user = await res.json();
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
        else {
          navigate('/');
        }
      }
      fetchUser();
    }
    else {
      setUser(JSON.parse(userDetails));
    }
  }, [BACKEND_URL, navigate]);
  
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar userRole={user?.role} />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <Routes>
            {/* Default Route Redirects to Overview */}
            <Route path="/" element={<Navigate to="overview" />} />
            {/* Overview Route */}
            <Route path="overview" element={<Overview />} />
            {/* Couriers Route */}
            {user?.role === 'Courier Service' && <Route path="couriers" element={<CourierService />} />}
            {/* Suppliers Route */}
            {user?.role === 'Inventory Manager' && <Route path="suppliers" element={<SupplierManagement />} />}
            {/* Supply Orders Route */}
            {user?.role === 'Supplier' && <Route path="supply-orders" element={<SupplyOrders />} />}
          </Routes>
        </div>
      </div>
    </div>)
};

export default Dashboard;