import { FaPlus } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export default function QuestionEditor({ question, onUpdate }) {
  const updateOption = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate(question.id, 'options', newOptions);
  };

  const addOption = () => {
    onUpdate(question.id, 'options', [...question.options, '']);
  };

  const removeOption = (optionIndex) => {
    const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
    onUpdate(question.id, 'options', newOptions);
  };

  const updatePair = (pairIndex, side, value) => {
    const newPairs = [...question.pairs];
    newPairs[pairIndex] = { ...newPairs[pairIndex], [side]: value };
    onUpdate(question.id, 'pairs', newPairs);
  };

  const addPair = () => {
    onUpdate(question.id, 'pairs', [...question.pairs, { left: '', right: '' }]);
  };

  const removePair = (pairIndex) => {
    const newPairs = question.pairs.filter((_, idx) => idx !== pairIndex);
    onUpdate(question.id, 'pairs', newPairs);
  };

  switch (question.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correctAnswer === option}
                onChange={() => onUpdate(question.id, 'correctAnswer', option)}
                className="w-4 h-4"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              {question.options.length > 2 && (
                <button onClick={() => removeOption(idx)} className="p-1 bg-transparent text-red-500">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addOption} className="text-sm bg-transparent text-blue-700 flex items-center gap-1 mt-2">
            <FaPlus size={12} /> Add Option
          </button>
        </div>
      );

    case 'TRUE_OR_FALSE':
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`tf-${question.id}`}
              checked={question.correctAnswer === 'true'}
              onChange={() => onUpdate(question.id, 'correctAnswer', 'true')}
            />
            <span>True</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`tf-${question.id}`}
              checked={question.correctAnswer === 'false'}
              onChange={() => onUpdate(question.id, 'correctAnswer', 'false')}
            />
            <span>False</span>
          </label>
        </div>
      );

    case 'FILL_IN_BLANKS':
      return (
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text (use ___ for blanks)
            </label>
          </div>

          <div>
            {(() => {
              const blankCount = (question.text?.match(/___/g) || []).length;
              
              if (blankCount > 0) {
                return (<div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answers
                  </label>

                  {Array(blankCount).fill(0).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-24 text-sm font-medium text-gray-600">
                        Blank {idx + 1}:
                      </div>
                      <input
                        type="text"
                        value={question.blanks?.[idx] || ''}
                        onChange={(e) => {
                          const newAnswers = [...(question.blanks || [])];
                          newAnswers[idx] = e.target.value;
                          onUpdate(question.id, 'blanks', newAnswers);
                        }}
                        placeholder={`Correct answer for blank ${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>)
              }
            })()}
          </div>
        </div>
      );

    case 'LONG_QUESTION':
      return (
        <div>
          <textarea
            value={question.sampleAnswer}
            onChange={(e) => onUpdate(question.id, 'sampleAnswer', e.target.value)}
            placeholder="Provide a sample answer or rubric for grading..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[120px]"
          />
        </div>
      );

    case 'MATCHING':
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <span className="text-sm font-medium text-gray-600">Left Column</span>
            <span className="text-sm font-medium text-gray-600">Right Column</span>
          </div>
          {question.pairs.map((pair, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={pair.left}
                onChange={(e) => updatePair(idx, 'left', e.target.value)}
                placeholder={`Item ${idx + 1}`}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pair.right}
                  onChange={(e) => updatePair(idx, 'right', e.target.value)}
                  placeholder={`Match ${idx + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                {question.pairs.length > 2 && (
                  <button onClick={() => removePair(idx)} className="p-1 bg-transparent text-red-500">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addPair} className="text-sm bg-transparent text-blue-700 flex items-center gap-1 mt-2">
            <FaPlus size={12} /> Add Pair
          </button>
        </div>
      );

    default:
      return null;
  }
}