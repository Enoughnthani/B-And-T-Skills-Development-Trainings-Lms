import { useEffect, useState } from 'react';
import { Button, Card, Accordion, Badge, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaDownload, FaPrint, FaChartLine } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';

export default function TestComplete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const {unitStandardId} = useParams()

  useEffect(() => {
    loadSubmission();
  }, [id]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      const response = await assessmentService.getUserSubmission(id);
      const data = response?.payload || response;
      if (data?.id) setSubmission(data);
    } catch (err) {
      console.error('Error loading submission:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getQuestionStatusIcon = (marksObtained, maxMarks) => {
    if (marksObtained === maxMarks) {
      return <FaCheckCircle className="text-green-500" />;
    }
    if (marksObtained > 0) {
      return <span className="text-yellow-500">⚠️</span>;
    }
    return <span className="text-red-500">❌</span>;
  };

  const renderAnswer = (question, result) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
            <Badge bg={result.userAnswer === question.correctAnswer ? 'success' : 'danger'} className="mb-2">
              {result.userAnswer || 'Not answered'}
            </Badge>
            <p className="text-sm font-semibold text-gray-700 mt-2">Available Options:</p>
            <ul className="list-disc pl-5 text-sm">
              {question.availableOptions?.map((opt, idx) => (
                <li key={idx} className={opt === question.correctAnswer ? 'text-green-600 font-semibold' : ''}>
                  {opt}
                  {opt === question.correctAnswer && ' ✓'}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'TRUE_OR_FALSE':
        return (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
            <Badge bg={result.userAnswer === question.correctAnswer ? 'success' : 'danger'} className="mb-2">
              {result.userAnswer || 'Not answered'}
            </Badge>
          </div>
        );

      case 'FILL_IN_BLANKS':
        return (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700">Your Answers:</p>
            {question.blankPositions?.map((blank, idx) => (
              <div key={idx} className="mb-2">
                <span className="text-sm text-gray-600">{blank}: </span>
                <Badge 
                  bg={result.userAnswers?.[idx] === question.correctAnswer.split(' | ')[idx] ? 'success' : 'danger'}
                >
                  {result.userAnswers?.[idx] || 'Not answered'}
                </Badge>
              </div>
            ))}
          </div>
        );

      case 'MATCHING':
        return (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700">Your Matches:</p>
            <div className="bg-gray-50 rounded p-3">
              {question.correctPairs?.map((pair, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-medium">{pair.left}</span>
                  <span className="text-gray-400">→</span>
                  <Badge 
                    bg={result.userMatchingAnswers?.[pair.left] === pair.right ? 'success' : 'danger'}
                  >
                    {result.userMatchingAnswers?.[pair.left] || 'Not matched'}
                  </Badge>
                  {result.userMatchingAnswers?.[pair.left] !== pair.right && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Correct: {pair.right})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'LONG_QUESTION':
        return (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
            <div className="bg-gray-50 rounded p-3 text-sm">
              {result.userAnswer || 'No answer provided'}
            </div>
            <Alert variant="info" className="mt-2 mb-0">
              <small>Long questions require manual grading by your facilitator.</small>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto h-screen p-1">
      <div className="shadow-sm rounded py-6">
        {/* Header Card */}
        <Card className="mb-6 border-0">
          <Card.Body className="text-center p-6">
            <div className="mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Test Completed!</h3>
            <p className="text-gray-600 mb-4">
              {submission?.assessmentTitle || 'Your test'} has been successfully submitted and graded.
            </p>
            
            {/* Score Summary */}
            {submission && (
              <div className="rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Your Score:</span>
                  <span className="text-2xl font-bold" style={{
                    color: submission.percentageScore >= 60 ? '#10B981' : '#EF4444'
                  }}>
                    {submission.obtainedMarks}/{submission.totalMarks}
                  </span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar bg-${getScoreColor(submission.percentageScore)}`}
                    style={{ width: `${submission.percentageScore}%` }}
                    role="progressbar"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Percentage: {submission.percentageScore}%</span>
                  <Badge bg={submission.passed ? 'success' : 'danger'}>
                    {submission.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
                
                {/* Statistics Summary */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-top">
                  <div className="text-center">
                    <div className="text-success fw-bold">{submission.fullyCorrectCount || 0}</div>
                    <small className="text-muted">Fully Correct</small>
                  </div>
                  <div className="text-center">
                    <div className="text-warning fw-bold">{submission.partiallyCorrectCount || 0}</div>
                    <small className="text-muted">Partially Correct</small>
                  </div>
                  <div className="text-center">
                    <div className="text-danger fw-bold">{submission.incorrectCount || 0}</div>
                    <small className="text-muted">Incorrect</small>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline-secondary"
                onClick={() => window.print()}
                className="d-flex align-items-center gap-2"
              >
                <FaPrint /> Print
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate(`/user/learner/unit-standard/${unitStandardId}/assessments`)}
                className="d-flex align-items-center gap-2"
              >
                <FaHome /> Back to Assessments
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Detailed Results */}
        {submission?.questionResults && submission.questionResults.length > 0 && (
          <Card className="border-0">
            <Card.Header className="bg-white border-0 pt-4 pb-2">
              <h5 className="mb-0">
                <FaChartLine className="me-2 text-primary" />
                Detailed Question Analysis
              </h5>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {submission.questionResults.map((result, index) => {
                  const question = {
                    ...result,
                    questionType: result.questionType,
                    correctAnswer: result.correctAnswer,
                    availableOptions: result.availableOptions,
                    blankPositions: result.blankPositions,
                    correctPairs: result.correctPairs
                  };
                  
                  return (
                    <Accordion.Item eventKey={index.toString()} key={result.questionId}>
                      <Accordion.Header>
                        <div className="d-flex justify-content-between align-items-center w-100 me-3">
                          <div className="d-flex align-items-center gap-2">
                            {getQuestionStatusIcon(result.marksObtained, result.maxMarks)}
                            <span className="fw-semibold">
                              Question {index + 1}: {result.questionText}
                            </span>
                          </div>
                          <Badge bg="secondary" className="ms-2">
                            {result.marksObtained}/{result.maxMarks} marks
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Correct Answer:</strong>
                          </p>
                          <div className="bg-success bg-opacity-10 rounded p-2 mb-3">
                            <code className="text-success">{result.correctAnswer}</code>
                          </div>
                          
                          {renderAnswer(question, result)}
                          
                          {result.marksObtained < result.maxMarks && result.questionType !== 'LONG_QUESTION' && (
                            <Alert variant="warning" className="mt-3 mb-0">
                              <small>
                                💡 Tip: Review the correct answer above to understand where you lost marks.
                              </small>
                            </Alert>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </Card.Body>
          </Card>
        )}

        {/* Submission Metadata */}
        {submission && (
          <div className="text-center text-muted mt-4">
            <small>
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
              {submission.gradedAt && submission.gradedAt !== submission.submittedAt && 
                ` | Graded: ${new Date(submission.gradedAt).toLocaleString()}`
              }
            </small>
          </div>
        )}
      </div>
    </div>
  );
}