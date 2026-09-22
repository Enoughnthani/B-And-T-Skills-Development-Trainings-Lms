import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, ProgressBar, Spinner } from 'react-bootstrap';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaSave
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionRenderer from './QuestionRenderer';
import QuestionNavigator from './QuestionNavigator';
import TestTimer from './TestTimer';

export default function TestTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [matchingAnswers, setMatchingAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showResponse } = useApiResponse();

  useEffect(() => {
    loadTest();
    loadSavedAnswers();
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

  const loadSavedAnswers = () => {
    const saved = localStorage.getItem(`test_answers_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setMatchingAnswers(parsed.matchingAnswers || {});
    }
  };

  const saveAnswers = (newAnswers, newMatchingAnswers) => {
    localStorage.setItem(`test_answers_${id}`, JSON.stringify({
      answers: newAnswers,
      matchingAnswers: newMatchingAnswers,
      lastSaved: new Date().toISOString()
    }));
  };

  const handleAnswerChange = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    saveAnswers(newAnswers, matchingAnswers);
  };


  const handleMatchingChange = (questionId, leftItem, rightValue) => {
    const newMatching = {
      ...matchingAnswers,
      [questionId]: { ...matchingAnswers[questionId], [leftItem]: rightValue }
    };
    setMatchingAnswers(newMatching);
    saveAnswers(answers, newMatching);
  };

  const isQuestionAnswered = (question) => {
    if (question.type === 'MATCHING') {
      const matches = matchingAnswers[question.id] || {};
      const pairs = question.matchingPairs || question.pairs || [];
      return pairs.length > 0 && pairs.every(pair => matches[pair.leftItem || pair.left]);
    }
    const answer = answers[question.id];
    if (question.type === 'FILL_IN_BLANKS') {
      return answer && Array.isArray(answer) && answer.length > 0 && answer.some(a => a);
    }
    return answer && answer !== '';
  };

  const getAnsweredCount = () => {
    if (!assessment?.questions) return 0;
    return assessment.questions.filter(q => isQuestionAnswered(q)).length;
  };

  const getProgress = () => {
    if (!assessment?.questions) return 0;
    return (getAnsweredCount() / assessment.questions.length) * 100;
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

    if (window.confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
      setSubmitting(true);
      try {
        const formattedAnswers = assessment.questions.map(q => {
          if (q.type === 'MATCHING') {
            return {
              questionId: q.id,
              matchingAnswers: matchingAnswers[q.id] || {}
            };
          } else if (q.type === 'FILL_IN_BLANKS') {
            return {
              questionId: q.id,
              answers: answers[q.id] || []
            };
          } else {
            return {
              questionId: q.id,
              answer: answers[q.id] || ''
            };
          }
        });

        const submissionData = {
          assessmentId: assessment.id,
          answers: formattedAnswers
        };

        const response = await assessmentService.submitTest(assessment.id, submissionData);
        
        if (response?.success) {
          localStorage.removeItem(`test_answers_${id}`);
          showResponse({ success: true, message: 'Test submitted successfully!' });
          navigate(`../assessments/${id}/completed`);
        } else {
          showResponse({ success: false, message: 'Submission failed: ' + (response?.message || 'Unknown error') });
        }
      } catch (err) {
        showResponse({ success: false, message: 'Failed to submit test '+err.message });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleTimeOut = () => {
    showResponse({ 
      success: false, 
      message: 'Time is up! Your test will be submitted automatically.' 
    });
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4">
        <div className="text-center py-12">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-3" />
          <p className="text-gray-600">{error || 'Test not found'}</p>
          <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const answeredCount = getAnsweredCount();
  const totalQuestions = assessment.questions.length;

  return (
    <div className="overflow-y-auto h-screen w-full ">
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                {assessment.title}
              </h3>
              <div className="text-xs text-gray-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Progress</div>
                <div className="font-semibold text-gray-800">
                  {answeredCount}/{totalQuestions}
                </div>
              </div>
              
              {assessment.durationMinutes && (
                <TestTimer 
                  durationMinutes={assessment.durationMinutes}
                  onTimeOut={handleTimeOut}
                  testId={id}
                />
              )}
            </div>
          </div>
          
          <ProgressBar 
            now={getProgress()} 
            variant="primary" 
            className="mt-2 h-1" 
          />
        </div>
      </div>

      <div className="py-4">
        <div className="max-w-4xl mx-auto">
          {/* Current Question */}
          {currentQ && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Badge bg="primary" className="px-3 py-2">
                      {currentQ.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {currentQ.marks} mark{currentQ.marks !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {isQuestionAnswered(currentQ) && (
                    <div className="text-green-600 text-sm flex items-center gap-1">
                      <FaCheckCircle /> Answered
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-800 text-lg font-medium">
                    {currentQ.text}
                  </p>
                </div>
                
                <QuestionRenderer
                  question={currentQ}
                  answer={answers[currentQ.id]}
                  matchingAnswers={matchingAnswers[currentQ.id]}
                  onAnswerChange={handleAnswerChange}
                  onMatchingChange={handleMatchingChange}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline-secondary"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === totalQuestions - 1 ? (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6"
              >
                {submitting ? <Spinner size="sm" /> : <FaPaperPlane className="me-2" />}
                Submit Test
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
              >
                Next Question
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <QuestionNavigator
            questions={assessment.questions}
            currentQuestion={currentQuestion}
            isQuestionAnswered={isQuestionAnswered}
            onQuestionSelect={setCurrentQuestion}
          />

          {/* Save Indicator */}
          <div className="fixed bottom-4 right-4 text-xs text-gray-400 flex items-center gap-1">
            <FaSave size={10} /> Auto-saved
          </div>
        </div>
      </div>
    </div>
  );
}