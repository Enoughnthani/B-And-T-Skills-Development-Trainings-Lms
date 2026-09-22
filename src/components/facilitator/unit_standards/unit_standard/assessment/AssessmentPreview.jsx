import { Card, Table } from 'react-bootstrap';

export default function AssessmentPreview({ assessmentInfo, questions }) {

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-5">
        <h3 className="font-semibold text-gray-800 mb-2">
          {assessmentInfo.title || 'Assessment Preview'}
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          {assessmentInfo.description || 'No description provided'}
        </p>
        <div className="flex gap-4 text-sm text-gray-500 mb-6">
          <span>Duration: {assessmentInfo.duration || 0} min</span>
          <span>Questions: {questions.length}</span>
          <span>Total Marks: {calculateTotalMarks()}</span>
          {assessmentInfo.passingScore && (
            <span>Passing Score: {assessmentInfo.passingScore}%</span>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No questions added yet</p>
            <p className="text-sm mt-1">Add questions in the Questions tab to see preview</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">
                {index + 1}. {question.text || '[Question text]'}
              </p>
              <p className="text-xs text-gray-400 mb-2">({question.marks} marks)</p>

              {/* Preview of answer options based on type */}
              {question.type === 'MULTIPLE_CHOICE' && question.options && (
                <div className="space-y-2 mt-2">
                  {question.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`preview-${question.id}`}
                        disabled
                        className="w-4 h-4 cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-600">
                        {opt || `Option ${String.fromCharCode(65 + idx)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'TRUE_OR_FALSE' && (
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`preview-${question.id}`} disabled className="cursor-not-allowed" />
                    <span className="text-sm text-gray-600">True</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`preview-${question.id}`} disabled className="cursor-not-allowed" />
                    <span className="text-sm text-gray-600">False</span>
                  </label>
                </div>
              )}

              {question.type === 'LONG_QUESTION' && (
                <textarea
                  disabled
                  placeholder="Your answer will be written here..."
                  className="w-full mt-2 p-2 border border-gray-200 rounded text-sm bg-gray-100 cursor-not-allowed"
                  rows={3}
                />
              )}

              {question.type === 'FILL_IN_BLANKS' && (
                <div className="mt-2 p-3 bg-white border border-gray-200 rounded">
                  <p className="text-sm text-gray-600">
                    {question.text && question.text.split('___').map((part, idx) => (
                      <span key={idx}>
                        {part}
                        {idx < (question.blanks?.length || 0) && (
                          <span className="inline-block mx-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded text-green-800 font-medium">
                            {question.blanks[idx]}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    <em>Correct answers shown in green</em>
                  </div>
                </div>
              )}

              {question.type === 'MATCHING' && (
                <div className="mt-2 p-3 bg-white border border-gray-200 rounded">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-xs font-medium text-gray-500">Terms</th>
                        <th className="text-left py-2 text-xs font-medium text-gray-500">Matches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.pairs?.map((pair, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 text-sm text-gray-600">
                            {typeof pair === 'object' ? pair.left : pair || `Item ${idx + 1}`}
                          </td>
                          <td className="py-2">
                            <select
                              disabled
                              className="w-full p-1 border border-gray-200 rounded text-sm bg-gray-100 cursor-not-allowed"
                            >
                              <option>
                                {typeof pair === 'object' ? pair.right : pair || `Match ${idx + 1}`}
                              </option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Show correct answer indicator in preview (helpful for review) */}
              {question.correctAnswer && question.type !== 'LONG_QUESTION' && (
                <div className="mt-2 text-xs text-green-600">
                  <span className="font-medium">Correct answer: </span>
                  {question.type === 'MULTIPLE_CHOICE' && question.correctAnswer}
                  {question.type === 'TRUE_OR_FALSE' && (question.correctAnswer === 'true' ? 'True' : 'False')}
                  {question.type === 'FILL_IN_BLANKS' && question.correctAnswer}
                </div>
              )}
            </div>
          ))
        )}

        {/* Summary Section */}
        {questions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Assessment Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-500">Multiple Choice:</span>
                <span className="ml-2 font-medium">
                  {questions.filter(q => q.type === 'MULTIPLE_CHOICE').length}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-500">True/False:</span>
                <span className="ml-2 font-medium">
                  {questions.filter(q => q.type === 'TRUE_OR_FALSE').length}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-500">Fill in Blanks:</span>
                <span className="ml-2 font-medium">
                  {questions.filter(q => q.type === 'FILL_IN_BLANKS').length}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-500">Long Questions:</span>
                <span className="ml-2 font-medium">
                  {questions.filter(q => q.type === 'LONG_QUESTION').length}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-500">Matching:</span>
                <span className="ml-2 font-medium">
                  {questions.filter(q => q.type === 'MATCHING').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}