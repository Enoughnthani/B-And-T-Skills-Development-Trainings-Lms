import { useState } from 'react';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaCalendarAlt, 
    FaVenusMars, 
    FaIdCard, 
    FaEdit, 
    FaSave, 
    FaTimes,
    FaSignOutAlt,
    FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProgramManagerProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate()
    const [profile, setProfile] = useState(user);

    const [formData, setFormData] = useState({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        contactNumber: profile.contactNumber,
        dob: profile.dob,
        gender: profile.gender,
        idNo: profile.idNo
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            firstname: profile.firstname,
            lastname: profile.lastname,
            email: profile.email,
            contactNumber: profile.contactNumber,
            dob: profile.dob,
            gender: profile.gender,
            idNo: profile.idNo
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setTimeout(() => {
            setProfile({ ...profile, ...formData });
            setIsEditing(false);
            setSaving(false);
        }, 500);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white h-screen p-3">
            <div className="max-w-5xl mx-auto">
              
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                                    {profile.firstname?.[0]}{profile.lastname?.[0]}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {profile.firstname} {profile.lastname}
                                    </h1>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-sm text-gray-500">{profile.role?.[0]}</span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-green-600">{profile.status}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors text-sm"
                                >
                                    <FaEdit size={14} />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm"
                                    >
                                        <FaTimes size={14} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors text-sm disabled:opacity-50"
                                    >
                                        <FaSave size={14} />
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                        
                        {!isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-500">Full Name</label>
                                    <p className="text-gray-900 mt-1">{profile.firstname} {profile.lastname}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="text-gray-900 mt-1">{profile.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Phone Number</label>
                                    <p className="text-gray-900 mt-1">{profile.contactNumber}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Date of Birth</label>
                                    <p className="text-gray-900 mt-1">{formatDate(profile.dob)}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Gender</label>
                                    <p className="text-gray-900 mt-1">{profile.gender}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">ID Number</label>
                                    <p className="text-gray-900 mt-1">{profile.idNo}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                                    <input
                                        type="text"
                                        name="idNo"
                                        value={formData.idNo}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Activity Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Activity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-500">Member Since</label>
                                <p className="text-gray-900 mt-1">{formatDate(profile.createdAt)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Last Login</label>
                                <p className="text-gray-900 mt-1">{formatDateTime(profile.lastLogin)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Previous Login</label>
                                <p className="text-gray-900 mt-1">{formatDateTime(profile.prevLogin)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Account Status</label>
                                <p className="text-gray-900 mt-1 capitalize">{profile.status?.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}