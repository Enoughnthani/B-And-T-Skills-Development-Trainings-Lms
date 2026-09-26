import { FaPlusCircle } from 'react-icons/fa';

export default function EmptyQuestionsState() {
  return (
    <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaPlusCircle className="text-zinc-400" size={20} />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No questions yet</h3>
      <p className="text-sm text-zinc-500 max-w-sm mx-auto">
        Click on any question type above to start building your assessment.
      </p>
    </div>
  );
}