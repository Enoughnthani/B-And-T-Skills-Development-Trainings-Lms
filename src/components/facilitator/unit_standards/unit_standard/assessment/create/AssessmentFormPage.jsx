import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import AssessmentPreview from '../AssessmentPreview';
import AssessmentActions from './AssessmentActions';
import AssessmentInfoForm from './AssessmentInfoForm';
import EmptyQuestionsState from './EmptyQuestionsState';
import QuestionCard from './QuestionCard';
import QuestionTypeGrid from './QuestionTypeGrid';
import { assessmentService } from '../services/AssessmentService';

const QUESTION_TYPE_ORDER = {
  TRUE_OR_FALSE: 1,
  MULTIPLE_CHOICE: 2,
  MATCHING: 3,
  FILL_IN_BLANKS: 4,
  LONG_QUESTION: 5,
};

const TYPE_TO_COUNT_KEY = {
  MULTIPLE_CHOICE: 'multipleChoice',
  TRUE_OR_FALSE: 'trueOrFalse',
  FILL_IN_BLANKS: 'fillInBlanks',
  LONG_QUESTION: 'longQuestion',
  MATCHING: 'matching',
};

const EMPTY_COUNTS = {
  multipleChoice: 0,
  trueOrFalse: 0,
  fillInBlanks: 0,
  longQuestion: 0,
  matching: 0,
};

const EMPTY_INFO = {
  title: '',
  description: '',
  dueDate: '',
  startDate: '',
  duration: 60,
  passingScore: 50,
  totalMarks: 0,
  type: 'LEARNER_WORKBOOK',
};

const TABS = [
  { key: 'build', label: 'Build' },
  { key: 'preview', label: 'Preview' },
];

export default function AssessmentFormPage() {
  const navigate = useNavigate();
  const { unitStandardId, assessmentId } = useParams();
  const isEditing = !!assessmentId;
  const { showResponse } = useApiResponse();

  const [activeTab, setActiveTab] = useState('build');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [assessmentInfo, setAssessmentInfo] = useState(EMPTY_INFO);
  const [questionCounts, setQuestionCounts] = useState(EMPTY_COUNTS);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isEditing && assessmentId) loadAssessment();
  }, [isEditing, assessmentId]);

  function sortQuestions(list) {
    return [...list].sort((a, b) => {
      const orderA = QUESTION_TYPE_ORDER[a.type] || 999;
      const orderB = QUESTION_TYPE_ORDER[b.type] || 999;
      return orderA - orderB;
    });
  }

  function countByType(list) {
    return list.reduce(
      (acc, q) => {
        const key = TYPE_TO_COUNT_KEY[q.type];
        if (key) acc[key] += 1;
        return acc;
      },
      { ...EMPTY_COUNTS }
    );
  }

  async function loadAssessment() {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessmentById(assessmentId);
      const data = response?.payload || response;
      if (!data) return;

      setAssessmentInfo({
        title: data.title || '',
        description: data.description || '',
        dueDate: data.dueDate || '',
        startDate: data.startDate || '',
        duration: data.durationMinutes || 60,
        passingScore: data.passingMarks || 50,
        totalMarks: data.totalMarks || 0,
        type: data.type || 'LEARNER_WORKBOOK',
      });

      if (data.questions) {
        const transformed = data.questions.map((q) => ({
          id: q.id || Date.now(),
          type: q.type,
          text: q.text,
          marks: q.marks,
          blanks: q.blanks,
          explanation: q.explanation || '',
          options:
            q.options?.map((opt) =>
              typeof opt === 'object' ? opt.text : opt
            ) || [],
          correctAnswer: q.correctAnswer,
          sampleAnswer: q.sampleAnswer,
          pairs: q.pairs || [],
        }));
        setQuestions(transformed);
        setQuestionCounts(countByType(transformed));
      }

      if (data.fileUrl) {
        setExistingFile({
          url: data.fileUrl,
          name: data.fileName,
          size: data.fileSize,
        });
      }
    } catch {
      showResponse({ success: false, message: 'Failed to load assessment.' });
    } finally {
      setLoading(false);
    }
  }

  function addQuestion(type) {
    const base = {
      id: Date.now(),
      type,
      text: '',
      marks: 0,
      explanation: '',
    };

    if (type === 'MULTIPLE_CHOICE') {
      base.options = ['', '', '', ''];
      base.correctAnswer = '';
    } else if (type === 'TRUE_OR_FALSE') {
      base.correctAnswer = 'true';
    } else if (type === 'FILL_IN_BLANKS') {
      base.blanks = [];
    } else if (type === 'LONG_QUESTION') {
      base.sampleAnswer = '';
    } else if (type === 'MATCHING') {
      base.pairs = [
        { left: '', right: '' },
        { left: '', right: '' },
        { left: '', right: '' },
      ];
    }

    const countKey = TYPE_TO_COUNT_KEY[type];
    setQuestionCounts((prev) => ({
      ...prev,
      [countKey]: prev[countKey] + 1,
    }));
    setQuestions((prev) => sortQuestions([...prev, base]));
  }

  function updateQuestion(id, field, value) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  }

  function removeQuestion(id) {
    if (!window.confirm('Delete this question?')) return;

    const target = questions.find((q) => q.id === id);
    if (target) {
      const countKey = TYPE_TO_COUNT_KEY[target.type];
      setQuestionCounts((prev) => ({
        ...prev,
        [countKey]: Math.max(0, prev[countKey] - 1),
      }));
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function duplicateQuestion(question) {
    const countKey = TYPE_TO_COUNT_KEY[question.type];
    setQuestionCounts((prev) => ({
      ...prev,
      [countKey]: prev[countKey] + 1,
    }));
    setQuestions((prev) =>
      sortQuestions([...prev, { ...question, id: Date.now() }])
    );
  }

  function calculateTotalMarks() {
    return questions.reduce((sum, q) => sum + (parseInt(q.marks, 10) || 0), 0);
  }

  function handleReset() {
    setQuestionCounts(EMPTY_COUNTS);
    setAssessmentInfo(EMPTY_INFO);
    setQuestions([]);
    setSelectedFile(null);
    setExistingFile(null);
  }

  async function handleSubmit() {
    if (!assessmentInfo.title) {
      showResponse({ success: false, message: 'Please enter a title.' });
      return;
    }

    setLoading(true);

    try {
      const totalMarks = calculateTotalMarks();
      const transformedQuestions = questions.map((q, index) => {
        const base = {
          type: q.type,
          text: q.text,
          marks: parseInt(q.marks, 10) || 0,
          explanation: q.explanation || '',
          displayOrder: index,
        };

        if (q.type === 'MULTIPLE_CHOICE') {
          return {
            ...base,
            correctAnswer: q.correctAnswer,
            options: q.options.map((opt, optIndex) => ({
              text: opt,
              displayOrder: optIndex,
            })),
          };
        }
        if (q.type === 'MATCHING') {
          return {
            ...base,
            matchingPairs: q.pairs.map((pair, pairIndex) => ({
              leftItem: pair.left,
              rightItem: pair.right,
              displayOrder: pairIndex,
            })),
          };
        }
        if (q.type === 'TRUE_OR_FALSE') {
          return { ...base, correctAnswer: q.correctAnswer };
        }
        if (q.type === 'LONG_QUESTION') {
          return { ...base, sampleAnswer: q.sampleAnswer || '' };
        }
        if (q.type === 'FILL_IN_BLANKS') {
          return { ...base, blanks: q.blanks || '' };
        }
        return base;
      });

      const formDataToSend = new FormData();
      formDataToSend.append('title', assessmentInfo.title);
      formDataToSend.append('description', assessmentInfo.description);
      formDataToSend.append('dueDate', assessmentInfo.dueDate);
      formDataToSend.append('startDate', assessmentInfo.startDate);
      formDataToSend.append(
        'totalMarks',
        totalMarks || assessmentInfo.totalMarks
      );
      formDataToSend.append('type', assessmentInfo.type);
      formDataToSend.append('unitStandardId', parseInt(unitStandardId, 10));
      formDataToSend.append('durationMinutes', assessmentInfo.duration);

      if (transformedQuestions.length > 0) {
        formDataToSend.append(
          'questions',
          JSON.stringify(transformedQuestions)
        );
      }
      if (selectedFile) formDataToSend.append('file', selectedFile);

      const response = isEditing
        ? await assessmentService.updateAssessment(assessmentId, formDataToSend)
        : await assessmentService.createAssessment(formDataToSend);

      if (response?.success) {
        showResponse(response);
        navigate(-1);
      } else {
        showResponse(
          response || { success: false, message: 'Failed to save assessment.' }
        );
      }
    } catch (error) {
      showResponse({
        success: false,
        message: 'Failed to save assessment: ' + error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const questionTypes = [
    {
      id: 'MULTIPLE_CHOICE',
      count: questionCounts.multipleChoice,
      label: 'Multiple Choice',
      icon: 'list',
      description: 'Select one correct answer from options',
    },
    {
      id: 'TRUE_OR_FALSE',
      count: questionCounts.trueOrFalse,
      label: 'True / False',
      icon: 'check',
      description: 'Choose true or false',
    },
    {
      id: 'FILL_IN_BLANKS',
      count: questionCounts.fillInBlanks,
      label: 'Fill in the Blanks',
      icon: 'font',
      description: 'Complete missing words in text',
    },
    {
      id: 'LONG_QUESTION',
      count: questionCounts.longQuestion,
      label: 'Long Question',
      icon: 'pencil',
      description: 'Written response',
    },
    {
      id: 'MATCHING',
      count: questionCounts.matching,
      label: 'Matching',
      icon: 'check-circle',
      description: 'Match pairs correctly',
    },
  ];

  if (loading && isEditing) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading assessment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
          {isEditing ? 'Edit assessment' : 'Create assessment'}
        </h1>
        <p className="text-sm text-zinc-500">
          {isEditing
            ? 'Update assessment details and questions.'
            : 'Build a custom assessment with various question types.'}
        </p>
      </div>

      <div className="border-b border-zinc-200 mb-5 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-[#E30613]'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E30613] rounded-t-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'build' && (
        <>
          <AssessmentInfoForm
            assessmentInfo={assessmentInfo}
            setAssessmentInfo={setAssessmentInfo}
            existingFile={existingFile}
            setExistingFile={setExistingFile}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />

          {assessmentInfo?.type === 'TEST' && (
            <>
              <QuestionTypeGrid
                questionTypes={questionTypes}
                onAddQuestion={addQuestion}
              />

              <div className="my-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>

              {questions.length === 0 ? (
                <EmptyQuestionsState />
              ) : (
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      questionTypes={questionTypes}
                      onUpdate={updateQuestion}
                      onDuplicate={duplicateQuestion}
                      onDelete={removeQuestion}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4 mb-2 text-sm text-zinc-500">
                <span>
                  Total questions:{' '}
                  <strong className="text-zinc-900">{questions.length}</strong>
                </span>
                <span>
                  Total marks:{' '}
                  <strong className="text-zinc-900">
                    {calculateTotalMarks()}
                  </strong>
                </span>
              </div>
            </>
          )}

          <AssessmentActions
            questions={questions}
            onSubmit={handleSubmit}
            loading={loading}
            isEditing={isEditing}
          />
        </>
      )}

      {activeTab === 'preview' && (
        <AssessmentPreview
          assessmentInfo={assessmentInfo}
          questions={questions}
          calculateTotalMarks={calculateTotalMarks}
        />
      )}
    </div>
  );
}