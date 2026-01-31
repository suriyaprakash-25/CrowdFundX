import { Link } from 'react-router-dom';
import { Clock, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CampaignCard = ({ campaign }) => {
    const percent = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
    const daysLeft = Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={campaign.image || 'https://via.placeholder.com/600x400'}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wide">
                        {campaign.category}
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                    <Link to={`/campaigns/${campaign._id}`}>
                        {campaign.title}
                    </Link>
                </h3>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                    {campaign.description}
                </p>

                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-secondary to-green-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <span className="block font-bold text-gray-900 text-lg">₹{campaign.raisedAmount.toLocaleString()}</span>
                            <span className="text-gray-500 text-xs">raised of ₹{campaign.goalAmount.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-gray-900 text-lg">{Math.round(percent)}%</span>
                            <span className="text-gray-500 text-xs">funded</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-gray-500 text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>by {campaign.creator?.name || 'Anonymous'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CampaignCard;
