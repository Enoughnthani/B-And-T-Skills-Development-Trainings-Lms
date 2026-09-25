import { apiFetch } from '@/api/api';
import { ArrowLeft, Download, Edit, RotateCcw, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';

const STATUS_STYLES = {
  DRAFT: 'bg-zinc-100 text-zinc-500',
  SCHEDULED: 'bg-zinc-100 text-zinc-700',
  OPEN: 'bg-red-50 text-[#E30613]',
  CLOSED: 'bg-zinc-100 text-zinc-700',
  FINALISED: 'bg-zinc-900 text-white',
};

const OUTCOME_STYLES = {
  PASS: 'bg-zinc-900 text-white',
  FAIL: 'bg-red-50 text-[#E30613]',
  PENDING: 'bg-zinc-100 text-zinc-500',
  RESUBMIT: 'bg-zinc-100 text-zinc-700',
  NOT_SUBMITTED: 'bg-zinc-100 text-zinc-400',
};

export default function AssessmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [assessment, setAssessment] = useState(location?.state?.assessment || null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(!location?.state?.assessment);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`/api/program-manager/assessments/${id}`);
      if (result?.success) {
        setAssessment(result.payload?.assessment || null);
        setSubmissions(result.payload?.submissions || []);
      }
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function performAction(action, payload = {}) {
    if (!confirm(`Are you sure you want to ${action.replace('-', ' ')}?`)) return;
    setActionLoading(action);
    try {
      const result = await apiFetch(`/api/program-manager/assessments/${id}/${action}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (result?.success) {
        await load();
      }
    } catch (error) {
      // ignore
    } finally {
      setActionLoading('');
    }
  }

  async function handleExport() {
    try {
      const response = await fetch(`/api/program-manager/assessments/${id}/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment_${id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      // ignore
    }
  }

  async function allowResubmit(learnerId) {
    try {
      const result = await apiFetch(
        `/api/program-manager/assessments/${id}/resubmit/${learnerId}`,
        { method: 'POST' }
      );
      if (result?.success) await load();
    } catch (error) {
      // ignore
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading assessment…</div>;
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500 mb-4">Assessment not found.</p>
        <button
          onClick={() => navigate('/user/program-manager/assessments')}
          className="text-[#E30613] font-bold hover:underline"
        >
          Back to assessments
        </button>
      </div>
    );
  }

  const submitted = submissions.filter((s) => s.outcome && s.outcome !== 'NOT_SUBMITTED').length;
  const passed = submissions.filter((s) => s.outcome === 'PASS').length;
  const failed = submissions.filter((s) => s.outcome === 'FAIL').length;
  const pending = submissions.filter((s) => !s.outcome || s.outcome === 'PENDING').length;

  const canClose = assessment.status === 'OPEN';
  const canReopen = assessment.status === 'CLOSED';
  const canFinalise = assessment.status === 'CLOSED';
  const isFinalised = assessment.status === 'FINALISED';

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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  STATUS_STYLES[assessment.status] || 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {assessment.status}
              </span>
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                {assessment.type}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1 truncate">
              {assessment.name}
            </h1>

            <p className="text-sm text-zinc-500">
              {assessment.programme}
              {assessment.cohort && ` · ${assessment.cohort}`}
              {assessment.module && ` · ${assessment.module}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              to={`/user/program-manager/assessments/${id}/edit`}
              state={{ assessment }}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors no-underline"
            >
              <Edit size={12} />
              Edit
            </Link>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={12} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatBox label="Enrolled" value={submissions.length} />
        <StatBox label="Submitted" value={submitted} />
        <StatBox label="Passed" value={passed} />
        <StatBox label="Failed" value={failed} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            Assessment details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Row label="Type" value={assessment.type} />
            <Row label="Due date" value={formatDate(assessment.dueDate)} />
            <Row label="Pass mark" value={assessment.passMark ? `${assessment.passMark}%` : null} />
            <Row label="Weight" value={assessment.weight ? `${assessment.weight}%` : null} />
            <Row label="Assessor" value={assessment.assessor} />
            <Row label="Created" value={formatDate(assessment.createdAt)} />
          </div>
          {assessment.description && (
            <div className="mt-5 pt-5 border-t border-zinc-100">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Description
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                {assessment.description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            Actions
          </h2>
          <div className="space-y-2">
            {canClose && (
              <ActionButton
                icon={X}
                label="Close assessment"
                description="Stop accepting submissions"
                onClick={() => performAction('close')}
                loading={actionLoading === 'close'}
              />
            )}

            {canReopen && (
              <ActionButton
                icon={RotateCcw}
                label="Reopen assessment"
                description="Allow late submissions"
                onClick={() => performAction('reopen')}
                loading={actionLoading === 'reopen'}
              />
            )}

            {canFinalise && (
              <ActionButton
                icon={Check}
                label="Finalise assessment"
                description="Lock outcomes permanently"
                onClick={() => performAction('finalise')}
                loading={actionLoading === 'finalise'}
              />
            )}

            <ActionButton
              icon={Send}
              label="Send reminder"
              description="Notify learners who haven't submitted"
              onClick={() => performAction('remind')}
              loading={actionLoading === 'remind'}
            />

            {isFinalised && (
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <p className="text-xs text-zinc-500 text-center leading-relaxed">
                  This assessment is finalised. No further actions can be taken.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              Learner submissions
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {submitted} submitted · {pending} pending
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center">
            <FaBullhorn className="text-zinc-300 text-2xl mx-auto mb-3" />
            <p className="text-sm text-zinc-500">
              No learners are enrolled on this assessment yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {submissions.map((s) => (
              <div
                key={s.learnerId}
                className="flex items-center gap-3 p-4 hover:bg-red-50/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {(s.firstname?.[0] || '') + (s.lastname?.[0] || '')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 text-sm truncate">
                    {s.firstname} {s.lastname}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {s.submittedAt
                      ? `Submitted ${formatDate(s.submittedAt)}`
                      : 'Not submitted yet'}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                    OUTCOME_STYLES[s.outcome || 'NOT_SUBMITTED']
                  }`}
                >
                  {(s.outcome || 'NOT SUBMITTED').replace('_', ' ')}
                </span>

                {s.outcome === 'FAIL' && !isFinalised && (
                  <button
                    onClick={() => allowResubmit(s.learnerId)}
                    className="text-xs font-bold text-[#E30613] hover:underline whitespace-nowrap"
                  >
                    Allow resubmit
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
      <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className={`text-xl sm:text-2xl font-extrabold tabular-nums ${
          accent ? 'text-[#E30613]' : 'text-zinc-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className={`text-sm text-zinc-900 break-words ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, description, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full text-left p-3.5 rounded-lg border border-zinc-200 hover:border-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="flex items-center gap-2 mb-0.5">
        <Icon size={12} className="text-zinc-500 group-hover:text-[#E30613] transition-colors" />
        <span className="text-sm font-bold text-zinc-900">
          {loading ? 'Working…' : label}
        </span>
      </div>
      <p className="text-[11px] text-zinc-500 leading-snug">{description}</p>
    </button>
  );
}

function formatDate(dateString) {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}