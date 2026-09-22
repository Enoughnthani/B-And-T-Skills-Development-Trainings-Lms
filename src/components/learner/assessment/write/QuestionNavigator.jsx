export default function QuestionNavigator({ 
  questions, 
  currentQuestion, 
  isQuestionAnswered, 
  onQuestionSelect 
}) {
  return (
    <div className="mt-8">
      <h4 className="text-sm font-semibold text-gray-600 mb-3">Question Navigator</h4>
      <div className="flex justify-center gap-2 flex-wrap">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => onQuestionSelect(idx)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
              currentQuestion === idx
                ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2'
                : isQuestionAnswered(q)
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}