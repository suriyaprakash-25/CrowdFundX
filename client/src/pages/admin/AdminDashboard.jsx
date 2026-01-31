import {
    Users,
    Megaphone,
    CheckCircle,
    IndianRupee,
    Clock,
    TrendingUp
} from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Mock pie data since backend aggregation is simple
    const pieData = [
        { name: 'Active', value: stats.activeCampaigns },
        { name: 'Completed', value: stats.completedCampaigns },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                    <p className="text-slate-500">Welcome back, Admin</p>
                </div>
                <div className="text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Funds Raised"
                    value={`₹${stats.totalFunds.toLocaleString()}`}
                    icon={IndianRupee}
                    color="bg-indigo-500"
                    trend={12.5}
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                    trend={5.2}
                />
                <StatsCard
                    title="Active Campaigns"
                    value={stats.activeCampaigns}
                    subValue={`/ ${stats.totalCampaigns} total`}
                    icon={Megaphone}
                    color="bg-orange-500"
                />
                <StatsCard
                    title="Total Donations"
                    value={stats.totalDonations}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    trend={8.4}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-6">Donation Trends (Last 6 Months)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#F1F5F9' }}
                                />
                                <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-6">Campaign Status</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Recent Transactions</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-4">Donor</th>
                                <th className="px-6 py-4">Campaign</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Date</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recentTransactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{tx.donor?.name || 'Anonymous'}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{tx.campaign?.title}</td>
                                    <td className="px-6 py-4 text-right font-bold text-indigo-600">₹{tx.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-semibold">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
