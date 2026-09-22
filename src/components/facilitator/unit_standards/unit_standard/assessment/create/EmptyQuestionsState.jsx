import { FaPlusCircle } from 'react-icons/fa';

export default function EmptyQuestionsState() {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
      <FaPlusCircle className="text-gray-300 text-5xl mx-auto mb-3" />
      <p className="text-gray-500">No questions added yet</p>
      <p className="text-sm text-gray-400 mt-1">Click on any question type above to start building your assessment</p>
    </div>
  );
}