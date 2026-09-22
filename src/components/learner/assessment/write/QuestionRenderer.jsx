import { FaCheck, FaTimes } from 'react-icons/fa';

export default function QuestionRenderer({ 
  question, 
  answer, 
  matchingAnswers, 
  onAnswerChange, 
  onMatchingChange 
}) {
  
  switch (question.type) {
    case 'TRUE_OR_FALSE':
      return (
        <div className="flex gap-4 mt-3">
          <button
            onClick={() => onAnswerChange(question.id, 'true')}
            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              answer === 'true'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCheck /> True
          </button>
          <button
            onClick={() => onAnswerChange(question.id, 'false')}
            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              answer === 'false'
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
            <label
              key={idx}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="radio"
                name={`q_${question.id}`}
                value={option.text || option}
                checked={answer === (option.text || option)}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">{option.text || option}</span>
            </label>
          ))}
        </div>
      );

    case 'FILL_IN_BLANKS':
      const blanksCount = question.blanksCount || (question.text.match(/___/g) || []).length;
      const blankAnswers = answer || [];
      
      return (
        <div className="mt-3">
          <div className="text-gray-800 mb-4 leading-relaxed">
            {(() => {
              const parts = question.text.split('___');
              return parts.map((part, idx) => (
                <span key={idx}>
                  {part}
                  {idx < blanksCount && (
                    <input
                      type="text"
                      value={blankAnswers[idx] || ''}
                      onChange={(e) => {
                        const newAnswers = [...(blankAnswers)];
                        newAnswers[idx] = e.target.value;
                        onAnswerChange(question.id, newAnswers);
                      }}
                      placeholder={`Blank ${idx + 1}`}
                      className="mx-1 px-2 py-1 w-40 border-b-2 border-blue-400 focus:border-blue-600 outline-none text-center bg-transparent"
                    />
                  )}
                </span>
              ));
            })()}
          </div>
          <p className="text-xs text-gray-400">
            Each blank is worth approximately {Math.floor(question.marks / blanksCount)} mark(s)
          </p>
        </div>
      );

    case 'LONG_QUESTION':
      return (
        <div className="mt-3">
          <textarea
            value={answer || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            rows={8}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      );

    case 'MATCHING':
      const pairs = question.matchingPairs || question.pairs || [];
      const matches = matchingAnswers || {};
      
      return (
        <div className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 mb-2">Terms</h4>
              {pairs.map((pair, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  {pair.leftItem || pair.left}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 mb-2">Definitions</h4>
              {pairs.map((pair, idx) => {
                const leftKey = pair.leftItem || pair.left;
                return (
                  <select
                    key={idx}
                    value={matches[leftKey] || ''}
                    onChange={(e) => onMatchingChange(question.id, leftKey, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select definition...</option>
                    {pairs.map((p, i) => (
                      <option key={i} value={p.rightItem || p.right}>
                        {p.rightItem || p.right}
                      </option>
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
          value={answer || ''}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-xl mt-3"
          placeholder="Type your answer here..."
        />
      );
  }
}