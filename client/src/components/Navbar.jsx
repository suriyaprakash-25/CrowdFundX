import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Menu, X, Heart, User, LogOut, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                            C
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-800">
                            CrowdFund<span className="text-primary">X</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary transition font-medium">
                            Home
                        </Link>
                        <Link to="/campaigns" className="text-gray-600 hover:text-primary transition font-medium">
                            Explore
                        </Link>

                        {user ? (
                            <>
                                <Link to="/create-campaign" className="btn-primary py-2 px-4 rounded-full text-sm">
                                    <PlusCircle size={18} />
                                    Start Campaign
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-primary transition focus:outline-none"
                                        title="User Menu"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold border-2 border-transparent hover:border-indigo-200">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    {isProfileOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsProfileOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in z-20">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <User size={16} /> Dashboard
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <User size={16} /> Admin Panel
                                                    </Link>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn-primary py-2 px-5 rounded-full shadow-lg shadow-indigo-200">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary focus:outline-none p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">
                                Home
                            </Link>
                            <Link to="/campaigns" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">
                                Explore Campaigns
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/create-campaign" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-primary bg-indigo-50 font-semibold">
                                        + Start a Campaign
                                    </Link>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">
                                        Dashboard
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                                        Log in
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:bg-indigo-700">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
