import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { ArrowRight, TrendingUp, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const { data } = await api.get('/campaigns?limit=6');
                setCampaigns(data.slice(0, 6)); // Just take first 6
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <section className="relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white/0 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24 md:pt-32 md:pb-32">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="md:w-1/2 space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 min-w-max">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">CrowdFundX Platform</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                                Fund the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Future</span> You Believe In
                            </h1>
                            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                                Join our community of changemakers. Create a campaign for your cause or support others to make a massive impact today.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to="/campaigns" className="btn-primary text-lg px-8 py-3.5 rounded-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    Browse Campaigns
                                </Link>
                                <Link to="/create-campaign" className="btn-secondary text-lg px-8 py-3.5 rounded-full hover:bg-white hover:text-indigo-700 hover:-translate-y-1 transition-all border-2">
                                    Start Fundraising
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 pt-8 text-gray-500 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-500" size={20} />
                                    <span>Secure Payments</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-blue-500" size={20} />
                                    <span>Transparent Funds</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="text-rose-500" size={20} />
                                    <span>Verified Causes</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="md:w-1/2 relative"
                        >
                            <div className="relative z-10 bg-white p-2 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-100">
                                <img
                                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    alt="Volunteers"
                                    className="rounded-2xl w-full h-80 object-cover"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Raised</p>
                                        <p className="text-xl font-bold text-gray-900">₹1.2M+</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Campaigns</h2>
                        <p className="text-gray-500 mt-2">Support causes that matter to you</p>
                    </div>
                    <Link to="/campaigns" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        View all <ArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.length > 0 ? (
                            campaigns.map((campaign) => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No campaigns found yet. Be the first to start one!</p>
                                <Link to="/create-campaign" className="inline-block mt-4 btn-primary">Start Campaign</Link>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* How it works */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-16">How CrowdFundX Works</h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="relative p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 text-2xl font-bold">1</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Create a Campaign</h3>
                            <p className="text-gray-500">Share your story, set a goal, and add a compelling image to get started.</p>
                        </div>

                        <div className="relative p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6 text-2xl font-bold">2</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Share & Connect</h3>
                            <p className="text-gray-500">Spread the word to friends, family, and our community to gain support.</p>
                        </div>

                        <div className="relative p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 text-2xl font-bold">3</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Funds</h3>
                            <p className="text-gray-500">Collect donations securely and transparently to achieve your goal.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
