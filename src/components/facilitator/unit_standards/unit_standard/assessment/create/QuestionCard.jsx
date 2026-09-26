import { FaCopy, FaTrash } from 'react-icons/fa';
import QuestionEditor from './QuestionEditor';

export default function QuestionCard({
  question,
  index,
  questionTypes,
  onUpdate,
  onDuplicate,
  onDelete,
}) {
  const typeLabel =
    questionTypes.find((t) => t.id === question.type)?.label || question.type;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
            Q{index + 1}
          </span>

          <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider truncate">
            {typeLabel}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              value={question.marks}
              onChange={(e) => onUpdate(question.id, 'marks', e.target.value)}
              placeholder="0"
              className="w-14 px-2 py-1 text-xs text-center bg-white border border-zinc-300 rounded focus:border-[#E30613] outline-none transition-colors tabular-nums"
            />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {question.marks === '1' || question.marks === 1 ? 'mark' : 'marks'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onDuplicate(question)}
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Duplicate question"
            title="Duplicate"
          >
            <FaCopy size={12} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete question"
            title="Delete"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <input
          type="text"
          value={question.text}
          onChange={(e) => onUpdate(question.id, 'text', e.target.value)}
          placeholder="Enter your question here…"
          className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors mb-4"
        />

        <QuestionEditor question={question} onUpdate={onUpdate} />

        <div className="mt-4">
          <textarea
            value={question.explanation}
            onChange={(e) => onUpdate(question.id, 'explanation', e.target.value)}
            placeholder="Explanation (optional) — shown to learners after they answer."
            rows={2}
            className="w-full px-3.5 py-2.5 text-sm text-zinc-600 bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}