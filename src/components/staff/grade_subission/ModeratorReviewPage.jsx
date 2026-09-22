// components/moderator/ModeratorReviewPage.jsx
import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ModeratorReviewPage = () => {
  const { programId, unitStandardId, submissionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(location?.state?.submission || null);
  const [loading, setLoading] = useState(!location?.state?.submission);
  const [submitting, setSubmitting] = useState(false);
  const [moderatorComment, setModeratorComment] = useState('');
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { showResponse } = useApiResponse()

  useEffect(() => {
    if (!submission && submissionId) {
      //fetchSubmission();
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/grade/${submissionId}/approve`);

      if (!response.ok) throw new Error('Failed to fetch submission');
      const data = await response.json();
      setSubmission(data);
    } catch (err) {
      setError('Error loading submission: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setAction('approve');
    setSubmitting(true);
    setError('');

    try {
      const response = await apiFetch(`/api/grade/${submission?.id}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          moderatorComment: moderatorComment || 'Assessment approved',
          status: 'APPROVED'
        })
      });


      setSuccess(response?.message);
      showResponse(response);

      setTimeout(() => {
        navigate(-1);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setAction('');
    }
  };

  const handleReject = async () => {
    setAction('reject');
    setSubmitting(true);
    setError('');

    try {
      const response = await apiFetch(`/api/grade/${submission?.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          moderatorComment: moderatorComment || 'Please review this assessment again',
          status: 'REJECTED'
        })
      });


      setSuccess(response?.message);
      showResponse(response);

      setTimeout(() => {
        navigate(-1);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setAction('');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading submission...</p>
      </Container>
    );
  }

  if (!submission) {
    return (
      <Container className="text-center mt-5">
        <p className="text-red-600">Submission not found</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          Go Back
        </button>
      </Container>
    );
  }

  return (
    <main className='w-full h-screen overflow-y-auto bg-gray-50'>
      <div className="px-3 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 p-0 text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            ← Back to Assessments
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Moderate Assessment</h2>
          <p className="text-gray-500 mt-1">
            <span className="font-medium">{submission?.firstname} {submission?.lastname}</span>
            {submission?.email && <span className="text-gray-400 ml-2">({submission.email})</span>}
          </p>

          {/* Status badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${submission?.status === 'GRADED' ? 'bg-blue-100 text-blue-800' : ''}
              ${submission?.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
              ${submission?.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {submission?.status || 'GRADED'}
            </span>
            {submission?.submittedAt && (
              <span className="text-xs text-gray-500 ml-3">
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
              </span>
            )}
            {submission?.gradedAt && (
              <span className="text-xs text-gray-500 ml-3">
                Graded: {new Date(submission.gradedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-start">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 text-xl leading-none">×</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex justify-between items-start">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 text-xl leading-none">×</button>
          </div>
        )}

        {/* Learner Submission */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h5 className="font-semibold text-gray-900">Learner's Submission</h5>
          </div>
          <div className="p-6">
            {submission?.fileUrl ? (
              <div className="mb-4">
                <strong className="text-gray-700">Attached File:</strong><br />
                <div className="mt-2 flex items-center gap-3">
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                  >
                    📄 {submission.fileName || 'View Submission'}
                  </a>
                  {submission?.fileSize && (
                    <span className="text-xs text-gray-500">
                      ({(submission.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No file attached</p>
            )}

            {submission?.learnerNotes && (
              <div className="mt-4">
                <strong className="text-gray-700">Learner's Notes:</strong>
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">
                  {submission.learnerNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Assessor's Grade Section */}
        <div className="mb-6 bg-white rounded-lg border border-yellow-400">
          <div className="px-6 py-3 bg-yellow-50 rounded-t-lg border-b border-yellow-200">
            <h5 className="font-semibold text-gray-900">Assessor's Assessment</h5>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <strong className="text-gray-700">Marks Given:</strong>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <span className="text-3xl font-bold text-blue-600">{submission?.obtainedMarks}%</span>
                {submission?.totalMarks && (
                  <span className="text-gray-500 ml-2">out of {submission.totalMarks} marks</span>
                )}
              </div>
            </div>

            {submission?.feedback && (
              <div className="mt-4">
                <strong className="text-gray-700">Assessor's Feedback:</strong>
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">
                  {submission.feedback}
                </p>
              </div>
            )}

            {submission?.assessedBy && (
              <div className="mt-3 text-sm text-gray-500">
                Assessed by: {submission.assessedBy}
              </div>
            )}
          </div>
        </div>

        {/* Moderation Interface */}
        <div className="mb-6 bg-white rounded-lg border-2 border-purple-500">
          <div className="px-6 py-3 bg-purple-600 rounded-t-lg">
            <h5 className="font-semibold text-white">Moderator Review</h5>
          </div>
          <div className="p-6">
            {/* Moderator Comment */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Moderator Comment</label>
              <textarea
                rows={4}
                value={moderatorComment}
                onChange={(e) => setModeratorComment(e.target.value)}
                placeholder="Add your moderation notes here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-vertical"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={submitting}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg transition-colors ${submitting && action === 'reject'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-red-700'
                  }`}
              >
                {submitting && action === 'reject' ? 'Rejecting...' : 'Reject & Request Changes'}
              </button>
              <button
                onClick={handleApprove}
                disabled={submitting}
                className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors ${submitting && action === 'approve'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
                  }`}
              >
                {submitting && action === 'approve' ? 'Approving...' : 'Approve Marks'}
              </button>
            </div>
          </div>
        </div>

        {/* Moderation Guidelines */}
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div className="p-6">
            <h6 className="font-semibold text-gray-900 mb-3">Moderation Guidelines</h6>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ <span className="font-semibold">Approve</span> - Marks are fair and consistent with assessment criteria</li>
              <li>✓ <span className="font-semibold">Reject</span> - Marks need review or don't align with evidence provided</li>
              <li>✓ Provide specific feedback on why marks were approved or rejected</li>
              <li>✓ Ensure assessment aligns with unit standard requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModeratorReviewPage;