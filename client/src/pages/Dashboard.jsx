import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import CampaignCard from '../components/CampaignCard'; // Assuming we can reuse it or make a variant
import { LayoutDashboard, Heart } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('campaigns');
    const [campaigns, setCampaigns] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'campaigns') {
                    // In a real app we might filter by creator on backend or here. 
                    // The backend /campaigns endpoint returns all. We probably need a way to filter or just filter on client for now.
                    // Wait, I didn't make a "my-campaigns" endpoint. 
                    // I'll cheat and fetch all and filter client side for this prototype, or better, add the query param if useful.
                    // Actually I implemented `creator` ref, so I can filter.
                    // But lets use the general list for now and filter.
                    const { data } = await api.get('/campaigns');
                    const myCampaigns = data.filter(c => c.creator._id === user._id || c.creator === user._id);
                    setCampaigns(myCampaigns);
                } else {
                    const { data } = await api.get('/donations/my-donations');
                    setDonations(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, user._id]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('campaigns')}
                        className={`pb-4 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'campaigns' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutDashboard size={20} /> My Campaigns
                    </button>
                    <button
                        onClick={() => setActiveTab('donations')}
                        className={`pb-4 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'donations' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Heart size={20} /> My Donations
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div>
                        {activeTab === 'campaigns' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {campaigns.length > 0 ? (
                                    campaigns.map(campaign => (
                                        <CampaignCard key={campaign._id} campaign={campaign} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'donations' && (
                            <div className="space-y-4">
                                {donations.length > 0 ? (
                                    donations.map(donation => (
                                        <div key={donation._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img src={donation.campaign?.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{donation.campaign?.title}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-emerald-600">+₹{donation.amount}</p>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <p className="text-gray-500">You haven't made any donations yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
