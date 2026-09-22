import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Card,
  Accordion,
  Badge,
  Alert,
  Spinner,
  Row,
  Col,
  ProgressBar
} from 'react-bootstrap';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaPrint,
  FaDownload,
  FaChartLine,
  FaAward,
  FaStar,
  FaRegLightbulb
} from 'react-icons/fa';
import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';

export default function TestResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const {unitStandardId} = useParams()

  useEffect(() => {
    loadTestResults();
  }, [id]);

  const loadTestResults = async () => {
    try {
      setLoading(true);
      const response = await assessmentService.getUserSubmission(id);
      const data = response?.payload || response;

      if (data?.id) {
        setSubmission(data);
        // Set first question as active by default
        if (data.questionResults?.length > 0) {
          setActiveQuestion(0);
        }
      }
    } catch (err) {
      console.error('Error loading test results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a text version of results
    let content = `Test Results: ${submission.assessmentTitle}\n`;
    content += `Date: ${new Date(submission.submittedAt).toLocaleString()}\n`;
    content += `Score: ${submission.obtainedMarks}/${submission.totalMarks} (${submission.percentageScore}%)\n`;
    content += `Status: ${submission.passed ? 'PASSED' : 'FAILED'}\n`;
    content += `\nQuestion Breakdown:\n`;

    submission.questionResults.forEach((q, idx) => {
      content += `\n${idx + 1}. ${q.questionText}\n`;
      content += `   Marks: ${q.marksObtained}/${q.maxMarks}\n`;
      content += `   Your Answer: ${getUserAnswerText(q)}\n`;
      content += `   Correct Answer: ${q.correctAnswer}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_results_${submission.assessmentTitle}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUserAnswerText = (question) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_OR_FALSE':
      case 'LONG_QUESTION':
        return question.userAnswer || 'Not answered';
      case 'FILL_IN_BLANKS':
        return question.userAnswers?.join(', ') || 'Not answered';
      case 'MATCHING':
        return question.userMatchingAnswers ?
          Object.entries(question.userMatchingAnswers).map(([k, v]) => `${k} → ${v}`).join('; ') :
          'Not answered';
      default:
        return 'Not answered';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getScoreIcon = (percentage) => {
    if (percentage >= 80) return <FaAward className="text-success" size={24} />;
    if (percentage >= 60) return <FaStar className="text-warning" size={24} />;
    return <FaExclamationTriangle className="text-danger" size={24} />;
  };

  const getQuestionStatus = (marksObtained, maxMarks) => {
    if (marksObtained === maxMarks) {
      return { icon: <FaCheckCircle className="text-success" />, text: 'Correct', variant: 'success' };
    }
    if (marksObtained > 0) {
      return { icon: <FaExclamationTriangle className="text-warning" />, text: 'Partial', variant: 'warning' };
    }
    return { icon: <FaTimesCircle className="text-danger" />, text: 'Incorrect', variant: 'danger' };
  };

  const renderQuestionAnswer = (question, result) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="answer-section">
            <div className="user-answer mb-3">
              <h6 className="text-muted mb-2">Your Answer:</h6>
              <Badge bg={result.userAnswer === question.correctAnswer ? 'success' : 'danger'} className="p-2">
                {result.userAnswer || 'Not selected'}
              </Badge>
            </div>
            <div className="correct-answer mb-3">
              <h6 className="text-muted mb-2">Correct Answer:</h6>
              <Badge bg="success" className="p-2">{question.correctAnswer}</Badge>
            </div>
            <div className="options-list">
              <h6 className="text-muted mb-2">All Options:</h6>
              <ul className="list-unstyled">
                {question.availableOptions?.map((option, idx) => (
                  <li key={idx} className="mb-2">
                    <span className={option === question.correctAnswer ? 'text-success fw-bold' : ''}>
                      {option === question.correctAnswer && '✓ '}
                      {option}
                      {option === result.userAnswer && option !== question.correctAnswer && ' (Your answer)'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'TRUE_OR_FALSE':
        return (
          <div className="answer-section">
            <div className="user-answer mb-3">
              <h6 className="text-muted mb-2">Your Answer:</h6>
              <Badge bg={result.userAnswer === question.correctAnswer ? 'success' : 'danger'} className="p-2">
                {result.userAnswer || 'Not selected'}
              </Badge>
            </div>
            <div className="correct-answer mb-3">
              <h6 className="text-muted mb-2">Correct Answer:</h6>
              <Badge bg="success" className="p-2">{question.correctAnswer}</Badge>
            </div>
          </div>
        );

      case 'FILL_IN_BLANKS':
        return (
          <div className="answer-section">
            <div className="user-answer mb-3">
              <h6 className="text-muted mb-2">Your Answers:</h6>
              {question.blankPositions?.map((blank, idx) => (
                <div key={idx} className="mb-2">
                  <strong>{blank}:</strong>{' '}
                  <Badge
                    bg={result.userAnswers?.[idx]?.toLowerCase() === question.correctAnswer.split(' | ')[idx]?.toLowerCase()
                      ? 'success' : 'danger'}
                    className="ms-2"
                  >
                    {result.userAnswers?.[idx] || 'Not answered'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="correct-answer">
              <h6 className="text-muted mb-2">Correct Answers:</h6>
              {question.correctAnswer.split(' | ').map((answer, idx) => (
                <div key={idx} className="mb-1">
                  <strong>Blank {idx + 1}:</strong> {answer}
                </div>
              ))}
            </div>
          </div>
        );

      case 'MATCHING':
        return (
          <div className="answer-section">
            <div className="user-answer mb-3">
              <h6 className="text-muted mb-2">Your Matches:</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr><th>Left Item</th><th>→</th><th>Your Match</th><th>Correct Match</th></tr>
                  </thead>
                  <tbody>
                    {question.correctPairs?.map((pair, idx) => (
                      <tr key={idx}>
                        <td>{pair.left}</td>
                        <td>→</td>
                        <td>
                          <Badge bg={result.userMatchingAnswers?.[pair.left] === pair.right ? 'success' : 'danger'}>
                            {result.userMatchingAnswers?.[pair.left] || 'Not matched'}
                          </Badge>
                        </td>
                        <td className="text-success">{pair.right}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'LONG_QUESTION':
        return (
          <div className="answer-section">
            <div className="user-answer mb-3">
              <h6 className="text-muted mb-2">Your Answer:</h6>
              <div className="border rounded p-3 bg-light">
                {result.userAnswer || 'No answer provided'}
              </div>
            </div>
            <Alert variant="info">
              <FaRegLightbulb className="me-2" />
              Long questions require manual grading by your facilitator. Results will be updated once graded.
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="d-flex w-full justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your test results...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          <Alert.Heading>No Results Found</Alert.Heading>
          <p>You haven't submitted this test yet or your results are not available.</p>
          <Button onClick={() => navigate(-1)}>Back to Assessments</Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto test-results-page bg-light h-screen py-4">
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            className="d-flex align-items-center gap-2"
          >
            <FaArrowLeft /> Back
          </Button>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={handlePrint} className="d-flex align-items-center gap-2">
              <FaPrint /> Print
            </Button>
            <Button variant="outline-success" onClick={handleDownload} className="d-flex align-items-center gap-2">
              <FaDownload /> Download
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="shadow-sm mb-4 border-0">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h2 className="mb-2">{submission.assessmentTitle}</h2>
                <p className="text-muted mb-3">
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  {submission.gradedAt && submission.gradedAt !== submission.submittedAt &&
                    ` | Graded: ${new Date(submission.gradedAt).toLocaleString()}`
                  }
                </p>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    {getScoreIcon(submission.percentageScore)}
                    <span className="h4 mb-0">
                      {submission.obtainedMarks}/{submission.totalMarks}
                    </span>
                  </div>
                  <Badge bg={getScoreColor(submission.percentageScore)} className="p-2">
                    {submission.percentageScore}%
                  </Badge>
                  <Badge bg={submission.passed ? 'success' : 'danger'} className="p-2">
                    {submission.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
                <ProgressBar>
                  <ProgressBar
                    now={submission.percentageScore}
                    variant={getScoreColor(submission.percentageScore)}
                    label={`${submission.percentageScore}%`}
                  />
                </ProgressBar>
              </Col>
              <Col md={4}>
                <Row className="text-center">
                  <Col xs={4}>
                    <div className="border-end">
                      <h3 className="text-success mb-0">{submission.fullyCorrectCount || 0}</h3>
                      <small className="text-muted">Correct</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="border-end">
                      <h3 className="text-warning mb-0">{submission.partiallyCorrectCount || 0}</h3>
                      <small className="text-muted">Partial</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <h3 className="text-danger mb-0">{submission.incorrectCount || 0}</h3>
                    <small className="text-muted">Incorrect</small>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Detailed Questions */}
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white border-0 pt-4">
            <h5 className="mb-0">
              <FaChartLine className="me-2 text-primary" />
              Question Analysis
            </h5>
          </Card.Header>
          <Card.Body>
            <Accordion activeKey={activeQuestion} onSelect={(key) => setActiveQuestion(key)}>
              {submission.questionResults.map((result, index) => {
                const question = {
                  ...result,
                  questionType: result.questionType,
                  correctAnswer: result.correctAnswer,
                  availableOptions: result.availableOptions,
                  blankPositions: result.blankPositions,
                  correctPairs: result.correctPairs
                };
                const status = getQuestionStatus(result.marksObtained, result.maxMarks);

                return (
                  <Accordion.Item eventKey={index} key={result.questionId}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <div className="d-flex align-items-center gap-3">
                          {status.icon}
                          <div>
                            <div className="fw-semibold">
                              Question {index + 1}: {result.questionText}
                            </div>
                            <div className="text-muted small">
                              {result.questionType.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg={status.variant}>
                            {status.text}
                          </Badge>
                          <Badge bg="secondary">
                            {result.marksObtained}/{result.maxMarks} marks
                          </Badge>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {renderQuestionAnswer(question, result)}

                      {result.explanation && (
                        <Alert variant="info" className="mt-3">
                          <strong>Explanation:</strong> {result.explanation}
                        </Alert>
                      )}

                      {result.marksObtained < result.maxMarks && result.questionType !== 'LONG_QUESTION' && (
                        <Alert variant="light" className="mt-3">
                          <FaRegLightbulb className="me-2" />
                          <strong>Study Tip:</strong> Review the correct answer above to understand the concept better.
                        </Alert>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="text-center mt-4">
          <Button
            variant="primary"
            onClick={() => navigate(`/user/learner/unit-standard/${unitStandardId}/assessments`)}
            size="lg"
            className="px-5"
          >
            Return to Assessments
          </Button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .btn,
          .test-results-page > .container > .d-flex:first-child {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}