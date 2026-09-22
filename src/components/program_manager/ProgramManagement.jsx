import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaBook, FaFilter, FaPlus, FaSearch, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DeleteProgramModal from './modals/DeleteProgramModal';
import ProgramFiltersOffcanvas from './modals/ProgramFiltersOffcanvas';
import ViewProgramModal from './modals/ViewModalProgram';
import ProgramGrid from './grid-view/ProgramGrid';
import ProgramList from './list-view/ProgramList';
import { categories, statuses } from './utils/constants';

export default function ProgramManagement() {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFiltersOffcanvas, setShowFiltersOffcanvas] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("viewMode") || "list";
    });
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPrograms();
    }, [])

    const toggleViewMode = () => {
        const newMode = viewMode === "grid" ? "list" : "grid";
        setViewMode(newMode);
        localStorage.setItem("viewMode", newMode);
        setCurrentPage(1); // Reset to first page when changing view mode
    };

    const getPrograms = async () => {
        try {
            const result = await apiFetch(`${PROGRAMS}`, { method: 'GET' });
            setPrograms(result?.payload || []);
        } catch (error) {
            setResponse({ success: false, message: 'Failed to fetch programs' });
        }
    }

    const itemsPerPage = viewMode === 'grid' ? 8 : 10;

    useEffect(() => {
        let result = programs;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(program =>
                program.name.toLowerCase().includes(term) ||
                program.description.toLowerCase().includes(term) ||
                program.facilitator.toLowerCase().includes(term) ||
                program.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        }

        if (selectedCategory !== 'all') {
            result = result.filter(program => program.category === selectedCategory);
        }

        if (selectedStatus !== 'all') {
            result = result.filter(program => program.status === selectedStatus);
        }

        if (selectedType !== 'all') {
            result = result.filter(program => program.type === selectedType);
        }

        result.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setFilteredPrograms(result);
        setCurrentPage(1);
    }, [programs, searchTerm, selectedCategory, selectedStatus, selectedType, sortConfig]);

    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAddProgram = () => {
        navigate('new')
    };

    const handleEditProgram = (program) => {
        navigate(`${program?.id}/edit`, { state: { program } })
    };

    const handleDeleteProgram = (program) => {
        setSelectedProgram(program);
        setShowDeleteModal(true);
    };

    const getCategoryIcon = (category) => {
        const cat = categories.find(c => c.id === category);
        if (!cat) return <FaBook />;
        switch (cat.icon) {
            case 'FaBook': return <FaBook />;
            case 'FaUserTie': return <FaUserTie />;
            case 'FaGraduationCap': return <FaGraduationCap />;
            default: return <FaBook />;
        }
    };

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.color : 'gray';
    };

    const getStatusBadge = (status) => {
        const statusConfig = statuses.find(s => s.id === status);
        return (
            <Badge bg={statusConfig?.color || 'secondary'} className="rounded-md">
                {statusConfig?.label || status?.replaceAll('_',' ')}
            </Badge>
        );
    };

    const getTypeBadge = (type) => {
        return (
            <Badge bg={'secondary'} className="rounded-md w-[90px] text-uppercase">
                {type}
            </Badge>
        );
    };

    const getActions = (program) => {
        return (
            <Dropdown onClick={(e) => e.stopPropagation()} className="ms-auto">
                <Dropdown.Toggle
                    size="lg"
                    className="w-full z-[9999] bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-2 py-1 rounded-md inline-flex items-center justify-around"
                >
                    ACTION
                </Dropdown.Toggle>
                <Dropdown.Menu className="px-auto min-w-[140px] bg-slate-50 border border-gray-200 rounded-md shadow-lg">
                    {[
                        {
                            label: "VIEW",
                            event: () => navigate(`${program?.id}`),
                            style: "text-gray-800 hover:bg-gray-700",
                        },
                        {
                            label: "EDIT",
                            event: () => handleEditProgram(program),
                            style: "text-yellow-800 hover:bg-yellow-700",
                        },
                        {
                            label: "DELETE",
                            event: () => handleDeleteProgram(program),
                            style: "text-red-800 hover:bg-red-700",
                        },
                    ].map((action, idx) => (
                        <Dropdown.Item
                            key={idx}
                            onClick={action?.event}
                            className={action?.style + ' font-semibold hover:text-slate-50 rounded-md px-4 '}
                        >
                            {action?.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    function handleProgramClick(program) {
        navigate(`${program?.id}`)
    }

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedStatus('all');
        setSelectedType('all');
        setSearchTerm('');
    };

    return (
        <div className="h-screen w-full p-3">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-start">
                        <div className="space-y-3">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    Programs Management
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm md:text-base">
                                    Manage short courses, learnership programs, and internships
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 ms-auto">
                            <Button
                                variant="outline-secondary"
                                onClick={toggleViewMode}
                                className="flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? 'List View' : 'Grid View'}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowFiltersOffcanvas(true)}
                                className="flex items-center gap-2"
                            >
                                <FaFilter /> Filters
                            </Button>
                            <Button
                                onClick={handleAddProgram}
                                className="flex items-center gap-2"
                            >
                                <FaPlus /> Add Program
                            </Button>
                        </div>
                    </div>
                </div>

             
                {alert.show && (
                    <Alert
                        variant={alert.variant}
                        onClose={() => setAlert({ ...alert, show: false })}
                        dismissible
                        className="mb-4"
                    >
                        {alert.message}
                    </Alert>
                )}

           
                <Card className="border-0 shadow-sm mb-6">
                    <Card.Body className="p-4">
                        <div className="flex gap-4">
                            <InputGroup className="flex-1">
                                <InputGroup.Text className="bg-white border-r-0">
                                    <FaSearch className="text-gray-500" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search programs by name, description, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-l-0"
                                />
                            </InputGroup>
                            {(selectedCategory !== 'all' || selectedStatus !== 'all' || selectedType !== 'all' || searchTerm) && (
                                <Button variant="outline-danger" onClick={resetFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>

               
                {viewMode === 'grid' ? (
                    <ProgramGrid
                        programs={filteredPrograms}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onProgramClick={handleProgramClick}
                        onAddProgram={handleAddProgram}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColor={getCategoryColor}
                        getStatusBadge={getStatusBadge}
                        getActions={getActions}
                    />
                ) : (
                    <ProgramList
                        programs={filteredPrograms}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalPages={totalPages}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onPageChange={setCurrentPage}
                        onProgramClick={handleProgramClick}
                        onAddProgram={handleAddProgram}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColor={getCategoryColor}
                        getStatusBadge={getStatusBadge}
                        getTypeBadge={getTypeBadge}
                        getActions={getActions}
                    />
                )}
            </div>

            <ViewProgramModal
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
                program={selectedProgram}
                onEdit={handleEditProgram}
                getCategoryIcon={getCategoryIcon}
                getStatusBadge={getStatusBadge}
            />

            <DeleteProgramModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                program={selectedProgram}
                setResponse={setResponse}
                getPrograms={getPrograms}
            />

            <ProgramFiltersOffcanvas
                show={showFiltersOffcanvas}
                onHide={() => setShowFiltersOffcanvas(false)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                onApply={() => setShowFiltersOffcanvas(false)}
                onReset={resetFilters}
            />
        </div>
    );
}