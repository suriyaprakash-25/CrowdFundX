import { useState, useEffect } from 'react';
import api from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter } from 'lucide-react';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                let query = `/campaigns?sort=${sort}`;
                if (search) query += `&search=${search}`;
                if (category) query += `&category=${category}`;

                const { data } = await api.get(query);
                setCampaigns(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            fetchCampaigns();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, category, sort]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Explore Campaigns</h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Medical">Medical</option>
                                <option value="Education">Education</option>
                                <option value="Environment">Environment</option>
                                <option value="Technology">Technology</option>
                                <option value="Community">Community</option>
                            </select>

                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="raised">Most Funded</option>
                                <option value="deadline">Ending Soon</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.length > 0 ? (
                            campaigns.map(campaign => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500 text-lg">No campaigns found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Campaigns;
