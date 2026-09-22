import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, ProgressBar, Spinner } from 'react-bootstrap';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaPaperPlane,
  FaRedo,
  FaStar,
  FaTimes
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';


export default function WriteAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResubmitConfirm, setShowResubmitConfirm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [matchingAnswers, setMatchingAnswers] = useState({});
  const { showResponse } = useApiResponse();

  useEffect(() => {
    loadAssessment();
    checkExistingSubmission();
  }, [id]);

  useEffect(() => {
    if (assessment) {
      const savedAnswers = localStorage.getItem(`assessment_answers_${assessment.id}`);
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed.answers || {});
        setMatchingAnswers(parsed.matchingAnswers || {});
      }
    }
  }, [assessment]);

  useEffect(() => {
    if (assessment && Object.keys(answers).length > 0) {
      localStorage.setItem(`assessment_answers_${assessment.id}`, JSON.stringify({
        answers,
        matchingAnswers
      }));
    }
  }, [answers, matchingAnswers, assessment]);

  const loadAssessment = async () => {
    try {
      const response = await assessmentService.getTest(id);
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

  const isAssessmentAvailable = () => {
    if (!assessment) return false;
    const now = new Date();
    const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
    const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;
    if (startDate && now < startDate) return false;
    if (dueDate && now > dueDate) return false;
    return true;
  };

  const getAssessmentStatus = () => {
    if (!assessment) return null;
    const now = new Date();
    const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
    const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;

    if (dueDate && now > dueDate) {
      return { status: 'closed', label: 'Closed', color: 'danger', message: 'This assessment is closed' };
    }
    if (startDate && now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'warning', message: `Opens on ${formatDate(startDate)}` };
    }
    return { status: 'open', label: 'Open', color: 'success', message: 'You can submit your answers' };
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMatchingChange = (questionId, leftItem, rightValue) => {
    setMatchingAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], [leftItem]: rightValue }
    }));
  };


  const renderQuestion = (question) => {
    const userAnswer = answers[question.id] || '';

    switch (question.type) {
      case 'TRUE_OR_FALSE':
        return (
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => handleAnswerChange(question.id, 'true')}
              className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${userAnswer === 'true'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FaCheck /> True
            </button>
            <button
              onClick={() => handleAnswerChange(question.id, 'false')}
              className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${userAnswer === 'false'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FaTimes /> False
            </button>
          </div>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-2 mt-3">
            {question.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="radio"
                  name={`q_${question.id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'FILL_IN_BLANKS':
        return (
          <div className="mt-3">
            <p className="text-gray-800 mb-4 text-lg">
              {(() => {
                const parts = question.text.split('___');
                const blankCount = (question.text.match(/___/g) || []).length;

                return parts.map((part, idx) => (
                  <span key={idx}>
                    {part}
                    {idx < blankCount && (
                      <input
                        type="text"
                        value={userAnswer?.[idx] || ''}
                        onChange={(e) => {
                          const newAnswers = [...(userAnswer || [])];
                          newAnswers[idx] = e.target.value;
                          handleAnswerChange(question.id, newAnswers);
                        }}
                        placeholder={`Blank ${idx + 1}`}
                        className="mx-1 px-2 py-1 w-32 border-b-2 border-blue-400 focus:border-blue-600 outline-none text-center bg-transparent"
                      />
                    )}
                  </span>
                ));
              })()}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Fill in each blank above. Each blank is worth {question.marks / (question.blanksCount || 1)} mark(s).
            </p>
          </div>
        );

      case 'LONG_QUESTION':
      case 'TEXT_INPUT':
        return (
          <div className="mt-3">
            <textarea
              value={userAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              rows={6}
              placeholder="Type your answer here..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'MATCHING':
        return (
          <div className="mt-4">
            <p className="text-gray-800 mb-4">{question.text}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Terms */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 mb-2">Term</h4>
                {question.pairs?.map((pair, idx) => (
                  <div key={pair.id} className="p-3 bg-gray-50 rounded-lg">
                    {pair.left}
                  </div>
                ))}
              </div>

              {/* Right Column - Dropdowns */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 mb-2">Definition</h4>
                {question.pairs?.map((pair, idx) => {
                  const currentMatch = matchingAnswers[question.id]?.[pair.left] || '';
                  const availableOptions = ['', ...question.pairs.map(p => p.right)];

                  return (
                    <select
                      key={pair.id}
                      value={currentMatch}
                      onChange={(e) => handleMatchingChange(question.id, pair.left, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select definition...</option>
                      {question.pairs.map((p, i) => (
                        <option key={i} value={p.right}>{p.right}</option>
                      ))}
                    </select>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <textarea
            value={userAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-xl mt-3"
            placeholder="Type your answer here..."
          />
        );
    }
  };

  const isQuestionAnswered = (question) => {
    if (question.type === 'MATCHING') {
      const matches = matchingAnswers[question.id] || {};
      return question.pairs?.every(pair => matches[pair.left] && matches[pair.left] !== '');
    }
    return answers[question.id] && answers[question.id] !== '';
  };

  const getAnsweredCount = () => {
    if (!assessment?.questions) return 0;
    return assessment.questions.filter(q => isQuestionAnswered(q)).length;
  };

  const handleSubmit = async () => {
    const unansweredCount = assessment.questions.filter(q => !isQuestionAnswered(q)).length;

    if (unansweredCount > 0) {
      showResponse({
        success: false,
        message: `Please answer all questions before submitting. ${unansweredCount} question(s) remaining.`
      });
      return;
    }

    setSubmitting(true);
    try {
      const submissionData = {
        assessmentId: assessment.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer: answer
        })),
        matchingAnswers: matchingAnswers
      };

      const response = await assessmentService.submitTextAnswer(assessment.id, JSON.stringify(submissionData));

      if (response?.success) {
        setSubmitted(true);
        localStorage.removeItem(`assessment_answers_${assessment?.id}`);
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

  const handleResubmit = () => setShowResubmitConfirm(true);

  const handleConfirmResubmit = () => {
    setSubmitted(false);
    setExistingSubmission(null);
    setAnswers({});
    setMatchingAnswers({});
    setCurrentQuestion(0);
    setShowResubmitConfirm(false);
    localStorage.removeItem(`assessment_answers_${assessment?.id}`);
  };

  const getProgress = () => {
    if (!assessment?.questions) return 0;
    return (getAnsweredCount() / assessment.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="w-full overflow-y-auto h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <FaStar className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">{error || 'Assessment not found'}</p>
          <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">Go Back</Button>
        </div>
      </div>
    );
  }

  const assessmentStatus = getAssessmentStatus();
  const isAvailable = isAssessmentAvailable();

  if (submitted && existingSubmission) {
    return (
      <div className="w-full overflow-y-auto h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-5 shadow-sm">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Assessment Submitted!</h4>
            <p className="text-gray-600 text-sm mb-2">
              Submitted on {new Date(existingSubmission.submittedAt).toLocaleString()}
            </p>
            <Button variant="warning" size="sm" className="mb-3" onClick={handleResubmit}>
              <FaRedo className="me-2" /> Resubmit Assessment
            </Button>
            {existingSubmission.status === 'GRADED' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-left">
                <p className="text-sm font-medium">Score: {existingSubmission.obtainedMarks}/{assessment.totalMarks}</p>
                {existingSubmission.feedback && <p className="text-sm mt-2">Feedback: {existingSubmission.feedback}</p>}
              </div>
            )}
            <Button variant="primary" onClick={() => navigate('/learner/assessments')} className="mt-3">
              Back to Assessments
            </Button>
          </Card>
        </div>

        {showResubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h4 className="text-lg font-bold mb-3">Resubmit Assessment?</h4>
              <p className="text-gray-600 text-sm mb-4">Your previous submission will be replaced. This cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowResubmitConfirm(false)}>Cancel</Button>
                <Button variant="warning" onClick={handleConfirmResubmit}>Yes, Resubmit</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="w-full overflow-y-auto h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-5 shadow-sm">
            <div className={`w-16 h-16 bg-${assessmentStatus?.color === 'danger' ? 'red' : 'yellow'}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <FaExclamationTriangle className={`text-${assessmentStatus?.color === 'danger' ? 'red' : 'yellow'}-600 text-2xl`} />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">{assessmentStatus?.label} Assessment</h4>
            <p className="text-gray-600 text-sm mb-4">{assessmentStatus?.message}</p>
            <Button variant="primary" onClick={() => navigate(-1)}>Back to Assessments</Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="w-full overflow-y-auto h-screen bg-gray-50">
      <div className="px-4 py-8">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex bg-transparent items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
          <FaArrowLeft size={14} /> Back to Assessments
        </button>

        {/* Assessment Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge bg={assessmentStatus?.color}>{assessmentStatus?.label}</Badge>
                <Badge bg="secondary">{assessment.type}</Badge>
                <Badge bg="info"><FaStar className="me-1" /> {assessment.totalMarks} marks</Badge>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{assessment.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {assessment.startDate && <span><FaCalendarAlt className="inline me-1 text-green-600" /> Starts: {formatDate(assessment.startDate)}</span>}
                {assessment.dueDate && <span><FaCalendarAlt className="inline me-1 text-red-500" /> Due: {formatDate(assessment.dueDate)}</span>}
              </div>
              {assessment.unitStandardTitle && (
                <p className="text-xs text-gray-500 mt-2">Unit Standard: {assessment.unitStandardTitle}</p>
              )}
            </div>
            {assessment.fileUrl && (
              <Button variant="outline-primary" size="sm" onClick={() => assessmentService.downloadAssessmentFile(assessment.fileUrl, assessment.fileName)}>
                <FaDownload className="me-2" /> Download
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {getAnsweredCount()} of {assessment.questions?.length} answered</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <ProgressBar now={getProgress()} variant="primary" className="h-2" />
        </div>

        {/* Previous Submission Alert */}
        {existingSubmission && !submitted && (
          <Alert variant="info" className="mb-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <span>You have a previous submission from {new Date(existingSubmission.submittedAt).toLocaleString()}</span>
              <Button variant="warning" size="sm" onClick={handleResubmit}><FaRedo className="me-1" /> Resubmit</Button>
            </div>
          </Alert>
        )}

        {/* Current Question */}
        {currentQ && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h5 className="font-semibold text-gray-800 m-0">Question {currentQuestion + 1} of {assessment.questions.length}</h5>
                <Badge bg="primary">{currentQ.type}</Badge>
                <span className="text-sm text-gray-500">[{currentQ.marks} marks]</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline-secondary" size="sm" onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))} disabled={currentQuestion === 0}>
                  Previous
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={() => setCurrentQuestion(prev => Math.min(assessment.questions.length - 1, prev + 1))} disabled={currentQuestion === assessment.questions.length - 1}>
                  Next
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-800 text-lg">{currentQ.text}</p>
                {renderQuestion(currentQ)}
              </div>

              {isQuestionAnswered(currentQ) && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-green-600 flex items-center gap-1"><FaCheckCircle /> Answered</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question Navigator */}
        {assessment.questions.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {assessment.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${currentQuestion === idx ? 'bg-blue-600 text-white' :
                    isQuestionAnswered(q) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={submitting || getAnsweredCount() !== assessment.questions?.length}
            className="px-6 py-2 flex items-center gap-2"
          >
            {submitting ? <Spinner size="sm" /> : <FaPaperPlane />}
            {existingSubmission ? 'Resubmit Assessment' : 'Submit Assessment'}
          </Button>
        </div>

        {getAnsweredCount() !== assessment.questions?.length && (
          <p className="text-xs text-amber-600 mt-2 text-right">
            {assessment.questions?.length - getAnsweredCount()} question(s) remaining
          </p>
        )}
      </div>
    </div>
  );
}