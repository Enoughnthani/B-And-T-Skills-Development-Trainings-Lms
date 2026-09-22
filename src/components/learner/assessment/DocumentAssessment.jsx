import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { BASE_URL } from '@/utils/apiEndpoint';
import { ArrowLeft } from 'lucide-react';

export default function DocumentAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResubmitConfirm, setShowResubmitConfirm] = useState(false);
  const { showResponse } = useApiResponse();

  useEffect(() => {
    loadAssessment();
    checkExistingSubmission();
  }, [id]);

  const loadAssessment = async () => {
    try {
      const response = await assessmentService.getAssessmentById(id);
      const data = response?.payload || response;
      setAssessment(data);
    } catch (err) {
      setError('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSubmission = async () => {
    try {
      const response = await assessmentService.getUserSubmission(id);
      const data = response?.payload || response;
      if (data?.id) setExistingSubmission(data);
    } catch (err) {
      console.error('Error checking submission:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
      } else {
        showResponse({ success: false, message: 'Please upload a PDF file' });
      }
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      showResponse({ success: false, message: 'Please upload your completed assessment' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await assessmentService.submitAssessment(uploadedFile, assessment.id);

      if (response?.success) {
        setSubmitted(true);
        localStorage.removeItem(`draft_${assessment?.id}`);
        await checkExistingSubmission();
        showResponse({ success: true, message: 'Assessment submitted successfully!' });
      } else {
        showResponse({ success: false, message: 'Submission failed: ' + (response?.message || 'Unknown error') });
      }
    } catch (err) {
      showResponse({ success: false, message: 'Failed to submit assessment' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-red-600 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{error || 'Assessment not found'}</h2>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success screen after submission
  if (submitted && existingSubmission) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-1">Assessment Submitted</h2>
          <p className="text-gray-500 text-sm mb-6">
            Submitted on {new Date(existingSubmission.submittedAt).toLocaleString()}
          </p>

          <div className="flex gap-3 justify-center mb-6">
            {existingSubmission.fileUrl && (
              <button 
                onClick={() => window.open(BASE_URL + existingSubmission.fileUrl, '_blank')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Submission
              </button>
            )}
            <button 
              onClick={() => setShowResubmitConfirm(true)}
              className="px-4 py-2 border border-amber-300 bg-amber-50 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              Resubmit
            </button>
          </div>

          {existingSubmission.status === 'GRADED' && (
            <div className="bg-slate-50 rounded-lg p-4 text-left mb-6 border border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Score:</span>{' '}
                <span className="text-slate-800 font-semibold">{existingSubmission.obtainedMarks}/{assessment.totalMarks}</span>
              </div>
              {existingSubmission.feedback && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Feedback:</span> {existingSubmission.feedback}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2  text-white rounded-md text-sm font-medium hover:bg-slate-700"
          >
            Back to Assessments
          </button>
        </div>

        {/* Resubmit Modal */}
        {showResubmitConfirm && (
          <div className="fixed  inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resubmit Assessment?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Your previous submission will be replaced. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowResubmitConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setExistingSubmission(null);
                    setUploadedFile(null);
                    setShowResubmitConfirm(false);
                  }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600"
                >
                  Yes, Resubmit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main assessment view
  return (
    <div className="mx-auto py-8 px-4 w-full overflow-y-auto h-screen">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex bg-transparent items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={15}/>
        Back to Assessments
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  {assessment.type}
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                  {assessment.totalMarks} marks
                </span>
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-2">{assessment.title}</h1>

              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                {assessment.dueDate && (
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Due: {formatDate(assessment.dueDate)}
                  </span>
                )}
              </div>

              {assessment.description && (
                <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
              )}

              {assessment.unitStandardTitle && (
                <p className="text-gray-400 text-xs">Unit Standard: {assessment.unitStandardTitle}</p>
              )}
            </div>

            {assessment.fileUrl && (
              <button 
                onClick={() => assessmentService.downloadAssessmentFile(assessment.fileUrl, assessment.fileName)}
                className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 flex items-center gap-2 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-600 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-sky-900 mb-2">Instructions</h3>
            <ol className="text-sm text-sky-800 space-y-1 list-decimal list-inside">
              <li>Download the assessment file above</li>
              <li>Complete all questions</li>
              <li>Save as <strong>PDF</strong> file</li>
              <li>Upload and submit below</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Previous Submission Alert */}
      {existingSubmission && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Previous Submission Found</h3>
              <p className="text-sm text-amber-700 mt-1">
                Submitted on: {new Date(existingSubmission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Submit Your Assessment</h2>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {!uploadedFile ? (
              <>
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-1">Click to upload your completed assessment</p>
                <p className="text-xs text-gray-400 mb-4">PDF only (Max 10MB)</p>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  id="assessment-upload" 
                />
                <label 
                  htmlFor="assessment-upload"
                  className="inline-flex px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSubmit} 
              disabled={!uploadedFile || submitting}
              className="px-6 py-2.5 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              )}
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}