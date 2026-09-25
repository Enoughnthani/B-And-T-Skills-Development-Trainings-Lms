import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const { showResponse } = useApiResponse();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await apiFetch('/api/users/profile');
      if (result.success) {
        setProfile(result.payload);
        seedForm(result.payload);
      }
    } catch (error) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const seedForm = (data) => {
    setFormData({
      firstname: data?.firstname || '',
      lastname: data?.lastname || '',
      email: data?.email || '',
      contactNumber: data?.contactNumber || '',
      idNo: data?.idNo || '',
      password: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    seedForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    seedForm(profile);
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
      ...(formData.password && formData.password.trim() !== '' && {
        password: formData.password,
      }),
    };

    try {
      const result = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (result.success) {
        setProfile(result.payload);
        if (refreshUser) await refreshUser();
        seedForm(result.payload);
        setIsEditing(false);
      }
      showResponse(result);
    } catch (error) {
      showResponse({ success: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const getInitials = () => {
    const first = profile?.firstname?.[0] || '';
    const last = profile?.lastname?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading profile…</div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto w-full">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      {/* ============================================================
          IDENTITY CARD
          ============================================================ */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-5">

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            {/* Avatar + name + role */}
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
                {getInitials()}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-extrabold text-zinc-900 truncate">
                  {profile?.firstname} {profile?.lastname}
                </h1>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <span className="text-xs sm:text-sm text-zinc-500">
                    {profile?.role}
                  </span>
                  <span className="text-zinc-300 hidden sm:inline">•</span>
                  <span
                    className={`text-xs sm:text-sm font-medium capitalize ${
                      profile?.status === 'ACTIVE'
                        ? 'text-emerald-600'
                        : profile?.status === 'INACTIVE'
                        ? 'text-zinc-500'
                        : 'text-red-600'
                    }`}
                  >
                    {profile?.status?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <FaEdit size={12} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex-1 sm:flex-none"
                  >
                    <FaTimes size={12} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex-1 sm:flex-none"
                  >
                    <FaSave size={12} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body — view mode */}
        {!isEditing ? (
          <div className="p-4 sm:p-6">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="First Name"     value={profile?.firstname} />
              <Field label="Last Name"      value={profile?.lastname} />
              <Field label="Email Address"  value={profile?.email} />
              <Field label="Phone Number"   value={profile?.contactNumber || 'N/A'} />
              <Field label="ID Number"      value={profile?.idNo || 'N/A'} mono />
              <Field label="Date of Birth"  value={formatDate(profile?.dob)} />
              <Field label="Gender"         value={profile?.gender} />
            </div>
          </div>
        ) : (
          /* Body — edit mode */
          <div className="p-4 sm:p-6 space-y-4">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
              <FormField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                required
                className="sm:col-span-2"
              />
              <FormField
                label="Phone Number"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="0XX XXX XXXX"
                required
              />
              <FormField
                label="ID Number (RSA)"
                name="idNo"
                value={formData.idNo}
                onChange={handleInputChange}
                placeholder="13-digit ID"
                mono
              />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none transition-colors"
                />
                <p className="text-xs text-zinc-400 mt-1.5">
                  Only fill this if you want to change your password.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          ACCOUNT ACTIVITY
          ============================================================ */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
          Account Activity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Member Since"  value={formatDate(profile?.createdAt)} />
          <Field label="Last Login"    value={formatDateTime(profile?.lastLogin)} />
          <Field label="Previous Login" value={formatDateTime(profile?.prevLogin)} />
          <Field
            label="Account Status"
            value={
              <span
                className={`inline-block text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  profile?.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {profile?.status || 'UNKNOWN'}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function Field({ label, value, mono = false }) {
  return (
    <div className="min-w-0">
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className={`text-sm text-zinc-900 break-words ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  mono = false,
  className = '',
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label}
        {required && <span className="text-[#E30613] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none transition-colors ${
          mono ? 'font-mono' : ''
        }`}
      />
    </div>
  );
}