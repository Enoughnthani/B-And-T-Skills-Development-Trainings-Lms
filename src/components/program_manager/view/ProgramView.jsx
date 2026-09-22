import { apiFetch } from '@/api/api';
import { BASE_URL, ENROLLMENT, PROGRAMS, USERS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import {
    FaArrowLeft,
    FaAward,
    FaBuilding,
    FaCalendarAlt,
    FaChalkboardTeacher,
    FaEdit,
    FaMapMarkerAlt,
    FaTimesCircle,
    FaTrash,
    FaUserPlus,
    FaUsers
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import AddStaffModal from '../modals/AddStaffModal';
import AnalyticTab from '../tabs/AnalyticTab';
import EnrolledUsersTab from '../tabs/EnrolledUsersTab';
import EnrollmentModal from '../modals/EnrollmentModal';
import ProgramDetailsTab from '../tabs/ProgramDetailsTab';
import ProgramStaffTab from '../tabs/ProgramStaffTab';

const ProgramView = ({ onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Enrollment modal states
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [allLearners, setAllLearners] = useState([]);
    const [filteredLearners, setFilteredLearners] = useState([]);
    const [learnerSearchTerm, setLearnerSearchTerm] = useState('');
    const [loadingLearners, setLoadingLearners] = useState(false);
    const [response, setResponse] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [showStaffModal, setShowStaffModal] = useState(false);


    const [enrolledusers, setEnrolledusers] = useState([]);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        gender: '',
        status: '',
        searchBy: 'name' // 'name', 'email', 'idNo'
    });

    useEffect(() => {
        fetchProgram();
    }, [id, showEnrollModal, showStaffModal,]);

    const fetchProgram = async () => {
        setLoading(true);
        try {
            const result = await apiFetch(`${PROGRAMS}/${id}`);
            if (result?.payload) {
                setProgram(result.payload);

            } else {
                setError('Program not found');
            }
        } catch (error) {
            console.error('Error fetching program:', error);
            setError('Failed to load program details');
        } finally {
            setLoading(false);
        }
    };


    const fetchAllLearners = async () => {
        setLoadingLearners(true);
        try {
            // Fetch learners based on program category
            const endpoint = program?.category === 'INTERNSHIP' ? '/interns' : '/learners';
            const result = await apiFetch(`${USERS}${endpoint}`);
            if (result?.payload) {
                setAllLearners(result.payload);
                setFilteredLearners(result.payload);
            }
        } catch (error) {
            console.error('Error fetching learners:', error);
        } finally {
            setLoadingLearners(false);
        }
    };


    // Open enrollment modal and fetch learners
    const openEnrollModal = () => {
        setShowEnrollModal(true);
        fetchAllLearners();
        setLearnerSearchTerm('');
        setFilters({ gender: '', status: '', searchBy: 'name' });
        setShowFilters(false);
    };

    // Handle single staff selection
    const handleSelectStaff = (staffId) => {
        const newSelected = new Set(selectedStaff);
        if (newSelected.has(staffId)) {
            newSelected.delete(staffId);
        } else {
            newSelected.add(staffId);
        }
        setSelectedStaff(newSelected);
        setSelectAll(newSelected.size === assignedStaff.length);
    };

    // Handle select all
    const handleSelectAllStaff = () => {
        if (selectAll) {
            setSelectedStaff(new Set());
        } else {
            setSelectedStaff(new Set(assignedStaff.map(s => s.id)));
        }
        setSelectAll(!selectAll);
    };


    // Filter and search learners
    useEffect(() => {
        let filtered = [...allLearners];

        // Apply search
        if (learnerSearchTerm) {
            filtered = filtered.filter(learner => {
                const searchLower = learnerSearchTerm.toLowerCase();
                switch (filters.searchBy) {
                    case 'email':
                        return learner.email?.toLowerCase().includes(searchLower);
                    case 'idNo':
                        return learner.idNo?.toLowerCase().includes(searchLower);
                    default:
                        return learner.firstname?.toLowerCase().includes(searchLower) ||
                            learner.lastname?.toLowerCase().includes(searchLower) ||
                            `${learner.firstname} ${learner.lastname}`.toLowerCase().includes(searchLower);
                }
            });
        }

        // Apply gender filter
        if (filters.gender) {
            filtered = filtered.filter(learner => learner.gender === filters.gender);
        }

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(learner => learner.status === filters.status);
        }

        setFilteredLearners(filtered);
    }, [learnerSearchTerm, filters, allLearners]);


    const handleRemove = async (user) => {

        try {
            const result = await apiFetch(`${ENROLLMENT}/remove`, {
                method: "DELETE",
                body: {
                    programId: program.id,
                    userId: user.id,
                }
            });

            setResponse(result);
            fetchProgram()
        } catch (e) {
            setResponse({ success: false, message: "Enroll failed" });
        } finally {
        }
    };



    const getCategoryColor = (category) => {
        const colors = {
            'SHORT_COURSE': 'from-blue-500 to-blue-600',
            'LEARNERSHIP': 'from-blue-500 to-sky-600',
            'INTERNSHIP': 'from-sky-500 to-sky-600'
        };
        return colors[category] || 'from-gray-500 to-gray-600';
    };

    const getCategoryBadgeColor = (category) => {
        const colors = {
            'SHORT_COURSE': 'bg-blue-100 text-blue-800',
            'LEARNERSHIP': 'bg-blue-100 text-sky-800',
            'INTERNSHIP': 'bg-amber-100 text-amber-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        const colors = {
            'NOTSTARTED': 'bg-gray-100 text-gray-800',
            'INPROGRESS': 'bg-blue-100 text-blue-800',
            'COMPLETED': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            'NOTSTARTED': 'Not Started',
            'INPROGRESS': 'In Progress',
            'COMPLETED': 'Completed',
            'CANCELLED': 'Cancelled'
        };
        return texts[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getEnrollmentPercentage = () => {
        if (!program?.capacity) return 0;
        return (program.enrolledCount / program.capacity) * 100;
    };




    const handleSelectUser = (id) => {
        const newSet = new Set(selectedUsers);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);

        setSelectedUsers(newSet);
        //setSelectAll(newSet.size === enrolledusers.length && enrolledusers.length > 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading program details...</p>
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FaTimesCircle className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-yellow-800">
                                    {error || 'Program Not Found'}
                                </h3>
                                <p className="mt-2 text-sm text-yellow-700">
                                    {error || "The program you're looking for doesn't exist or has been removed."}
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/user/program-manager/programs')}
                                        className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                                    >
                                        <FaArrowLeft className="mr-2" /> Back to Programs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto">
            {/* Delete Confirmation Modal - React Bootstrap */}
            <Modal
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                centered
                className="text-gray-900"
            >
                <Modal.Body className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <FaTrash className="text-red-600 text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Delete Program?</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete "{program.name}"? This action cannot be undone and will remove all associated data.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="light"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => onDelete && onDelete(program)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition border-0"
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>



            <AddStaffModal
                show={showStaffModal}
                setShow={setShowStaffModal}
                program={program}
            //onSuccess={handleStaffChange}
            />


            <EnrollmentModal
                show={showEnrollModal}
                setShow={setShowEnrollModal}
                program={program}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                {/* Header Navigation */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded inline-flex items-center gap-2 px-4 py-2 bg-white border text-muted"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition" />
                        Back
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={openEnrollModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                        >
                            <FaUserPlus /> Enroll {program.category === 'INTERNSHIP' ? 'Intern' : 'Learner'}
                        </button>
                        <button
                            onClick={() => setShowStaffModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
                        >
                            <FaChalkboardTeacher />
                            {program.category === 'INTERNSHIP' ? 'Add Mentor' : 'Add Program Staff'}
                        </button>
                    </div>
                </div>

                
                <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                    <div className="absolute inset-0">
                        <img
                            src={`${BASE_URL}${program.imageBase64}`}
                            alt={program.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(program.category)} opacity-50`} />

                    <div className="relative px-6 py-12 lg:py-16 ">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-6">
                                <div className="flex flex-wrap gap-3">
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getCategoryBadgeColor(program.category)}`}>
                                        {program.category}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(program.status)}`}>
                                        {getStatusText(program.status)}
                                    </span>
                                    {program.featured && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800">
                                            <FaAward className="w-3 h-3" /> Featured
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {program.name}
                                </h1>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaMapMarkerAlt className="w-4 h-4" />
                                        <span>{program.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaCalendarAlt className="w-4 h-4" />
                                        <span>{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaBuilding className="w-4 h-4" />
                                        <span>Type: {program.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaUsers className="w-4 h-4" />
                                        <span>{program.enrolledCount}/{program.capacity} enrolled</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="w-full lg:w-80">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                    <div className="text-center space-y-4">
                                        <div className="text-white/80 text-sm font-medium">Enrollment Status</div>
                                        <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getEnrollmentPercentage() >= 100 ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                                            {getEnrollmentPercentage() >= 100 ? 'Fully Booked' : `${getEnrollmentPercentage().toFixed(0)}% Filled`}
                                        </div>
                                        {getEnrollmentPercentage() < 100 && (
                                            <div className="mt-2">
                                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${getEnrollmentPercentage()}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-white/60 text-xs flex items-center justify-center gap-1">
                                            <FaUsers className="w-3 h-3" />
                                            {program.capacity - program.enrolledCount} seats remaining
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex gap-6 overflow-x-auto">
                        {[
                            { key: 'overview', label: 'Overview' },
                            {
                                key: 'mentors',
                                label: program?.category === 'INTERNSHIP' ? 'Mentors' : 'Staff'
                            },
                            {
                                key: 'participants',
                                label: program?.category === 'INTERNSHIP' ? 'Interns' : 'Learners'
                            },
                            { key: 'analytics', label: 'Analytics' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-3 bg-transparent px-1 text-sm font-medium transition-colors relative ${activeTab === tab.key
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    {activeTab === 'overview' && (
                        <ProgramDetailsTab program={program} />
                    )}

                    {activeTab === 'mentors' && (
                        <ProgramStaffTab
                            program={program}
                            onAddStaff={() => setShowStaffModal(true)}
                            setProgram={setProgram}
                        />
                    )}


                    {activeTab === 'participants' && (
                        <EnrolledUsersTab
                            setProgram={setProgram}
                            program={program}
                            openEnrollModal={openEnrollModal}
                            formatDate={formatDate}
                        />
                    )}

                    {activeTab === 'analytics' && (
                        <AnalyticTab getEnrollmentPercentage={getEnrollmentPercentage} program={program} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgramView;