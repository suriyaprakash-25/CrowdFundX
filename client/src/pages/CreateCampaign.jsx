import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, Calendar, DollarSign, Tag, Type } from 'lucide-react';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalAmount: '',
        category: 'Education',
        deadline: '',
        image: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/campaigns', formData);
            navigate('/');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">Start a Campaign</h2>
                    <p className="text-indigo-100 mt-1">Fill in the details to begin your fundraising journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Type size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="input-field pl-10"
                                    placeholder="e.g. Help build a community library"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (₹)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="goalAmount"
                                        required
                                        className="input-field pl-10"
                                        placeholder="50000"
                                        value={formData.goalAmount}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag size={18} className="text-gray-400" />
                                    </div>
                                    <select
                                        name="category"
                                        className="input-field pl-10 appearance-none bg-white"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="Medical">Medical</option>
                                        <option value="Education">Education</option>
                                        <option value="Environment">Environment</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Community">Community</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="deadline"
                                    required
                                    className="input-field pl-10"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Upload size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    name="image"
                                    className="input-field pl-10"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.image}
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Provide a direct link to an image (optional)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows="5"
                                required
                                className="input-field py-3"
                                placeholder="Tell your story..."
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-8 py-3 rounded-xl disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Launch Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;
