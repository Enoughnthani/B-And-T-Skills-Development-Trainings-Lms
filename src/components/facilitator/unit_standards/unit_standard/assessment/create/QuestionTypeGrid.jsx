import {
  FaCheckCircle,
  FaFont,
  FaListUl,
  FaPencilAlt,
  FaRegCheckCircle,
} from 'react-icons/fa';

const ICONS = {
  'list': FaListUl,
  'check': FaCheckCircle,
  'font': FaFont,
  'pencil': FaPencilAlt,
  'check-circle': FaRegCheckCircle,
};

export default function QuestionTypeGrid({ questionTypes, onAddQuestion }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
        Add questions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {questionTypes.map((type) => {
          const Icon = ICONS[type.icon] || FaListUl;
          const hasQuestions = type.count > 0;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onAddQuestion(type.id)}
              className="group relative bg-white border border-zinc-200 rounded-xl p-4 text-left hover:border-[#E30613] transition-colors"
            >
              {hasQuestions && (
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#E30613] text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {type.count}
                </span>
              )}

              <div className="w-9 h-9 bg-zinc-100 group-hover:bg-red-50 rounded-lg flex items-center justify-center mb-3 transition-colors">
                <Icon
                  className="text-zinc-600 group-hover:text-[#E30613] transition-colors"
                  size={14}
                />
              </div>

              <div className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-[#E30613] transition-colors leading-snug">
                {type.label}
              </div>

              <div className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
                {type.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}