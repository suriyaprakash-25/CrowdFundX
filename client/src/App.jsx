import { Routes, Route, Outlet } from 'react-router-dom'; // HMR trigger
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Campaigns from './pages/Campaigns';

// Admin Imports
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import CampaignsPage from './pages/admin/CampaignsPage';
import DonationsPage from './pages/admin/DonationsPage';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<><Navbar /><div className="pt-0"></div><Outlet /></>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
          </Route>
        </Route>

        {/* Admin Routes (Sidebar Layout handled inside ProtectedAdminRoute) */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="donations" element={<DonationsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
