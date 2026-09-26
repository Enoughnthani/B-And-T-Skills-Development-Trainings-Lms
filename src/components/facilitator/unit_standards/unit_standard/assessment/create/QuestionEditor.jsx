import { FaPlus, FaTrash } from 'react-icons/fa';

const inputClass =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors';

const smallLabel = 'text-xs font-bold text-zinc-500 uppercase tracking-wider';

export default function QuestionEditor({ question, onUpdate }) {
  function updateOption(optionIndex, value) {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate(question.id, 'options', newOptions);
  }

  function addOption() {
    onUpdate(question.id, 'options', [...question.options, '']);
  }

  function removeOption(optionIndex) {
    onUpdate(
      question.id,
      'options',
      question.options.filter((_, idx) => idx !== optionIndex)
    );
  }

  function updatePair(pairIndex, side, value) {
    const newPairs = [...question.pairs];
    newPairs[pairIndex] = { ...newPairs[pairIndex], [side]: value };
    onUpdate(question.id, 'pairs', newPairs);
  }

  function addPair() {
    onUpdate(question.id, 'pairs', [...question.pairs, { left: '', right: '' }]);
  }

  function removePair(pairIndex) {
    onUpdate(
      question.id,
      'pairs',
      question.pairs.filter((_, idx) => idx !== pairIndex)
    );
  }

  switch (question.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrect = question.correctAnswer === option;

            return (
              <div key={idx} className="flex items-center gap-2">
                <label
                  className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors shrink-0 text-xs font-bold ${
                    isCorrect
                      ? 'bg-[#E30613] text-white'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={isCorrect}
                    onChange={() =>
                      onUpdate(question.id, 'correctAnswer', option)
                    }
                    className="hidden"
                  />
                  {letter}
                </label>

                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${letter}`}
                  className={`flex-1 px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:border-[#E30613] outline-none transition-colors ${
                    isCorrect ? 'border-[#E30613]' : 'border-zinc-300'
                  }`}
                />

                {question.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    aria-label="Remove option"
                  >
                    <FaTrash size={11} />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E30613] hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors mt-1"
          >
            <FaPlus size={10} />
            Add option
          </button>
        </div>
      );

    case 'TRUE_OR_FALSE':
      return (
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'true', label: 'True' },
            { value: 'false', label: 'False' },
          ].map((opt) => {
            const isCorrect = question.correctAnswer === opt.value;
            return (
              <label
                key={opt.value}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors border ${
                  isCorrect
                    ? 'bg-[#E30613] text-white border-[#E30613]'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400'
                }`}
              >
                <input
                  type="radio"
                  name={`tf-${question.id}`}
                  checked={isCorrect}
                  onChange={() =>
                    onUpdate(question.id, 'correctAnswer', opt.value)
                  }
                  className="hidden"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      );

    case 'FILL_IN_BLANKS': {
      const blankCount = (question.text?.match(/___/g) || []).length;

      return (
        <div className="space-y-4">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <p className="text-xs text-zinc-600">
              Use three underscores{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-[11px]">
                ___
              </code>{' '}
              in the question text to create blanks. Each blank gets its own
              answer below.
            </p>
          </div>

          {blankCount > 0 ? (
            <div>
              <p className={`${smallLabel} mb-2`}>
                Correct answers ({blankCount})
              </p>
              <div className="space-y-2">
                {Array.from({ length: blankCount }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-500 w-16 shrink-0">
                      Blank {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={question.blanks?.[idx] || ''}
                      onChange={(e) => {
                        const newBlanks = [...(question.blanks || [])];
                        newBlanks[idx] = e.target.value;
                        onUpdate(question.id, 'blanks', newBlanks);
                      }}
                      placeholder={`Answer for blank ${idx + 1}`}
                      className={`${inputClass} flex-1`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-zinc-50 border border-dashed border-zinc-300 rounded-lg">
              <p className="text-sm text-zinc-500">
                Add{' '}
                <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                  ___
                </code>{' '}
                in the question text above to create blanks.
              </p>
            </div>
          )}
        </div>
      );
    }

    case 'LONG_QUESTION':
      return (
        <div>
          <label className={`block ${smallLabel} mb-2`}>
            Sample answer or grading rubric
          </label>
          <textarea
            value={question.sampleAnswer}
            onChange={(e) =>
              onUpdate(question.id, 'sampleAnswer', e.target.value)
            }
            placeholder="Provide a sample answer or rubric for grading…"
            className={`${inputClass} min-h-[120px] resize-none`}
          />
        </div>
      );

    case 'MATCHING':
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <span className={smallLabel}>Left column</span>
            <span className={smallLabel}>Right column</span>
          </div>

          {question.pairs.map((pair, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-3 items-center">
              <input
                type="text"
                value={pair.left}
                onChange={(e) => updatePair(idx, 'left', e.target.value)}
                placeholder={`Item ${idx + 1}`}
                className={inputClass}
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={pair.right}
                  onChange={(e) => updatePair(idx, 'right', e.target.value)}
                  placeholder={`Match ${idx + 1}`}
                  className={`${inputClass} flex-1`}
                />

                {question.pairs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePair(idx)}
                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    aria-label="Remove pair"
                  >
                    <FaTrash size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPair}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E30613] hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors mt-2"
          >
            <FaPlus size={10} />
            Add pair
          </button>
        </div>
      );

    default:
      return null;
  }
}