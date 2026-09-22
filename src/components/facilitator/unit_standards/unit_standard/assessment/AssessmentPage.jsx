import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaSearch, FaBook, FaClipboardList, FaQuestionCircle } from 'react-icons/fa';
import { Accordion, Button } from 'react-bootstrap';
import AssessmentCard from './AssessmentCard';
import SubmissionsModal from './SubmissionsModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { assessmentService } from './services/AssessmentService';
import { useAuth } from '@/contexts/AuthContext';

export default function FacilitatorAssessmentPage() {
  const { unitStandardId } = useParams();
  const [assessments, setAssessments] = useState({ learnerWorkbooks: [], summative: [], tests: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();
  const { userType } = useAuth()
  const isFacilitator = userType === "FACILITATOR";

  useEffect(() => {
    loadAssessments();
  }, [unitStandardId]);


  const [selectedAssessment, setSelectedAssessment] = useState(() => {
    const stored = sessionStorage.getItem("activeAccordion");
    return stored ? JSON.parse(stored) : null;
  });

  const [activeAccordion, setActiveAccordion] = useState(() => {
    const stored = sessionStorage.getItem("activeAccordion");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    loadAssessments();
  }, [unitStandardId]);

  useEffect(() => {
    sessionStorage.setItem("activeAccordion", JSON.stringify(activeAccordion));
  }, [activeAccordion]);


  const loadAssessments = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessments(unitStandardId);
      const data = response?.payload || response || [];

      const grouped = {
        learnerWorkbooks: data?.filter(a => a.type === 'LEARNER_WORKBOOK') || [],
        summative: data?.filter(a => a.type === 'SUMMATIVE') || [],
        tests: data?.filter(a => a.type === 'TEST') || []
      };
      setAssessments(grouped);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = (items) => {
    return items.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Assessments</h1>
            <p className="text-sm text-gray-500 mt-1">
              {userType === 'FACILITATOR' && 'Create and manage learner assessments'}
              {userType === 'ASSESSOR' && 'Review and evaluate learner assessments'}
              {userType === 'MODERATOR' && 'Oversee and validate assessment results'}
            </p>
          </div>
          <div className="flex gap-3">

            {isFacilitator && <Button
              onClick={() => navigate(`new`)}
              variant="outline-primary"
              className='flex items-center gap-2 font-medium'
            >
              <FaPlus size={14} />
              <span>Create</span>
            </Button>}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-all"
            />
          </div>
        </div>

        <Accordion
          activeKey={activeAccordion}
          onSelect={(e) => setActiveAccordion(e)}
          className="space-y-4"
        >

          {/* Tests */}
          {userType === "FACILITATOR" &&
            <Accordion.Item eventKey="0" className="border border-gray-200 rounded overflow-hidden bg-white">
              <Accordion.Header>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <FaQuestionCircle className="text-green-600 text-sm" />
                  </div>
                  <span className="font-medium text-gray-800">Quiz</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
                    {filterItems(assessments.tests).length}
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-4 pt-0">
                {filterItems(assessments.tests).length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaQuestionCircle className="text-gray-400 text-lg" />
                    </div>
                    <p className="text-gray-400 text-sm">No quiz found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filterItems(assessments.tests).map(item => (
                      <AssessmentCard
                        key={item.id}
                        item={item}
                        questions={item.questions}

                        onViewSubmissions={() => {
                          setSelectedAssessment(item);
                          setShowSubmissionsModal(true);
                        }}
                        onDelete={() => {
                          setEditingItem(item);
                          setShowDeleteModal(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          }

          {/* Learner Workbooks */}
          <Accordion.Item eventKey="1" className="border border-gray-200 rounded overflow-hidden bg-white">
            <Accordion.Header>
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaBook className="text-blue-600 text-sm" />
                </div>
                <span className="font-medium text-gray-800">Learner Workbooks</span>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
                  {filterItems(assessments.learnerWorkbooks).length}
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body className="p-4 pt-0">
              {filterItems(assessments.learnerWorkbooks).length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaBook className="text-gray-400 text-lg" />
                  </div>
                  <p className="text-gray-400 text-sm">No learner workbooks found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filterItems(assessments.learnerWorkbooks).map(item => (
                    <AssessmentCard
                      key={item.id}
                      item={item}
                      onViewSubmissions={() => {
                        setSelectedAssessment(item);
                        setShowSubmissionsModal(true);
                      }}
                      onDelete={() => {
                        setEditingItem(item);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* Summative Assessments */}
          <Accordion.Item eventKey="2" className="border border-gray-200 rounded overflow-hidden bg-white">
            <Accordion.Header>
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <FaClipboardList className="text-purple-600 text-sm" />
                </div>
                <span className="font-medium text-gray-800">Summative Assessments</span>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
                  {filterItems(assessments.summative).length}
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body className="p-4 pt-0">
              {filterItems(assessments.summative).length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaClipboardList className="text-gray-400 text-lg" />
                  </div>
                  <p className="text-gray-400 text-sm">No summative assessments found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filterItems(assessments.summative).map(item => (
                    <AssessmentCard
                      key={item.id}
                      item={item}
                      onViewSubmissions={() => {
                        setSelectedAssessment(item);
                        setShowSubmissionsModal(true);
                      }}
                      onDelete={() => {
                        setEditingItem(item);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
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