import { FaCalendarAlt, FaChevronRight, FaDownload, FaEdit, FaEye, FaFileAlt, FaFilePdf, FaFileWord, FaStar, FaTrash, FaUsers } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { assessmentService } from "@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService"
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const getFileIcon = (fileName) => {
  if (!fileName) return null;
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return <FaFilePdf className="text-red-500 text-sm" />;
  if (ext === 'docx' || ext === 'doc') return <FaFileWord className="text-blue-500 text-sm" />;
  return <FaFileAlt className="text-gray-500 text-sm" />;
};

export default function AssessmentCard({ item, onViewSubmissions, onDelete }) {
  const navigate = useNavigate();
  const [enrolledCount, setEnrolledCount] = useState(0);
  const { programId } = useParams()
  const location = useLocation()
  const { userType } = useAuth()

  useEffect(() => {
    const getCount = async () => {
      const data = await assessmentService.getEnrollmentCountByProgramId(programId);
      setEnrolledCount(data?.payload)
    }
    getCount()
  }, [location])

  return (
    <div className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 overflow-hidden my-2">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-semibold text-gray-800 text-base">{item.title}</h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt size={12} className="text-gray-400" />
                Start Date: {item.startDate ? new Date(item.startDate).toLocaleString() : 'Not set'}
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt size={12} className="text-gray-400" />
                Due: {item.dueDate ? new Date(item.dueDate).toLocaleString() : 'Not set'}
              </span>
              <span className="flex items-center gap-1.5">
                <FaStar size={12} className="text-amber-400" />
                {item.totalMarks} marks
              </span>
              <span className="flex items-center gap-1.5">
                <FaUsers size={12} className="text-blue-400" />
                {item.submittedCount || 0} / {enrolledCount || 0} submitted
              </span>
            </div>

            {/* File Section */}
            {item.fileUrl && (
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                {getFileIcon(item.fileName)}
                <span className="text-xs text-gray-600 max-w-[200px] truncate">{item.fileName}</span>
                <button
                  onClick={() => assessmentService.downloadAssessmentFile(item.fileUrl, item.fileName)}
                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
                  title="Download"
                >
                  <FaDownload size={10} />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 ml-4">
            <button
              onClick={() => navigate(`${item?.id}`)}
              className="relative group/btn p-2 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
              title="View Submissions"
            >
              <FaEye size={16} />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none">
                Submissions
              </span>
            </button>
            {userType==="FACILITATOR" && <>

              <button
                onClick={() => navigate(`${item?.id}/edit`)}
                className="relative group/btn p-2  text-amber-600 rounded-lg hover:bg-amber-50 transition-all duration-200"
                title="Edit"
              >
                <FaEdit size={16} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none">
                  Edit
                </span>
              </button>
              <button
                onClick={onDelete}
                className="relative group/btn p-2 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                title="Delete"
              >
                <FaTrash size={16} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none">
                  Delete
                </span>
              </button>
            </>}
          </div>
        </div>

        <div className="my-1 border-t border-gray-50 flex justify-end">
          <button
            onClick={() => navigate(`${item?.id}`)}
            className="bg-transparent text-xs font-medium text-blue-600 transition flex items-center gap-1 group/link"
          >
            View Details
            <FaChevronRight size={10} className="group-hover/link:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
}