import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, LayoutGrid, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCampaigns: 0,
        totalDonations: 0,
        totalFunds: 0,
        recentDonations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {loading ? (
                    <div>Loading stats...</div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
                            <StatCard title="Total Campaigns" value={stats.totalCampaigns} icon={LayoutGrid} color="bg-indigo-500" />
                            <StatCard title="Total Donations" value={stats.totalDonations} icon={Heart} color="bg-rose-500" />
                            <StatCard title="Total Raised" value={`₹${stats.totalFunds.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" />
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {stats.recentDonations?.map((donation) => (
                                    <div key={donation._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                                                {donation.donor?.name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{donation.donor?.name || 'Anonymous'}</p>
                                                <p className="text-sm text-gray-500">donated to <span className="text-indigo-600">{donation.campaign?.title}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">+₹{donation.amount}</p>
                                            <p className="text-xs text-gray-400">{new Date(donation.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Reuse Heart icon by importing it properly or passing it
import { Heart } from 'lucide-react';

export default AdminDashboard;
