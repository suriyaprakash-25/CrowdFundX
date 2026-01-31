import { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DonationsPage = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = async () => {
        try {
            const { data } = await api.get('/admin/donations');
            setDonations(data);
        } catch (error) {
            toast.error('Failed to load donations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Donation Monitoring</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Donor</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Date</th>
                            <th className="px-6 py-4 text-center">Flags</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                        ) : donations.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8">No donations found</td></tr>
                        ) : (
                            donations.map((donation) => (
                                <tr key={donation._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{donation.paymentId || 'N/A'}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{donation.donor?.name || 'Anonymous'}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{donation.campaign?.title}</td>
                                    <td className="px-6 py-4 text-right font-bold text-indigo-600">₹{donation.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        {donation.isSuspicious && (
                                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                                                <AlertCircle size={12} /> High Value
                                            </span>
                                        )}
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

export default DonationsPage;
