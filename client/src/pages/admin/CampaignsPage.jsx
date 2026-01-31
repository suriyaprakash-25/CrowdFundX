import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/admin/campaigns');
            setCampaigns(data);
        } catch (error) {
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            // Usually we would update isApproved=true and status='active' together
            await api.put(`/admin/campaigns/${id}/status`, { status });
            setCampaigns(campaigns.map(c => c._id === id ? { ...c, status } : c));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this campaign?')) return;
        try {
            await api.delete(`/admin/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c._id !== id));
            toast.success('Campaign deleted');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Campaign Management</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Creator</th>
                            <th className="px-6 py-4 text-right">Goal / Raised</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                        ) : campaigns.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8">No campaigns found</td></tr>
                        ) : (
                            campaigns.map((campaign) => (
                                <tr key={campaign._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate" title={campaign.title}>{campaign.title}</td>
                                    <td className="px-6 py-4">{campaign.creator?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-slate-900 font-medium">₹{campaign.goalAmount.toLocaleString()}</div>
                                        <div className="text-indigo-600 text-xs font-bold">₹{campaign.raisedAmount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                                                campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Actions */}
                                            <button
                                                onClick={() => updateStatus(campaign._id, 'active')}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                                title="Approve / Set Active"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(campaign._id, 'expired')}
                                                className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                                title="Reject / Expire"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(campaign._id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CampaignsPage;
