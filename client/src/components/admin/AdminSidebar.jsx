import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Megaphone,
    IndianRupee,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
        { path: '/admin/donations', icon: IndianRupee, label: 'Donations' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-900 h-screen sticky top-0 text-white">
            <div className="p-6 flex items-center gap-2 border-b border-slate-800">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <ShieldCheck size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">AdminPanel</h1>
                    <p className="text-xs text-slate-400">CrowdFundX</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
