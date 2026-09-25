import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaEnvelopeOpen,
  FaPhone,
  FaTrash,
} from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const STATUSES = [
  { key: 'NEW',       label: 'New',       style: 'bg-[#E30613] text-white' },
  { key: 'READ',      label: 'Read',      style: 'bg-zinc-200 text-zinc-700' },
  { key: 'RESPONDED', label: 'Responded', style: 'bg-emerald-100 text-emerald-700' },
  { key: 'ARCHIVED',  label: 'Archived',  style: 'bg-zinc-100 text-zinc-500' },
];

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [enquiry, setEnquiry] = useState(location?.state?.enquiry || null);
  const [loading, setLoading] = useState(!location?.state?.enquiry);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!enquiry) load();
    else markAsRead();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`${ADMIN}/enquiries/${id}`);
      if (result?.success) setEnquiry(result.payload);
    } catch (e) {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead() {
    if (enquiry?.status !== 'NEW') return;
    try {
      await apiFetch(`${ADMIN}/enquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'READ' }),
      });
      setEnquiry((prev) => (prev ? { ...prev, status: 'READ' } : prev));
    } catch (e) {
      // silently fail
    }
  }

  async function updateStatus(status) {
    setUpdating(true);
    try {
      const result = await apiFetch(`${ADMIN}/enquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (result?.success) {
        setEnquiry((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    try {
      const result = await apiFetch(`${ADMIN}/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (result?.success) navigate('/user/admin/enquiries');
      else alert(result?.message || 'Failed to delete');
    } catch (e) {
      alert('Network error');
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading enquiry…</div>
    );
  }

  if (!enquiry) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500 mb-4">Enquiry not found.</p>
        <button
          onClick={() => navigate('/user/admin/enquiries')}
          className="text-[#E30613] font-bold hover:underline"
        >
          ← Back to enquiries
        </button>
      </div>
    );
  }

  const currentStatus = STATUSES.find((s) => s.key === enquiry.status) || STATUSES[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${currentStatus.style}`}
          >
            {enquiry.status === 'NEW' && <FaEnvelope size={10} />}
            {enquiry.status === 'READ' && <FaEnvelopeOpen size={10} />}
            {enquiry.status === 'RESPONDED' && <FaCheckCircle size={10} />}
            {currentStatus.label}
          </span>

          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <FiClock size={10} />
            Received{' '}
            {new Date(enquiry.createdAt).toLocaleString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <FaTrash size={10} />
          Delete
        </button>
      </div>

      {/* Sender card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mb-5">
        <h1 className="text-lg sm:text-xl font-extrabold text-zinc-900 mb-4">
          {enquiry.subject || 'General enquiry'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              From
            </p>
            <p className="text-sm font-semibold text-zinc-900">
              {enquiry.name || 'Unknown sender'}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Email
            </p>
            <a
              href={`mailto:${enquiry.email}`}
              className="text-sm font-medium text-[#E30613] hover:underline break-all"
            >
              {enquiry.email || '—'}
            </a>
          </div>

          {enquiry.phone && (
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Phone
              </p>
              <a
                href={`tel:${enquiry.phone}`}
                className="text-sm font-medium text-zinc-900 hover:text-[#E30613] flex items-center gap-1.5"
              >
                <FaPhone size={10} />
                {enquiry.phone}
              </a>
            </div>
          )}

          {enquiry.company && (
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Company
              </p>
              <p className="text-sm text-zinc-900">{enquiry.company}</p>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mb-5">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
          Message
        </h2>
        <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line break-words">
          {enquiry.message || '—'}
        </div>
      </div>

      {/* Status actions */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mb-5">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
          Update status
        </h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => updateStatus(s.key)}
              disabled={updating || enquiry.status === s.key}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                enquiry.status === s.key
                  ? 'bg-zinc-900 text-white cursor-default'
                  : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400 disabled:opacity-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reply CTA */}
      <div className="bg-zinc-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold mb-1">Reply to this enquiry</h3>
          <p className="text-sm text-zinc-400">
            Opens your email client with the sender's address prefilled.
          </p>
        </div>
        <a
          href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(
            enquiry.subject || 'Your enquiry'
          )}`}
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <FaEnvelope size={12} />
          Reply by email
        </a>
      </div>
    </div>
  );
}