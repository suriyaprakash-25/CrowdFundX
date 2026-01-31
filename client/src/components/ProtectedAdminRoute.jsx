import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminSidebar from './admin/AdminSidebar';

const ProtectedAdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar />
            <div className="flex-1 p-8 overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default ProtectedAdminRoute;
