import { Card } from 'react-bootstrap';
import { FaFileAlt, FaTimes } from 'react-icons/fa';

export default function AssessmentInfoForm({ assessmentInfo, setAssessmentInfo, existingFile, setExistingFile, selectedFile, setSelectedFile }) {

  return (
    <Card className="border-0 shadow-sm mb-6">
      <Card.Body className="p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Assessment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Type *</label>
            <select
              value={assessmentInfo.type}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="LEARNER_WORKBOOK">📘 Learner Workbook</option>
              <option value="SUMMATIVE">📋 Summative</option>
              <option value="TEST">📝 Quiz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={assessmentInfo.title}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, title: e.target.value })}
              placeholder="Enter assessment title"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="datetime-local"
              value={assessmentInfo.startDate}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={assessmentInfo.dueDate}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={assessmentInfo.duration}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, duration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
            <input
              type="number"
              value={assessmentInfo.totalMarks}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, totalMarks: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={assessmentInfo.description}
              onChange={(e) => setAssessmentInfo({ ...assessmentInfo, description: e.target.value })}
              rows={2}
              placeholder="Instructions for learners..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        {assessmentInfo?.type !== "TEST" &&
          < div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment File (Optional)</label>
            {existingFile && !selectedFile && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-gray-500 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{existingFile.name}</p>
                    <p className="text-xs text-gray-400">Already uploaded</p>
                  </div>
                </div>
                <button type="button" onClick={() => setExistingFile(null)} className="text-gray-400 hover:text-red-500 transition">
                  <FaTimes size={16} />
                </button>
              </div>
            )}
            <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors ${!existingFile || selectedFile ? 'border-gray-200' : 'border-green-200'}`}>
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" id="assessment-file" />
              <label htmlFor="assessment-file" className="cursor-pointer block">
                <FaFileAlt className="mx-auto text-3xl mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : (existingFile ? 'Replace with new file' : 'Click to upload assessment file')}</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT up to 10MB</p>
              </label>
            </div>
          </div>
        }
      </Card.Body>
    </Card >
  );
}