import { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaChevronRight,
  FaDownload,
  FaEdit,
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaStar,
  FaTrash,
  FaUsers,
} from 'react-icons/fa';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { assessmentService } from './services/AssessmentService';

function getFileIcon(fileName) {
  if (!fileName) return null;
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return <FaFilePdf className="text-zinc-500" size={11} />;
  if (ext === 'docx' || ext === 'doc')
    return <FaFileWord className="text-zinc-500" size={11} />;
  return <FaFileAlt className="text-zinc-500" size={11} />;
}

function formatDateTime(value) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AssessmentCard({ item, onDelete }) {
  const navigate = useNavigate();
  const { programId } = useParams();
  const location = useLocation();
  const { userType } = useAuth();
  const [enrolledCount, setEnrolledCount] = useState(0);

  const isFacilitator = userType === 'FACILITATOR';

  useEffect(() => {
    async function load() {
      try {
        const data = await assessmentService.getEnrollmentCountByProgramId(
          programId
        );
        setEnrolledCount(data?.payload || 0);
      } catch {
        // ignore
      }
    }
    load();
  }, [programId, location]);

  const submitted = item.submittedCount || 0;
  const enrolled = enrolledCount || 0;

  return (
    <div className="group bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition-colors overflow-hidden">

      <div className="p-4 sm:p-5">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base truncate mb-1">
              {item.title}
            </h3>

            {item.description && (
              <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <FaCalendarAlt size={10} className="text-zinc-400" />
                {formatDateTime(item.startDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaCalendarAlt size={10} className="text-zinc-400" />
                Due {formatDateTime(item.dueDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaStar size={10} className="text-zinc-400" />
                {item.totalMarks || 0} marks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaUsers size={10} className="text-zinc-400" />
                {submitted} / {enrolled} submitted
              </span>
            </div>

            {item.fileUrl && (
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg max-w-full">
                {getFileIcon(item.fileName)}
                <span className="text-xs text-zinc-700 truncate max-w-[180px]">
                  {item.fileName}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    assessmentService.downloadAssessmentFile(
                      item.fileUrl,
                      item.fileName
                    );
                  }}
                  className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-white rounded transition-colors"
                  aria-label="Download file"
                >
                  <FaDownload size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 sm:ml-4">
            <ActionButton
              icon={FaChevronRight}
              title="Open"
              onClick={() => navigate(`${item.id}`)}
            />

            {isFacilitator && (
              <>
                <ActionButton
                  icon={FaEdit}
                  title="Edit"
                  onClick={() => navigate(`${item.id}/edit`)}
                />
                <ActionButton
                  icon={FaTrash}
                  title="Delete"
                  variant="danger"
                  onClick={onDelete}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`${item.id}`)}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#E30613] hover:bg-red-50 border-t border-zinc-100 transition-colors"
      >
        View submissions
        <FaChevronRight size={9} />
      </button>
    </div>
  );
}

function ActionButton({ icon: Icon, title, onClick, variant = 'default' }) {
  const isDanger = variant === 'danger';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
        isDanger
          ? 'text-zinc-400 hover:text-[#E30613] hover:bg-red-50'
          : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
      }`}
      aria-label={title}
      title={title}
    >
      <Icon size={14} />
    </button>
  );
}