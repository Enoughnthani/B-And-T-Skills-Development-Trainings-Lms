const QUESTION_TYPE_LABELS = {
  MULTIPLE_CHOICE: 'Multiple choice',
  TRUE_OR_FALSE: 'True / False',
  FILL_IN_BLANKS: 'Fill in blanks',
  LONG_QUESTION: 'Long question',
  MATCHING: 'Matching',
};

const SUMMARY_TYPES = [
  'MULTIPLE_CHOICE',
  'TRUE_OR_FALSE',
  'FILL_IN_BLANKS',
  'LONG_QUESTION',
  'MATCHING',
];

export default function AssessmentPreview({ assessmentInfo, questions = [] }) {
  const totalMarks = questions.reduce(
    (sum, q) => sum + (parseInt(q.marks, 10) || 0),
    0
  );

  const hasQuestions = questions.length > 0;

  return (
    <div className="space-y-5">

      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 mb-1 break-words">
          {assessmentInfo.title || 'Assessment preview'}
        </h2>

        <p className="text-sm text-zinc-500 mb-4 break-words">
          {assessmentInfo.description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600">
          <MetaItem label="Duration" value={`${assessmentInfo.duration || 0} min`} />
          <MetaItem label="Questions" value={questions.length} />
          <MetaItem label="Total marks" value={totalMarks} />
          {assessmentInfo.passingScore && (
            <MetaItem
              label="Passing score"
              value={`${assessmentInfo.passingScore}%`}
            />
          )}
        </div>
      </div>

      {!hasQuestions ? (
        <EmptyPreview />
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionPreview
              key={question.id}
              question={question}
              index={index}
            />
          ))}
        </div>
      )}

      {hasQuestions && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            Assessment summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SUMMARY_TYPES.map((type) => {
              const count = questions.filter((q) => q.type === type).length;
              return (
                <div
                  key={type}
                  className="bg-zinc-50 border border-zinc-100 rounded-lg p-3"
                >
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    {QUESTION_TYPE_LABELS[type]}
                  </div>
                  <div className="text-lg font-extrabold text-zinc-900 tabular-nums">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="font-bold text-zinc-900">{value}</span>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-zinc-400 text-xl">?</span>
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No questions yet</h3>
      <p className="text-sm text-zinc-500">
        Add questions in the Build tab to see a preview.
      </p>
    </div>
  );
}

function QuestionPreview({ question, index }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">

      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
            Q{index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider truncate">
            {QUESTION_TYPE_LABELS[question.type] || question.type}
          </span>
        </div>

        <span className="text-[11px] font-bold text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
          {question.marks || 0} {question.marks === 1 || question.marks === '1' ? 'mark' : 'marks'}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-sm font-medium text-zinc-900 mb-3 break-words">
          {question.text || '[Question text not provided]'}
        </p>

        <QuestionAnswerPreview question={question} />
      </div>
    </div>
  );
}

function QuestionAnswerPreview({ question }) {
  if (question.type === 'MULTIPLE_CHOICE') {
    return (
      <div className="space-y-2">
        {(question.options || []).map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isCorrect = question.correctAnswer === opt;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${
                isCorrect
                  ? 'bg-red-50 border-[#E30613]'
                  : 'bg-white border-zinc-200'
              }`}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold shrink-0 ${
                  isCorrect ? 'bg-[#E30613] text-white' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {letter}
              </span>
              <span
                className={`text-sm break-words ${
                  isCorrect ? 'text-zinc-900 font-medium' : 'text-zinc-600'
                }`}
              >
                {opt || `Option ${letter}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (question.type === 'TRUE_OR_FALSE') {
    const isTrue = question.correctAnswer === 'true';
    return (
      <div className="flex gap-2">
        {[
          { value: 'true', label: 'True', correct: isTrue },
          { value: 'false', label: 'False', correct: !isTrue },
        ].map((opt) => (
          <span
            key={opt.value}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border ${
              opt.correct
                ? 'bg-[#E30613] text-white border-[#E30613]'
                : 'bg-white text-zinc-600 border-zinc-200'
            }`}
          >
            {opt.label}
          </span>
        ))}
      </div>
    );
  }

  if (question.type === 'LONG_QUESTION') {
    return (
      <div className="border border-dashed border-zinc-300 rounded-lg bg-zinc-50 p-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Sample answer or rubric
        </p>
        <p className="text-sm text-zinc-600 whitespace-pre-line break-words">
          {question.sampleAnswer || 'No sample answer provided.'}
        </p>
      </div>
    );
  }

  if (question.type === 'FILL_IN_BLANKS') {
    const parts = question.text?.split('___') || [];
    const blanks = question.blanks || [];

    return (
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
        <p className="text-sm text-zinc-700 leading-relaxed break-words">
          {parts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < blanks.length && (
                <span className="inline-block mx-1 px-2 py-0.5 bg-[#E30613] text-white rounded text-xs font-bold">
                  {blanks[idx] || '—'}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
    );
  }

  if (question.type === 'MATCHING') {
    return (
      <div className="border border-zinc-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 bg-zinc-50 border-b border-zinc-200">
          <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Term
          </div>
          <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-l border-zinc-200">
            Match
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {(question.pairs || []).map((pair, idx) => {
            const left = typeof pair === 'object' ? pair.left : pair;
            const right = typeof pair === 'object' ? pair.right : pair;

            return (
              <div key={idx} className="grid grid-cols-2">
                <div className="px-4 py-2.5 text-sm text-zinc-700 break-words">
                  {left || `Item ${idx + 1}`}
                </div>
                <div className="px-4 py-2.5 text-sm text-zinc-700 border-l border-zinc-100 break-words">
                  {right || `Match ${idx + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}