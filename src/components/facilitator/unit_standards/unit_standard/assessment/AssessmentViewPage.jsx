import { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronLeft,
  FaEdit,
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '@/utils/apiEndpoint';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentPreview from './AssessmentPreview';
import { assessmentService } from './services/AssessmentService';

const STATUS_STYLES = {
  SUBMITTED: 'bg-zinc-100 text-zinc-700',
  GRADED: 'bg-zinc-900 text-white',
  RE_SUBMITTED: 'bg-zinc-100 text-zinc-600',
  APPROVED: 'bg-zinc-100 text-zinc-700',
  REJECTED: 'bg-red-50 text-[#E30613]',
};

const STATUS_LABELS = {
  SUBMITTED: 'Submitted',
  GRADED: 'Graded',
  RE_SUBMITTED: 'Re-submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

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

function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export default function AssessmentViewPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    loadAll();
  }, [assessmentId]);

  async function loadAll() {
    setLoading(true);
    try {
      const [assessmentRes, submissionsRes] = await Promise.all([
        assessmentService.getAssessmentById(assessmentId),
        assessmentService.getSubmissions(assessmentId),
      ]);

      const assessmentData = assessmentRes?.payload || assessmentRes;
      const submissionsData =
        submissionsRes?.payload || submissionsRes || [];

      setAssessment(assessmentData);
      setSubmissions(submissionsData);
    } catch {
      setError('Failed to load assessment.');
    } finally {
      setLoading(false);
    }
  }

  const isTest = assessment?.type === 'TEST';

  const statistics = {
    total: submissions.length,
    graded: submissions.filter((s) => s.status === 'GRADED').length,
    pending: submissions.filter((s) => s.status === 'SUBMITTED').length,
    resubmitted: submissions.filter((s) => s.status === 'RE_SUBMITTED').length,
  };

  const scoredSubmissions = submissions.filter(
    (s) => s.obtainedMarks != null && assessment?.totalMarks
  );

  const averageScore = scoredSubmissions.length
    ? (
        scoredSubmissions.reduce(
          (sum, s) => sum + (s.obtainedMarks / assessment.totalMarks) * 100,
          0
        ) / scoredSubmissions.length
      ).toFixed(1)
    : '0.0';

  const passRate = scoredSubmissions.length
    ? (
        (scoredSubmissions.filter(
          (s) => (s.obtainedMarks / assessment.totalMarks) * 100 >= 50
        ).length /
          scoredSubmissions.length) *
        100
      ).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading assessment…</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center max-w-md mx-auto">
          <p className="text-sm text-zinc-500 mb-5">
            {error || 'Assessment not found.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaChevronLeft size={10} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaChevronLeft size={10} />
        Back
      </button>

      <HeaderCard
        assessment={assessment}
        isTest={isTest}
        submissionCount={statistics.total}
      />

      {statistics.total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatBox label="Total submissions" value={statistics.total} />
          <StatBox label="Graded" value={statistics.graded} />
          <StatBox label="Average score" value={`${averageScore}%`} />
          <StatBox label="Pass rate" value={`${passRate}%`} accent />
        </div>
      )}

      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showOverview={assessment.questions?.length > 0}
        submissionCount={submissions.length}
      />

      <div className="mt-5">
        {activeTab === 'overview' && assessment.questions?.length > 0 && (
          <AssessmentPreview
            assessmentInfo={assessment}
            questions={assessment.questions}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsList
            submissions={submissions}
            isTest={isTest}
            assessment={assessment}
            userType={userType}
            navigate={navigate}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
          />
        )}
      </div>
    </div>
  );
}

function HeaderCard({ assessment, isTest, submissionCount }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mb-6">

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
          {isTest ? 'Quiz' : assessment.type || 'Assessment'}
        </span>
        <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-1 rounded uppercase tracking-wider">
          {submissionCount} submission{submissionCount === 1 ? '' : 's'}
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1 break-words">
        {assessment.title}
      </h1>

      {assessment.description && (
        <p className="text-sm text-zinc-500 mb-4 break-words">
          {assessment.description}
        </p>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
        {assessment.startDate && (
          <MetaChip
            icon={FaCalendarAlt}
            label="Starts"
            value={formatDate(assessment.startDate)}
          />
        )}
        {assessment.dueDate && (
          <MetaChip
            icon={FaCalendarAlt}
            label="Due"
            value={formatDate(assessment.dueDate)}
          />
        )}
        <MetaChip
          icon={FaStar}
          label="Total marks"
          value={assessment.totalMarks || 0}
        />
        {assessment.unitStandardTitle && (
          <MetaChip
            icon={FaFileAlt}
            label="Module"
            value={assessment.unitStandardTitle}
          />
        )}
        {assessment.fileUrl && (
          <a
            href={BASE_URL + assessment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors no-underline"
          >
            {getFileIcon(assessment.fileName)}
            <span className="text-zinc-700 font-medium truncate max-w-[180px]">
              {assessment.fileName || 'Assessment file'}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

function MetaChip({ icon: Icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-zinc-600">
      <Icon size={11} className="text-zinc-400" />
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="font-bold text-zinc-900 truncate">{value}</span>
    </span>
  );
}

function StatBox({ label, value, accent }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
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

function Tabs({ activeTab, setActiveTab, showOverview, submissionCount }) {
  const tabs = [];
  if (showOverview) {
    tabs.push({ key: 'overview', label: 'Assessment' });
  }
  tabs.push({
    key: 'submissions',
    label: 'Submissions',
    badge: submissionCount,
  });

  return (
    <div className="border-b border-zinc-200 overflow-x-auto">
      <nav className="flex gap-1 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? 'text-[#E30613]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E30613] rounded-t-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

function SubmissionsList({
  submissions,
  isTest,
  assessment,
  userType,
  navigate,
  openMenuId,
  setOpenMenuId,
}) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaUsers className="text-zinc-400 text-xl" />
        </div>
        <h3 className="font-bold text-zinc-900 mb-1">No submissions yet</h3>
        <p className="text-sm text-zinc-500">
          Learners haven't submitted this assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {[
                'Learner',
                ...(!isTest ? ['Submitted file'] : []),
                'Submitted',
                'Status',
                'Score',
                '',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className="hover:bg-red-50/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-zinc-900 truncate">
                    {submission.userName ||
                      `${submission.firstname || ''} ${submission.lastname || ''}`.trim()}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">
                    {submission.userEmail || submission.email}
                  </div>
                </td>

                {!isTest && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(submission.fileName)}
                      <span className="text-zinc-600 truncate max-w-[150px]">
                        {submission.fileName || '—'}
                      </span>
                    </div>
                  </td>
                )}

                <td className="px-4 py-3 text-zinc-600 whitespace-nowrap text-xs">
                  {formatDateTime(submission.submittedAt)}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={submission.status} />
                </td>

                <td className="px-4 py-3">
                  <ScoreCell submission={submission} assessment={assessment} />
                </td>

                <td className="px-4 py-3 text-right">
                  <RowActions
                    submission={submission}
                    assessment={assessment}
                    userType={userType}
                    navigate={navigate}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-zinc-100">
        {submissions.map((submission) => (
          <div key={submission.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="font-bold text-zinc-900 truncate">
                  {submission.userName ||
                    `${submission.firstname || ''} ${submission.lastname || ''}`.trim()}
                </div>
                <div className="text-xs text-zinc-500 truncate mt-0.5">
                  {submission.userEmail || submission.email}
                </div>
              </div>
              <StatusBadge status={submission.status} />
            </div>

            <div className="flex items-center justify-between gap-2 mb-3 text-xs">
              <span className="text-zinc-500">
                {formatDateTime(submission.submittedAt)}
              </span>
              <ScoreCell submission={submission} assessment={assessment} />
            </div>

            {!isTest && submission.fileName && (
              <div className="flex items-center gap-2 mb-3 text-xs">
                {getFileIcon(submission.fileName)}
                <span className="text-zinc-600 truncate">
                  {submission.fileName}
                </span>
              </div>
            )}

            <RowActions
              submission={submission}
              assessment={assessment}
              userType={userType}
              navigate={navigate}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              expanded
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const key = status?.toUpperCase() || 'SUBMITTED';
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
        STATUS_STYLES[key] || 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {STATUS_LABELS[key] || status}
    </span>
  );
}

function ScoreCell({ submission, assessment }) {
  if (submission.obtainedMarks != null) {
    const total = submission.totalMarks || assessment.totalMarks || 1;
    const pct =
      submission.percentageScore ||
      Math.round((submission.obtainedMarks / total) * 100);
    return (
      <div className="tabular-nums">
        <span className="font-bold text-zinc-900 text-sm">
          {submission.obtainedMarks}/{total}
        </span>
        <span className="text-xs text-zinc-500 ml-1">({pct}%)</span>
      </div>
    );
  }

  if (submission.score) {
    return (
      <span className="font-bold text-zinc-900 text-sm tabular-nums">
        {submission.score}/{assessment.totalMarks}
      </span>
    );
  }

  return <span className="text-xs text-zinc-400">Not graded</span>;
}

function RowActions({
  submission,
  assessment,
  userType,
  navigate,
  openMenuId,
  setOpenMenuId,
  expanded = false,
}) {
  const isOpen = openMenuId === submission.id;
  const open = () => setOpenMenuId(isOpen ? null : submission.id);

  const actions = [];

  if (userType === 'ASSESSOR') {
    actions.push({
      label: 'Grade submission',
      onClick: () => navigate('grade', { state: { submission } }),
    });
  }
  if (userType === 'MODERATOR') {
    actions.push({
      label: 'Moderate submission',
      onClick: () => navigate('moderate', { state: { submission } }),
    });
  }
  if (userType === 'FACILITATOR' && assessment?.type === 'QUIZ') {
    actions.push({
      label: 'Mark submission',
      onClick: () => navigate(`mark/${submission.id}`, { state: { submission } }),
    });
  }

  actions.push({
    label: 'Preview file',
    onClick: () => window.open(BASE_URL + submission.fileUrl, '_blank'),
  });
  actions.push({
    label: 'Download file',
    onClick: () => window.open(BASE_URL + submission.fileUrl, '_blank'),
  });
  actions.push({
    label: 'View all answers',
    onClick: () => {},
  });

  if (expanded) {
    return (
      <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
        {actions.slice(0, 3).map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
          >
            {a.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
      >
        Actions
        <FaChevronDown
          size={10}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenMenuId(null)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-20">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => {
                  a.onClick();
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getFileIcon(fileName) {
  if (!fileName)
    return <FaFileAlt size={11} className="text-zinc-400 shrink-0" />;
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf')
    return <FaFilePdf size={11} className="text-zinc-500 shrink-0" />;
  if (ext === 'doc' || ext === 'docx')
    return <FaFileWord size={11} className="text-zinc-500 shrink-0" />;
  return <FaFileAlt size={11} className="text-zinc-400 shrink-0" />;
}