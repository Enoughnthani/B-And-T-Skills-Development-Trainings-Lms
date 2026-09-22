import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
    FaArrowLeft,
    FaEdit,
    FaSave,
    FaTimes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const { showResponse } = useApiResponse();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const result = await apiFetch('/api/users/profile');
            if (result.success) {
                setProfile(result.payload);
                setFormData({
                    firstname: result.payload?.firstname || '',
                    lastname: result.payload?.lastname || '',
                    email: result.payload?.email || '',
                    contactNumber: result.payload?.contactNumber || '',
                    idNo: result.payload?.idNo || '',
                    password: ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setFormData({
            firstname: profile?.firstname || '',
            lastname: profile?.lastname || '',
            email: profile?.email || '',
            contactNumber: profile?.contactNumber || '',
            idNo: profile?.idNo || '',
            password: ''
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            firstname: profile?.firstname || '',
            lastname: profile?.lastname || '',
            email: profile?.email || '',
            contactNumber: profile?.contactNumber || '',
            idNo: profile?.idNo || '',
            password: ''
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);

        const updateData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            contactNumber: formData.contactNumber,
            idNo: formData.idNo,
            ...(formData.password && formData.password.trim() !== '' && { password: formData.password })
        };

        try {
            const result = await apiFetch('/api/users/profile', {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });

            if (result.success) {
                setProfile(result.payload);

                if (refreshUser) {
                    await refreshUser();
                }

                setFormData({
                    firstname: result.payload?.firstname || '',
                    lastname: result.payload?.lastname || '',
                    email: result.payload?.email || '',
                    contactNumber: result.payload?.contactNumber || '',
                    idNo: result.payload?.idNo || '',
                    password: ''
                });

                setIsEditing(false);
                showResponse(result);
            } else {
                showResponse(result);
            }
        } catch (error) {
            showResponse({ success: false, message: error.message });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-full h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-red-500">Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white h-screen p-6">
            <div className="mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="group bg-white p-2 rounded flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 group-hover:border-gray-300 group-hover:shadow-sm transition-all">
                        <FaArrowLeft size={12} />
                    </div>
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                                    {profile?.firstname?.[0]}{profile?.lastname?.[0]}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {profile?.firstname} {profile?.lastname}
                                    </h1>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-sm text-gray-500">{profile?.role}</span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-green-600">{profile?.status}</span>
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
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm disabled:opacity-50"
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

                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>

                        {!isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-500">First Name</label>
                                    <p className="text-gray-900 mt-1">{profile?.firstname}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Last Name</label>
                                    <p className="text-gray-900 mt-1">{profile?.lastname}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email Address</label>
                                    <p className="text-gray-900 mt-1">{profile?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Phone Number</label>
                                    <p className="text-gray-900 mt-1">{profile?.contactNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Identification Number (RSA ID)</label>
                                    <p className="text-gray-900 mt-1">{profile?.idNo || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Date of Birth</label>
                                    <p className="text-gray-900 mt-1">{formatDate(profile?.dob)}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Gender</label>
                                    <p className="text-gray-900 mt-1">{profile?.gender}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter email address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Identification Number (RSA ID) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="idNo"
                                        value={formData.idNo || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter identification number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter new password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Leave blank to keep current password</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Activity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-500">Date of Birth</label>
                                <p className="text-gray-900 mt-1">{formatDate(profile?.dob)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Gender</label>
                                <p className="text-gray-900 mt-1">{profile?.gender}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Member Since</label>
                                <p className="text-gray-900 mt-1">{formatDate(profile?.createdAt)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Last Login</label>
                                <p className="text-gray-900 mt-1">{formatDateTime(profile?.lastLogin)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Previous Login</label>
                                <p className="text-gray-900 mt-1">{formatDateTime(profile?.prevLogin)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Account Status</label>
                                <p className="text-gray-900 mt-1 capitalize">{profile?.status?.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}