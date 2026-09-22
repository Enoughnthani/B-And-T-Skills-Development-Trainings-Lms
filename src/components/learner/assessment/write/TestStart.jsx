import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaPlay,
  FaStar
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

export default function TestStart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    loadTest();
    checkExistingSubmission();
  }, [id]);

  const loadTest = async () => {
    try {
      const response = await assessmentService.getTest(id);
      const data = response?.payload || response;
      setAssessment(data);
    } catch (err) {
      setError('Failed to load test');
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
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTestAvailable = () => {
    if (!assessment) return false;
    const now = new Date();
    const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
    const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;
    
    if (startDate && now < startDate) return false;
    if (dueDate && now > dueDate) return false;
    return true;
  };

  const getTestStatus = () => {
    if (!assessment) return null;
    const now = new Date();
    const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
    const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;

    if (dueDate && now > dueDate) {
      return { 
        status: 'closed', 
        label: 'Closed', 
        color: 'danger', 
        icon: FaExclamationTriangle,
        message: 'This test is closed. The due date has passed.' 
      };
    }
    if (startDate && now < startDate) {
      return { 
        status: 'upcoming', 
        label: 'Upcoming', 
        color: 'warning', 
        icon: FaHourglassHalf,
        message: `This test opens on ${formatDate(startDate)}` 
      };
    }
    return { 
      status: 'available', 
      label: 'Available', 
      color: 'success', 
      icon: FaCheckCircle,
      message: 'You can start this test now' 
    };
  };

  const handleStartTest = () => {
    navigate(`../assessments/${assessment?.id}/write`);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <FaStar className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">{error || 'Test not found'}</p>
          <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const status = getTestStatus();
  const isAvailable = isTestAvailable();
  const StatusIcon = status?.icon;

  // Check if already submitted
  if (existingSubmission && existingSubmission.status === 'SUBMITTED') {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-5 shadow-sm">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Test Already Submitted</h4>
            <p className="text-gray-600 text-sm mb-2">
              You submitted this test on {new Date(existingSubmission.submittedAt).toLocaleString()}
            </p>
            {existingSubmission.status === 'GRADED' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-left">
                <p className="text-sm font-medium">
                  Score: {existingSubmission.obtainedMarks}/{assessment.totalMarks}
                </p>
                {existingSubmission.feedback && (
                  <p className="text-sm mt-2">Feedback: {existingSubmission.feedback}</p>
                )}
              </div>
            )}
            <Button variant="primary" onClick={() => navigate('/learner/assessments')} className="mt-3">
              Back to Assessments
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen w-full ">
      <div className="p-3 m-1 shadow-xl border-0 overflow-hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center bg-transparent gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft size={14} /> Back to Assessments
        </button>

       
        <Card className="border-0">
          <div className={`bg-${status?.color}-50 p-6 border-b`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${status?.color}-100 rounded-full flex items-center justify-center`}>
                  {StatusIcon && <StatusIcon className={`text-${status?.color}-600 text-xl`} />}
                </div>
                <div>
                  <Badge bg={status?.color} className="mb-2">
                    {status?.label}
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-800">{assessment.title}</h2>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Marks</div>
                <div className="text-2xl font-bold text-gray-800">{assessment.totalMarks}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            {assessment.description && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{assessment.description}</p>
              </div>
            )}

            {/* Test Details Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaClock className="text-blue-500 text-xl" />
                <div>
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-semibold text-gray-800">
                    {assessment.durationMinutes} minutes
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaStar className="text-yellow-500 text-xl" />
                <div>
                  <div className="text-xs text-gray-500">Questions</div>
                  <div className="font-semibold text-gray-800">
                    {assessment.questions?.length || 0} questions
                  </div>
                </div>
              </div>

              {assessment.startDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-green-500 text-xl" />
                  <div>
                    <div className="text-xs text-gray-500">Start Date</div>
                    <div className="font-semibold text-gray-800">
                      {formatDate(assessment.startDate)}
                    </div>
                  </div>
                </div>
              )}

              {assessment.dueDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-red-500 text-xl" />
                  <div>
                    <div className="text-xs text-gray-500">Due Date</div>
                    <div className="font-semibold text-gray-800">
                      {formatDate(assessment.dueDate)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unit Standard Info */}
            {assessment.unitStandardTitle && (
              <div className="mb-6 p-3 bg-indigo-50 rounded-lg">
                <div className="text-xs text-indigo-600 mb-1">Unit Standard</div>
                <div className="font-medium text-gray-800">{assessment.unitStandardTitle}</div>
                <div className="text-xs text-gray-500 mt-1">ID: {assessment.unitStandardId}</div>
              </div>
            )}

            {/* Instructions */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Test Instructions</h4>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Read each question carefully before answering</li>
                <li>You have {assessment.durationMinutes} minutes to complete this test</li>
                <li>Once started, the timer cannot be paused</li>
                <li>Submit your answers before the time runs out</li>
                <li>You can navigate between questions using the navigation buttons</li>
                {assessment.passingMarks && (
                  <li>Passing marks: {assessment.passingMarks} out of {assessment.totalMarks}</li>
                )}
              </ul>
            </div>

            {/* Status Message */}
            {status?.message && (
              <div className={`mb-6 p-3 bg-${status?.color}-50 text-${status?.color}-700 rounded-lg text-sm`}>
                {status.message}
              </div>
            )}

            {/* Start Button */}
            {isAvailable && (
              <div className="flex justify-end">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleStartTest}
                  className="px-8 py-3 flex items-center gap-2"
                >
                  <FaPlay /> Start Test
                </Button>
              </div>
            )}

            {!isAvailable && status?.status === 'closed' && (
              <div className="flex justify-end">
                <Button variant="secondary" disabled>
                  Test Closed
                </Button>
              </div>
            )}

            {!isAvailable && status?.status === 'upcoming' && (
              <div className="flex justify-end">
                <Button variant="warning" disabled>
                  Coming Soon
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}