import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home/Home';
import Logout from './components/Logout';
import ResetPassword from './pages/Home/ResetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        {/* Logout Route */}
        <Route path="logout" element={<Logout />} />
      </Routes>
      <ToastContainer position='bottom-right' />
    </>
  );
}

export default App;
