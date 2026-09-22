export default function QuestionTypeGrid({ questionTypes, onAddQuestion }) {
  return (
    <div className="my-3">
      <h3 className="font-semibold text-gray-800 mb-3">Add Questions</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {questionTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onAddQuestion(type.id)}
            className="bg-white relative border border-gray-200 rounded-lg p-4 text-center hover:shadow-md hover:border-blue-300 transition"
          >
            <div className='absolute top-1 right-1 bg-sky-200 w-5 h-5 flex items-center justify-center text-sm rounded-full text-blue-700 font-semibold'>
              <span>{type.count}</span>
            </div>
            <div className="text-2xl text-blue-500 mb-2">{type.icon}</div>
            <div className="text-sm font-medium text-gray-700">{type.label}</div>
            <div className="text-xs text-gray-400 mt-1">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}