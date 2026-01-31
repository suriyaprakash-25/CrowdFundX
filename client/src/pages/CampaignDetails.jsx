import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Clock, User, Target, Share2, AlertCircle } from 'lucide-react';

const CampaignDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [donating, setDonating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const { data } = await api.get(`/campaigns/${id}`);
                setCampaign(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleDonate = async () => {
        if (!user) {
            alert('Please login to donate');
            return;
        }
        if (!amount || amount <= 0) return;

        setDonating(true);
        setError('');

        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load');
                setDonating(false);
                return;
            }

            // 1. Create Order
            const { data: order } = await api.post('/donations/create-order', { amount });

            // 2. Initialize Options
            const options = {
                key: 'rzp_test_SALkRPgaq87Ay7', // Using provided test key
                amount: order.amount,
                currency: order.currency,
                name: 'CrowdFundX',
                description: `Donation for ${campaign.title}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await api.post('/donations/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            campaignId: campaign._id,
                            amount: amount
                        });
                        alert('Donation Successful!');
                        // Refresh campaign data
                        const { data } = await api.get(`/campaigns/${id}`);
                        setCampaign(data);
                        setAmount('');
                    } catch (error) {
                        console.error(error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#4F46E5',
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            setError('Something went wrong during donation');
        } finally {
            setDonating(false);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    if (!campaign) return <div className="min-h-screen flex justify-center items-center">Campaign not found</div>;

    const percent = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
    const daysLeft = Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Image & Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <img
                            src={campaign.image || 'https://via.placeholder.com/800x400'}
                            alt={campaign.title}
                            className="w-full h-96 object-cover"
                        />
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-indigo-100 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {campaign.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${daysLeft > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {daysLeft > 0 ? 'Active' : 'Ended'}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>

                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {campaign.description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Organizer</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                                <User className="text-gray-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{campaign.creator?.name || 'Unknown'}</p>
                                <p className="text-gray-500 text-sm">Campaign Organizer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Donation Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-indigo-50">
                        <div className="mb-6">
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Raised</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-gray-900">₹{campaign.raisedAmount.toLocaleString()}</span>
                                <span className="text-gray-500 mb-2">of ₹{campaign.goalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-6">
                            <div
                                className="bg-primary h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 flex items-center gap-1"><Target size={14} /> Goal</span>
                                <span className="font-semibold text-gray-900">₹{campaign.goalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-gray-500 flex items-center gap-1 justify-end"><Clock size={14} /> Time Left</span>
                                <span className="font-semibold text-gray-900">{daysLeft > 0 ? `${daysLeft} days` : 'Ended'}</span>
                            </div>
                        </div>

                        {daysLeft > 0 ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-bold text-lg"
                                    />
                                </div>

                                <button
                                    onClick={handleDonate}
                                    disabled={donating}
                                    className="w-full btn-primary py-4 rounded-xl text-lg font-bold shadow-lg shadow-indigo-200"
                                >
                                    {donating ? 'Processing...' : 'Donate Now'}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-xl text-center text-gray-500 font-medium">
                                This campaign has ended.
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <button className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary font-medium w-full transition-colors">
                                <Share2 size={18} /> Share this campaign
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CampaignDetails;
