import { useEffect, useState } from 'react';
import {
  FaBook,
  FaChevronDown,
  FaClipboardList,
  FaPlus,
  FaQuestionCircle,
  FaSearch,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentCard from './AssessmentCard';
import DeleteConfirmModal from './DeleteConfirmModal';
import SubmissionsModal from './SubmissionsModal';
import { assessmentService } from './services/AssessmentService';

const GROUPS = [
  {
    key: 'tests',
    label: 'Quizzes',
    icon: FaQuestionCircle,
    emptyLabel: 'No quizzes yet.',
    eventKey: 'tests',
  },
  {
    key: 'learnerWorkbooks',
    label: 'Learner workbooks',
    icon: FaBook,
    emptyLabel: 'No learner workbooks yet.',
    eventKey: 'workbooks',
  },
  {
    key: 'summative',
    label: 'Summative assessments',
    icon: FaClipboardList,
    emptyLabel: 'No summative assessments yet.',
    eventKey: 'summative',
  },
];

export default function FacilitatorAssessmentPage() {
  const { unitStandardId } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();

  const [assessments, setAssessments] = useState({
    learnerWorkbooks: [],
    summative: [],
    tests: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [openGroups, setOpenGroups] = useState(() => {
    try {
      const stored = sessionStorage.getItem('assessmentAccordion');
      return stored ? JSON.parse(stored) : ['tests'];
    } catch {
      return ['tests'];
    }
  });

  const isFacilitator = userType === 'FACILITATOR';

  useEffect(() => {
    loadAssessments();
  }, [unitStandardId]);

  useEffect(() => {
    sessionStorage.setItem('assessmentAccordion', JSON.stringify(openGroups));
  }, [openGroups]);

  async function loadAssessments() {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessments(unitStandardId);
      const data = response?.payload || response || [];

      setAssessments({
        learnerWorkbooks: data.filter((a) => a.type === 'LEARNER_WORKBOOK'),
        summative: data.filter((a) => a.type === 'SUMMATIVE'),
        tests: data.filter((a) => a.type === 'TEST'),
      });
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }

  function toggleGroup(key) {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function filterItems(items) {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      item.title?.toLowerCase().includes(term)
    );
  }

  function handleViewSubmissions(item) {
    setSelectedAssessment(item);
    setShowSubmissionsModal(true);
  }

  function handleDelete(item) {
    setEditingItem(item);
    setShowDeleteModal(true);
  }

  const subtitle = {
    FACILITATOR: 'Create and manage learner assessments.',
    ASSESSOR: 'Review and evaluate learner assessments.',
    MODERATOR: 'Oversee and validate assessment results.',
  }[userType] || 'Manage assessments for this module.';

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading assessments…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            Assessments
          </h1>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>

        {isFacilitator && (
          <button
            onClick={() => navigate('new')}
            className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 w-full sm:w-auto"
          >
            <FaPlus size={12} />
            Create assessment
          </button>
        )}
      </div>

      <div className="relative mb-5">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
        <input
          type="text"
          placeholder="Search assessments…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
        />
      </div>

      <div className="space-y-3">
        {GROUPS.map((group) => {
          if (group.key === 'tests' && !isFacilitator) return null;

          const Icon = group.icon;
          const isOpen = openGroups.includes(group.eventKey);
          const items = filterItems(assessments[group.key]);

          return (
            <div
              key={group.key}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleGroup(group.eventKey)}
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="text-zinc-600" size={14} />
                  </div>
                  <span className="font-bold text-zinc-900 truncate">
                    {group.label}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full shrink-0">
                    {items.length}
                  </span>
                </div>

                <FaChevronDown
                  size={12}
                  className={`text-zinc-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-zinc-100 p-3 sm:p-4">
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="text-zinc-400" size={18} />
                      </div>
                      <p className="text-sm text-zinc-500">
                        {searchTerm
                          ? 'No assessments match your search.'
                          : group.emptyLabel}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <AssessmentCard
                          key={item.id}
                          item={item}
                          questions={item.questions}
                          onViewSubmissions={() => handleViewSubmissions(item)}
                          onDelete={() => handleDelete(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SubmissionsModal
        show={showSubmissionsModal}
        onHide={() => setShowSubmissionsModal(false)}
        assessment={selectedAssessment}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        item={editingItem}
        onRefresh={loadAssessments}
      />
    </div>
  );
}