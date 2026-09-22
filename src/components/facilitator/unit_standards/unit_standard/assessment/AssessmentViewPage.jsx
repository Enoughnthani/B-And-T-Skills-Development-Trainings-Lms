import { BASE_URL } from '@/utils/apiEndpoint';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssessmentPreview from './AssessmentPreview';
import { assessmentService } from './services/assessmentService';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';

export default function AssessmentViewPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markingData, setMarkingData] = useState({});
  const { userType } = useAuth()
  const [statistics, setStatistics] = useState({
    totalSubmissions: 0,
    gradedCount: 0,
    pendingCount: 0,
    reSubmittedCount: 0,
    averageScore: 0,
    passRate: 0
  });

  useEffect(() => {
    loadAssessment();
    loadSubmissions();
  }, [assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessmentById(assessmentId);
      const data = response?.payload || response;
      setAssessment(data);
    } catch (err) {
      setError('Failed to load assessment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await assessmentService.getSubmissions(assessmentId);
      const data = response?.payload || response || [];
      setSubmissions(data);
      calculateStatistics(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  const calculateStatistics = (submissionsData) => {
    const total = submissionsData.length;
    const graded = submissionsData.filter(s => s.status === 'GRADED').length;
    const pending = submissionsData.filter(s => s.status === 'SUBMITTED').length;
    const reSubmitted = submissionsData.filter(s => s.status === 'RE_SUBMITTED').length;

    const scores = submissionsData
      .filter(s => s.obtainedMarks != null)
      .map(s => (s.obtainedMarks / (assessment?.totalMarks || 1)) * 100);

    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    const passed = scores.filter(score => score >= 50).length;
    const passRate = scores.length > 0 ? (passed / scores.length) * 100 : 0;

    setStatistics({
      totalSubmissions: total,
      gradedCount: graded,
      pendingCount: pending,
      reSubmittedCount: reSubmitted,
      averageScore: averageScore.toFixed(1),
      passRate: passRate.toFixed(1)
    });
  };

  const handleMarkSubmission = (submission) => {
    setSelectedSubmission(submission);

    // Initialize marking data with existing marks
    const initialMarks = {};
    if (submission.questionAnswers) {
      submission.questionAnswers.forEach(qa => {
        if (qa.questionType === 'LONG_QUESTION') {
          initialMarks[qa.questionId] = qa.marksObtained || 0;
        }
      });
    }
    setMarkingData(initialMarks);
    setShowMarkModal(true);
  };

  const handleSaveMarks = async () => {
    try {
      let totalObtained = 0;
      const updatedAnswers = selectedSubmission.questionAnswers.map(qa => {
        if (qa.questionType === 'LONG_QUESTION') {
          const newMarks = markingData[qa.questionId] || 0;
          totalObtained += newMarks;
          return { ...qa, marksObtained: newMarks };
        }
        totalObtained += qa.marksObtained || 0;
        return qa;
      });

      const response = await assessmentService.gradeSubmission(selectedSubmission.id, {
        obtainedMarks: totalObtained,
        questionMarks: markingData
      });

      if (response?.success) {
        setShowMarkModal(false);
        await loadSubmissions();
        alert('Submission graded successfully');
      } else {
        alert('Failed to grade submission');
      }
    } catch (err) {
      console.error('Error grading submission:', err);
      alert('Error grading submission');
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      SUBMITTED: { label: "Submitted", color: "bg-amber-50 text-amber-700 border-amber-200" },
      GRADED: { label: "Graded", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      RE_SUBMITTED: { label: "Re-Submitted", color: "bg-sky-50 text-sky-700 border-sky-200" },
      APPROVED: { label: "Approved", color: "bg-green-50 text-green-700 border-green-200" },
      REJECTED: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" }
    };

    const { label, color } = config[status] || config.SUBMITTED;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${color}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {status === 'APPROVED' ? (
            <path d="M5 13l4 4L19 7" />
          ) : status === 'REJECTED' ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : status === 'GRADED' ? (
            <path d="M5 13l4 4L19 7" />
          ) : (
            <circle cx="12" cy="12" r="10" />
          )}
        </svg>
        {label}
      </span>
    );
  };

  const getAssessmentStatus = () => {
    if (!assessment) return null;
    const now = new Date();
    const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
    const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;

    if (dueDate && isBefore(dueDate, now)) {
      return { status: 'closed', label: 'Closed', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    if (startDate && isAfter(startDate, now)) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { status: 'open', label: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const renderQuestionAnswerPreview = (question) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-500 mb-1">User Answer:</p>
            <Badge className={question.userAnswer === question.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
              {question.userAnswer || 'Not answered'}
            </Badge>
            <p className="text-xs text-gray-500 mt-2 mb-1">Correct Answer:</p>
            <Badge className="bg-green-100 text-green-700">{question.correctAnswer}</Badge>
          </div>
        );

      case 'FILL_IN_BLANKS':
        return (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-500 mb-1">User Answers:</p>
            {question.userAnswers?.map((answer, idx) => (
              <div key={idx} className="mb-1">
                <span className="text-xs">Blank {idx + 1}: </span>
                <Badge className={answer === question.correctAnswer.split(' | ')[idx] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {answer || 'Not answered'}
                </Badge>
              </div>
            ))}
          </div>
        );

      case 'MATCHING':
        return (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Matches:</p>
            {question.correctAnswer.split('; ').map((pair, idx) => {
              const [left, right] = pair.split(' → ');
              const userMatch = question.userMatchingAnswers?.[left];
              return (
                <div key={idx} className="text-xs mb-1">
                  {left} → {userMatch || '?'} {userMatch === right ? '✓' : '✗'}
                </div>
              );
            })}
          </div>
        );

      case 'LONG_QUESTION':
        return (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-500 mb-1">User Answer:</p>
            <div className="text-sm bg-gray-50 p-2 rounded">
              {question.userAnswer || 'No answer provided'}
            </div>
            {question.marksObtained !== undefined && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Marks Given: {question.marksObtained}/{question.maxMarks}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">Assessment not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const assessmentStatus = getAssessmentStatus();
  const isTest = assessment.type === 'TEST';

  return (
    <div className="w-full overflow-y-auto h-screen bg-gray-50">
      <div className="px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Assessment Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                  {isTest ? 'Test' : assessment.type || 'Assessment'}
                </span>
                {assessmentStatus && (
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md border ${assessmentStatus.color}`}>
                    {assessmentStatus.label}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                  {statistics.totalSubmissions} Submissions
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 break-words">{assessment.title}</h1>
              <p className="text-gray-600 text-sm mb-4 break-words">{assessment.description || 'No description provided'}</p>

              <div className="flex flex-wrap gap-2 text-sm">
                {assessment.startDate && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Starts: {format(parseISO(assessment.startDate), 'PPP')}
                  </span>
                )}

                {assessment.dueDate && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Due: {format(parseISO(assessment.dueDate), 'PPP')}
                  </span>
                )}

                <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Total Marks: {assessment.totalMarks}
                </span>

                {assessment.unitStandardTitle && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7" />
                      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                    </svg>
                    Unit Standard: {assessment.unitStandardTitle}
                  </span>
                )}

                {assessment?.fileUrl && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs">
                    {getFileIcon(assessment.fileName)}
                    <button
                      className="text-slate-700 font-medium underline hover:text-slate-900"
                      onClick={() => window.open(BASE_URL + assessment.fileUrl, "_blank")}
                    >
                      {assessment.fileName || "Assessment File"}
                    </button>
                    <span className="text-gray-400">
                      ({(assessment.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics.totalSubmissions > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalSubmissions}</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Graded</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{statistics.gradedCount}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Average Score</p>
                  <p className="text-2xl font-bold text-slate-700 mt-1">{0}%</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Pass Rate</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{statistics.passRate}%</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-500">
                    <circle cx="12" cy="8" r="7" />
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              {assessment?.questions?.length > 0 && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === 'overview'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  Assessment
                </button>
              )}
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === 'submissions'
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Submissions
                {submissions.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {submissions.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && assessment?.questions?.length > 0 && (
              <AssessmentPreview assessmentInfo={assessment} questions={assessment?.questions} />
            )}

            {activeTab === 'submissions' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {submissions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No submissions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Learners haven't submitted this assessment</p>
                  </div>
                ) : (
                  <div className="">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Learner</th>
                          {!isTest && <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Submitted File</th>}
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Submitted Date</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Score</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {submission.userName || `${submission.firstname} ${submission.lastname}`}
                                </p>
                                <p className="text-xs text-gray-400">{submission.userEmail || submission.email}</p>
                              </div>
                            </td>
                            {!isTest && (
                              <td className="p-4">
                                <div className="flex items-center gap-2 min-w-0">
                                  {getFileIcon(submission.fileName)}
                                  <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                    {submission.fileName}
                                  </span>
                                </div>
                              </td>
                            )}
                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                              {format(parseISO(submission.submittedAt), 'PPP p')}
                            </td>
                            <td className="p-4">
                              {getStatusBadge(submission.status)}
                            </td>
                            <td className="p-4">
                              {submission.obtainedMarks !== undefined ? (
                                <div>
                                  <span className="font-medium text-gray-900 text-sm">
                                    {submission.obtainedMarks}/{submission.totalMarks || assessment.totalMarks}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-1">
                                    ({submission.percentageScore || Math.round((submission.obtainedMarks / (submission.totalMarks || assessment.totalMarks)) * 100)}%)
                                  </span>
                                </div>
                              ) : submission.score ? (
                                <span className="font-medium text-gray-900 text-sm">
                                  {submission.score}/{assessment.totalMarks}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">Not graded</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                <Dropdown>
                                  <Dropdown.Toggle
                                    as="button"
                                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium border border-purple-200 hover:bg-purple-100 flex items-center gap-1"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Actions
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu
                                    className="!rounded-lg !border-0 !shadow-lg mt-1 !min-w-[160px]"
                                    style={{ borderRadius: '12px' }}
                                  >
                                    {userType === "ASSESSOR" &&
                                      <Dropdown.Item
                                        onClick={() => navigate(`grade`, { state: { submission } })}
                                        className="!px-4 !py-2 !text-sm hover:bg-purple-50"
                                      >
                                        Grade Submission
                                      </Dropdown.Item>}

                                    {userType === "MODERATOR" &&
                                      <Dropdown.Item
                                        onClick={() => navigate(`moderate`, { state: { submission } })}
                                        className="!px-4 !py-2 !text-sm hover:bg-purple-50"
                                      >
                                        Moderate Submission
                                      </Dropdown.Item>
                                    }

                                    {userType === "FACILITATOR" && assessment?.type=="QUIZ" &&
                                      <Dropdown.Item
                                        onClick={() => handleMarkSubmission(submission)}
                                        className="!px-4 !py-2 !text-sm hover:bg-purple-50"
                                      >
                                        Mark Submission
                                      </Dropdown.Item>
                                    }



                                    <Dropdown.Divider className="!my-1" />

                                    <Dropdown.Item
                                      onClick={() => window.open(BASE_URL + submission.fileUrl, '_blank')}
                                      className="!px-4 !py-2 !text-sm hover:bg-sky-50"
                                    >
                                      Preview File
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                      onClick={() => window.open(BASE_URL + submission.fileUrl, '_blank')}
                                      className="!px-4 !py-2 !text-sm hover:bg-emerald-50"
                                    >
                                      Download File
                                    </Dropdown.Item>

                                    <Dropdown.Divider className="!my-1" />

                                    <Dropdown.Item
                                      onClick={() => {
                                      }}
                                      className="!px-4 !py-2 !text-sm hover:bg-gray-50"
                                    >
                                      View All Answers
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mark Modal for Long Questions */}
      {showMarkModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Grade Submission</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedSubmission.userName} - {selectedSubmission.userEmail}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {selectedSubmission.questionAnswers
                .filter(qa => qa.questionType === 'LONG_QUESTION')
                .map(qa => (
                  <div key={qa.questionId} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{qa.questionText}</h4>
                      <span className="text-xs text-gray-500">Max Marks: {qa.maxMarks}</span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 font-medium mb-1">Student's Answer:</p>
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        {qa.userAnswer || 'No answer provided'}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 font-medium mb-1 block">Marks Awarded:</label>
                      <input
                        type="number"
                        min="0"
                        max={qa.maxMarks}
                        value={markingData[qa.questionId] || 0}
                        onChange={(e) => setMarkingData({
                          ...markingData,
                          [qa.questionId]: Math.min(parseInt(e.target.value) || 0, qa.maxMarks)
                        })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                  </div>
                ))}

              {selectedSubmission.questionAnswers.filter(qa => qa.questionType === 'LONG_QUESTION').length === 0 && (
                <p className="text-gray-500 text-center py-4">No long questions to grade</p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowMarkModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMarks}
                className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
              >
                Save Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}