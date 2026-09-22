import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const AssessorGradePage = () => {
  const { programId, unitStandardId, submissionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showResponse } = useApiResponse()

  const [submission, setSubmission] = useState(location?.state?.submission || null);
  const [loading, setLoading] = useState(!location?.state?.submission);
  const [submitting, setSubmitting] = useState(false);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!submission && submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/grade/${submissionId}`);

      if (!response.ok) throw new Error('Failed to fetch submission');
      const data = await response.json();
      setSubmission(data);
    } catch (err) {
      setError('Error loading submission: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrade = async () => {
    if (!marks || marks < 0 || marks > 100) {
      setError('Please enter a valid mark between 0 and 100');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await apiFetch(`/api/grade/${submission?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          marks: parseInt(marks),
          feedback: feedback,
          status: 'ASSESSED'
        })
      });

      setSuccess(response?.message);
      showResponse(response)

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const quickMarks = [50, 60, 70, 75, 80, 85, 90, 95, 100];

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
          <h2 className="text-2xl font-bold text-gray-900">Grade Assessment</h2>
          <p className="text-gray-500 mt-1">
            <span className="font-medium">{submission?.firstname} {submission?.lastname}</span>
            {submission?.email && <span className="text-gray-400 ml-2">({submission.email})</span>}
          </p>

          {/* Status badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${submission?.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${submission?.status === 'ASSESSED' ? 'bg-green-100 text-green-800' : ''}
            `}>
              {submission?.status || 'SUBMITTED'}
            </span>
            {submission?.submittedAt && (
              <span className="text-xs text-gray-500 ml-3">
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
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

        {/* Grading Interface */}
        <div className="mb-6 bg-white rounded-lg border-2 border-blue-500">
          <div className="px-6 py-3 bg-blue-600 rounded-t-lg">
            <h5 className="font-semibold text-white">Assessor Grading</h5>
          </div>
          <div className="p-6">
            {/* Quick Marks */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Quick Marks</label>
              <div className="flex flex-wrap gap-2">
                {quickMarks.map(mark => (
                  <button
                    key={mark}
                    onClick={() => setMarks(mark)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${marks == mark
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                  >
                    {mark}%
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Mark Input */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Enter Marks (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="Enter mark between 0 and 100"
                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter a percentage from 0 to 100
              </p>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Feedback to Learner</label>
              <textarea
                rows={5}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback on the submission..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGrade}
                disabled={submitting || !marks}
                className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors ${(submitting || !marks)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
                  }`}
              >
                {submitting ? 'Submitting...' : 'Submit Grade'}
              </button>
            </div>
          </div>
        </div>

        {/* Rubric Reference */}
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div className="p-6">
            <h6 className="font-semibold text-gray-900 mb-3">Grading Guidelines</h6>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><span className="font-semibold">50-59%</span> - Satisfactory (Meets minimum requirements)</li>
              <li><span className="font-semibold">60-69%</span> - Good (Above average)</li>
              <li><span className="font-semibold">70-79%</span> - Very Good (Exceeds expectations)</li>
              <li><span className="font-semibold">80-89%</span> - Excellent (Outstanding work)</li>
              <li><span className="font-semibold">90-100%</span> - Exceptional (Perfect/Extraordinary)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AssessorGradePage;