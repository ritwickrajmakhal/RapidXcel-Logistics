import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Overview from './Overview';
import CourierService from './CourierService/CourierService';
import SupplierManagement from './SupplierManagement';
import SupplyOrders from './SupplyOrders';
import { useEffect, useState } from 'react';
import StockManagement from './StockManagement/StockManagement';
import AddStock from './StockManagement/AddStock';
import UpdateStock from './StockManagement/UpdateStock';
import Analytics from './Analytics/Analytics';
import Products from "./OrderManagement/Products";
import OrderPreview from "./OrderManagement/OrderPreview";
import ConfirmOrder from "./OrderManagement/ConfirmOrder";
import Notifications from './CourierService/Notifications/Notifications';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${BACKEND_URL}/auth/profile`, {
        credentials: 'include',
      });
      if (res.ok) {
        const user = await res.json();
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    fetchUser();
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
            <Route
              path="overview"
              element={
                user?.role === "Inventory Manager" ? (
                  <Analytics />
                ) : (
                  <Overview />
                )
              }
            />
            {/* Couriers Route */}
            {user?.role === "Courier Service" && (
              <Route path="couriers" element={<CourierService user={user} />} />
            )}
            {/* Suppliers Route */}
            {user?.role === "Inventory Manager" && (
              <>
                <Route path="suppliers" element={<SupplierManagement />} />
                <Route path="stock-management" element={<StockManagement />} />
                <Route
                  path="stock-management/addStock"
                  element={<AddStock />}
                />
                <Route
                  path="stock-management/updateStock/:id"
                  element={<UpdateStock />}
                />
              </>
            )}
            {/* Supply Orders Route */}
            {user?.role === "Supplier" && (
              <Route path="supply-orders" element={<SupplyOrders />} />
            )}
            {/* Products Route */}
            {user?.role === "Customer" && (
              <>
                <Route path="products" element={<Products user={user} />} />
                <Route path="products/order-preview" element={<OrderPreview />} />
                <Route path="products/confirm-order" element={<ConfirmOrder />} />
                <Route path="notifications" element={<Notifications notifications={user.notifications} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
