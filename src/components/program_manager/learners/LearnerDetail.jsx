import { apiFetch } from '@/api/api';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const STATUS_STYLES = {
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  COMPLETED: 'bg-zinc-900 text-white',
  WITHDRAWN: 'bg-red-50 text-[#E30613]',
  ON_HOLD: 'bg-zinc-100 text-zinc-500',
};

const POE_STYLES = {
  COMPLETE: 'bg-zinc-900 text-white',
  SUBMITTED: 'bg-zinc-100 text-zinc-700',
  PENDING: 'bg-zinc-100 text-zinc-500',
  OVERDUE: 'bg-red-50 text-[#E30613]',
};

export default function LearnerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [learner, setLearner] = useState(location?.state?.learner || null);
  const [loading, setLoading] = useState(!location?.state?.learner);

  useEffect(() => {
    if (!learner) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`/api/program-manager/learners/${id}`);
      if (result?.success) setLearner(result.payload);
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading learner…</div>;
  }

  if (!learner) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500 mb-4">Learner not found.</p>
        <button
          onClick={() => navigate('/user/program-manager/learners')}
          className="text-[#E30613] font-bold hover:underline"
        >
          Back to learners
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {(learner.firstname?.[0] || '') + (learner.lastname?.[0] || '')}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1 truncate">
              {learner.firstname} {learner.lastname}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm text-zinc-500 truncate">{learner.email}</span>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  STATUS_STYLES[learner.status] || 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {(learner.status || '').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Progress
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">
            {learner.progress || 0}%
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#E30613] transition-all"
              style={{ width: `${learner.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Assessments
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">
            {learner.assessmentsPassed || 0}
            <span className="text-sm font-bold text-zinc-400">
              /{learner.assessmentsTotal || 0}
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            PoE
          </div>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
              POE_STYLES[learner.poeStatus] || 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {learner.poeStatus || 'PENDING'}
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Last activity
          </div>
          <div className="text-sm font-bold text-zinc-900">
            {learner.lastActivity
              ? new Date(learner.lastActivity).toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            Enrolment
          </h2>
          <div className="space-y-3">
            <Row label="Programme" value={learner.programme} />
            <Row label="Cohort" value={learner.cohort} />
            <Row label="Facilitator" value={learner.facilitator} />
            <Row label="Assessor" value={learner.assessor} />
            <Row label="Mentor" value={learner.mentor} />
            <Row
              label="Enrolled"
              value={
                learner.enrolledAt
                  ? new Date(learner.enrolledAt).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : null
              }
            />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            Contact
          </h2>
          <div className="space-y-3">
            <Row label="Email" value={learner.email} />
            <Row label="Phone" value={learner.contactNumber} />
            <Row label="ID number" value={learner.idNo} mono />
            <Row label="Location" value={learner.location} />
          </div>
        </div>

      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mt-5">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
          Assessments
        </h2>
        {learner.assessments?.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {learner.assessments.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-900 truncate">
                    {a.name}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {a.date
                      ? new Date(a.date).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                    a.outcome === 'PASS'
                      ? 'bg-zinc-900 text-white'
                      : a.outcome === 'FAIL'
                      ? 'bg-red-50 text-[#E30613]'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {a.outcome || 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No assessments yet.</p>
        )}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mt-5">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
          Workplace visits
        </h2>
        {learner.workplaceVisits?.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {learner.workplaceVisits.map((v, i) => (
              <div key={i} className="py-3">
                <div className="text-sm font-bold text-zinc-900">
                  {v.date
                    ? new Date(v.date).toLocaleDateString('en-ZA', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Visited by {v.visitor || '—'}
                </div>
                {v.notes && (
                  <p className="text-sm text-zinc-600 mt-1.5">{v.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No workplace visits recorded.</p>
        )}
      </div>

    </div>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className={`text-sm text-zinc-900 break-words ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </div>
    </div>
  );
}