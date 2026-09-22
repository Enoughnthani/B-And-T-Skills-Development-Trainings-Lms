import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Badge, Tab, Tabs } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaCheckCircle, FaListUl, FaPencilAlt, FaFont, FaRegCheckCircle, FaPlusCircle } from 'react-icons/fa';
import { assessmentService } from '../services/AssessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import AssessmentPreview from '../AssessmentPreview';
import AssessmentInfoForm from './AssessmentInfoForm';
import QuestionTypeGrid from './QuestionTypeGrid';
import QuestionCard from './QuestionCard';
import AssessmentActions from './AssessmentActions';
import EmptyQuestionsState from './EmptyQuestionsState';

export default function AssessmentFormPage() {
  const navigate = useNavigate();
  const { unitStandardId, assessmentId } = useParams();
  const isEditing = !!assessmentId;
  const [activeTab, setActiveTab] = useState('build');
  const { showResponse } = useApiResponse();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [assessmentInfo, setAssessmentInfo] = useState({
    title: '',
    description: '',
    dueDate: '',
    startDate: '',
    duration: 60,
    passingScore: 50,
    totalMarks: 0,
    type: 'LEARNER_WORKBOOK'
  });
  const [questionCounts, setQuestionCounts] = useState({
    multipleChoice: 0,
    trueOrFalse: 0,
    fillInBlanks: 0,
    longQuestion: 0,
    matching: 0,
  });
  const [questions, setQuestions] = useState([]);

  const questionTypeOrder = {
    TRUE_OR_FALSE: 1,
    MULTIPLE_CHOICE: 2,
    MATCHING: 3,
    FILL_IN_BLANKS: 4,
    LONG_QUESTION: 5
  };

  const sortQuestions = (questionsToSort) => {
    return [...questionsToSort].sort((a, b) => {
      const orderA = questionTypeOrder[a.type] || 999;
      const orderB = questionTypeOrder[b.type] || 999;
      return orderA - orderB;
    });
  };

  const questionTypes = [
    { id: 'MULTIPLE_CHOICE', count: questionCounts.multipleChoice, label: 'Multiple Choice', icon: <FaListUl />, description: 'Select one correct answer from options' },
    { id: 'TRUE_OR_FALSE', count: questionCounts.trueOrFalse, label: 'True / False', icon: <FaCheckCircle />, description: 'Choose true or false' },
    { id: 'FILL_IN_BLANKS', count: questionCounts.fillInBlanks, label: 'Fill in the Blanks', icon: <FaFont />, description: 'Complete missing words in text' },
    { id: 'LONG_QUESTION', count: questionCounts.longQuestion, label: 'Long Question', icon: <FaPencilAlt />, description: 'Written response' },
    { id: 'MATCHING', count: questionCounts.matching, label: 'Matching', icon: <FaRegCheckCircle />, description: 'Match pairs correctly' }
  ];

  useEffect(() => {
    if (isEditing && assessmentId) {
      loadAssessment();
    }
  }, [isEditing, assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessmentById(assessmentId);
      const data = response?.payload || response;

      if (data) {
        setAssessmentInfo({
          title: data.title || '',
          description: data.description || '',
          dueDate: data.dueDate || '',
          startDate: data.startDate || '',
          duration: data.durationMinutes || 60,
          passingScore: data.passingMarks || 50,
          totalMarks: data.totalMarks || 0,
          type: data.type || 'LEARNER_WORKBOOK'
        });

        if (data.questions) {
          const transformedQuestions = data.questions.map(q => ({
            id: q.id || Date.now(),
            type: q.type,
            text: q.text,
            marks: q.marks,
            blanks: q.blanks,
            explanation: q.explanation || '',
            options: q.options?.map(opt => typeof opt === 'object' ? opt.text : opt) || [],
            correctAnswer: q.correctAnswer,
            sampleAnswer: q.sampleAnswer,
            pairs: q.pairs || []
          }));
          setQuestions(transformedQuestions);
          setQuestionCounts({
            multipleChoice: transformedQuestions.filter(q => q.type === 'MULTIPLE_CHOICE').length,
            trueOrFalse: transformedQuestions.filter(q => q.type === 'TRUE_OR_FALSE').length,
            fillInBlanks: transformedQuestions.filter(q => q.type === 'FILL_IN_BLANKS').length,
            longQuestion: transformedQuestions.filter(q => q.type === 'LONG_QUESTION').length,
            matching: transformedQuestions.filter(q => q.type === 'MATCHING').length
          });
        }

        if (data.fileUrl) {
          setExistingFile({ url: data.fileUrl, name: data.fileName, size: data.fileSize });
        }
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
      showResponse({ success: false, message: 'Failed to load assessment' });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (type) => {
    const baseQuestion = { id: Date.now(), type: type, text: '', marks: 0, explanation: '' };
    const typeMap = { 'MULTIPLE_CHOICE': 'multipleChoice', 'TRUE_OR_FALSE': 'trueOrFalse', 'FILL_IN_BLANKS': 'fillInBlanks', 'LONG_QUESTION': 'longQuestion', 'MATCHING': 'matching' };

    switch (type) {
      case 'MULTIPLE_CHOICE':
        baseQuestion.options = ['', '', '', ''];
        baseQuestion.correctAnswer = '';
        break;
      case 'TRUE_OR_FALSE':
        baseQuestion.correctAnswer = 'true';
        break;
      case 'FILL_IN_BLANKS':
        baseQuestion.blanks = [];
        break;
      case 'LONG_QUESTION':
        baseQuestion.sampleAnswer = '';
        break;
      case 'MATCHING':
        baseQuestion.pairs = [{ left: '', right: '' }, { left: '', right: '' }, { left: '', right: '' }];
        break;
    }
    setQuestionCounts(prev => ({ ...prev, [typeMap[type]]: prev[typeMap[type]] + 1 }));
    setQuestions(prevQuestions => sortQuestions([...prevQuestions, baseQuestion]));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id) => {
    if (window.confirm('Delete this question?')) {
      const questionToDelete = questions.find(q => q.id === id);
      if (questionToDelete) {
        const typeMap = { 'MULTIPLE_CHOICE': 'multipleChoice', 'TRUE_OR_FALSE': 'trueOrFalse', 'FILL_IN_BLANKS': 'fillInBlanks', 'LONG_QUESTION': 'longQuestion', 'MATCHING': 'matching' };
        setQuestionCounts(prev => ({ ...prev, [typeMap[questionToDelete.type]]: prev[typeMap[questionToDelete.type]] - 1 }));
      }
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const duplicateQuestion = (question) => {
    const typeMap = { 'MULTIPLE_CHOICE': 'multipleChoice', 'TRUE_OR_FALSE': 'trueOrFalse', 'FILL_IN_BLANKS': 'fillInBlanks', 'LONG_QUESTION': 'longQuestion', 'MATCHING': 'matching' };
    setQuestionCounts(prev => ({ ...prev, [typeMap[question.type]]: prev[typeMap[question.type]] + 1 }));
    setQuestions(prevQuestions => sortQuestions([...prevQuestions, { ...question, id: Date.now() }]));
  };

  const calculateTotalMarks = () => questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);

  const handleReset = () => {
    setQuestionCounts({ multipleChoice: 0, trueOrFalse: 0, fillInBlanks: 0, longQuestion: 0, matching: 0 });
    setAssessmentInfo({ title: '', description: '', startDate: '', dueDate: '', duration: 60, passingScore: 50, totalMarks: 0, type: 'LEARNER_WORKBOOK' });
    setQuestions([]);
    setSelectedFile(null);
    setExistingFile(null);
  };

  const handleSubmit = async () => {
    if (!assessmentInfo.title) {
      showResponse({ success: false, message: 'Please enter a title' });
      return;
    }

    setLoading(true);
    try {
      const totalMarks = calculateTotalMarks();
      const transformedQuestions = questions.map((q, index) => {
        const baseQuestion = { type: q.type, text: q.text, marks: parseInt(q.marks) || 0, explanation: q.explanation || "", displayOrder: index };
        if (q.type === 'MULTIPLE_CHOICE') return { ...baseQuestion, correctAnswer: q.correctAnswer, options: q.options.map((opt, optIndex) => ({ text: opt, displayOrder: optIndex })) };
        if (q.type === 'MATCHING') return { ...baseQuestion, matchingPairs: q.pairs.map((pair, pairIndex) => ({ leftItem: pair.left, rightItem: pair.right, displayOrder: pairIndex })) };
        if (q.type === 'TRUE_OR_FALSE') return { ...baseQuestion, correctAnswer: q.correctAnswer };
        if (q.type === 'LONG_QUESTION') return { ...baseQuestion, sampleAnswer: q.sampleAnswer || "" };
        if (q.type === 'FILL_IN_BLANKS') return { ...baseQuestion, blanks: q.blanks || "" };
        return baseQuestion;
      });

      const formDataToSend = new FormData();
      formDataToSend.append('title', assessmentInfo.title);
      formDataToSend.append('description', assessmentInfo.description);
      formDataToSend.append('dueDate', assessmentInfo.dueDate);
      formDataToSend.append('startDate', assessmentInfo.startDate);
      formDataToSend.append('totalMarks', totalMarks || assessmentInfo.totalMarks);
      formDataToSend.append('type', assessmentInfo.type);
      formDataToSend.append('unitStandardId', parseInt(unitStandardId));
      formDataToSend.append('durationMinutes', assessmentInfo.duration);
      if (transformedQuestions && transformedQuestions.length > 0) {
        formDataToSend.append('questions', JSON.stringify(transformedQuestions));
      }
      if (selectedFile) formDataToSend.append('file', selectedFile);

      const response = isEditing ? await assessmentService.updateAssessment(assessmentId, formDataToSend) : await assessmentService.createAssessment(formDataToSend);
      if (response?.success) {
        showResponse(response);
        navigate(-1);
      } else {
        showResponse(response || { success: false, message: 'Failed to save assessment' });
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      showResponse({ success: false, message: 'Failed to save assessment: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto w-full h-screen bg-gray-50 py-6">
      <div className="px-6">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm">
            <FaArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Assessment' : 'Create Assessment'}</h1>
          <p className="text-gray-500 text-sm">{isEditing ? 'Update assessment details and questions' : 'Build a custom assessment with various question types'}</p>
        </div>

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-6">
          <Tab eventKey="build" title="Build Assessment">
            <AssessmentInfoForm
              assessmentInfo={assessmentInfo}
              setAssessmentInfo={setAssessmentInfo}
              existingFile={existingFile}
              setExistingFile={setExistingFile}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />

            {assessmentInfo?.type === 'TEST' && <>
              <QuestionTypeGrid questionTypes={questionTypes} onAddQuestion={addQuestion} />

              <div className='my-4 flex'>
                <Button onClick={handleReset} className='ms-auto' variant='outline-secondary' size='sm'>Reset</Button>
              </div>

              {questions.length === 0 ? (
                <EmptyQuestionsState />
              ) : (
                questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    questionTypes={questionTypes}
                    onUpdate={updateQuestion}
                    onDuplicate={duplicateQuestion}
                    onDelete={removeQuestion}
                  />
                ))
              )}

              <div className='my-1'>
                <span className="text-sm text-gray-500">Total Questions: {questions.length}</span>
                <span className="text-sm text-gray-500 ml-4">Total Marks: {calculateTotalMarks()}</span>
              </div>
            </>
            }

            <AssessmentActions
              questions={questions}
              onSubmit={handleSubmit}
              loading={loading}
              isEditing={isEditing}
            />
          </Tab>

          <Tab eventKey="preview" title="Preview">
            <AssessmentPreview assessmentInfo={assessmentInfo} questions={questions} calculateTotalMarks={calculateTotalMarks} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}