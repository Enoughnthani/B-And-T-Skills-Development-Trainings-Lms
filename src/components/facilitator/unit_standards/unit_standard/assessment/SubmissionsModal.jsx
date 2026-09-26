import { useEffect, useState } from 'react';
import { FaDownload, FaUserCircle } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';
import { assessmentService } from './services/AssessmentService';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function SubmissionsModal({ show, onHide, assessment }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && assessment) loadSubmissions();
    return () => {
      if (!show) {
        setSubmissions([]);
        setLoading(true);
      }
    };
  }, [show, assessment]);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const data = await assessmentService.getSubmissions(assessment.id);
      setSubmissions(data?.payload || data || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-zinc-200 shrink-0">
          <div className="min-w-0">
            <h2 className="font-bold text-zinc-900 text-sm sm:text-base truncate">
              Submissions
            </h2>
            {assessment?.title && (
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {assessment.title}
              </p>
            )}
          </div>

          <button
            onClick={onHide}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-xl leading-none shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-zinc-200 border-t-[#E30613]" />
              <p className="mt-3 text-sm text-zinc-500">Loading submissions…</p>
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {submissions.map((sub) => (
                <SubmissionRow key={sub.id} submission={sub} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 sm:px-5 py-3 border-t border-zinc-200 bg-zinc-50 shrink-0">
          <button
            type="button"
            onClick={onHide}
            className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({ submission }) {
  const name =
    submission.learnerName ||
    `${submission.firstname || ''} ${submission.lastname || ''}`.trim() ||
    'Unknown learner';

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors">

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
          <FaUserCircle className="text-zinc-500" size={18} />
        </div>

        <div className="min-w-0">
          <p className="font-bold text-zinc-900 text-sm truncate">{name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Submitted {formatDate(submission.submittedDate || submission.submittedAt)}
          </p>
        </div>
      </div>

      {submission.fileUrl && (
        <a
          href={BASE_URL + submission.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors shrink-0 no-underline"
        >
          <FaDownload size={11} />
          <span className="hidden sm:inline">Download</span>
        </a>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaUserCircle className="text-zinc-400" size={24} />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No submissions yet</h3>
      <p className="text-sm text-zinc-500">
        Learners haven't submitted this assessment.
      </p>
    </div>
  );
}