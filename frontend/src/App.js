import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <ToastContainer position='bottom-right'/>
    </>
  );
}

export default App;
