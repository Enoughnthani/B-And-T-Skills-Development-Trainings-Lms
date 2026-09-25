import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import {
  Card,
  Dropdown,
  Form,
  InputGroup,
} from 'react-bootstrap';
import {
  FaBook,
  FaFilter,
  FaGraduationCap,
  FaList,
  FaPlus,
  FaSearch,
  FaThLarge,
  FaUserTie,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DeleteProgramModal from './modals/DeleteProgramModal';
import ProgramFiltersOffcanvas from './modals/ProgramFiltersOffcanvas';
import ProgramGrid from './programmes/ProgramGrid';
import ProgramList from './programmes/ProgramList';
import { categories, statuses } from './utils/constants';

export default function ProgramManagement() {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFiltersOffcanvas, setShowFiltersOffcanvas] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'list';
  });
  const [selectedProgram, setSelectedProgram] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPrograms();
  }, []);

  const getPrograms = async () => {
    try {
      const result = await apiFetch(`${PROGRAMS}`, { method: 'GET' });
      setPrograms(result?.payload || []);
    } catch (error) {
      // silently fail
    }
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
    setCurrentPage(1);
  };

  const itemsPerPage = viewMode === 'grid' ? 8 : 10;

  useEffect(() => {
    let result = programs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (program) =>
          program.name.toLowerCase().includes(term) ||
          program.description.toLowerCase().includes(term) ||
          program.facilitator?.toLowerCase().includes(term) ||
          program.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((program) => program.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((program) => program.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      result = result.filter((program) => program.type === selectedType);
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
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleAddProgram = () => navigate('new');

  const handleEditProgram = (program) => {
    navigate(`${program?.id}/edit`, { state: { program } });
  };

  const handleDeleteProgram = (program) => {
    setSelectedProgram(program);
    setShowDeleteModal(true);
  };

  const handleProgramClick = (program) => navigate(`${program?.id}`);

  const getCategoryIcon = (category) => {
    const cat = categories.find((c) => c.id === category);
    if (!cat) return <FaBook />;
    switch (cat.icon) {
      case 'FaBook': return <FaBook />;
      case 'FaUserTie': return <FaUserTie />;
      case 'FaGraduationCap': return <FaGraduationCap />;
      default: return <FaBook />;
    }
  };

  const getCategoryColor = (category) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.color : 'gray';
  };

  const getStatusBadge = (status) => {
    const statusConfig = statuses.find((s) => s.id === status);
    return {
      label: statusConfig?.label || status?.replaceAll('_', ' '),
      color: statusConfig?.color || 'secondary',
    };
  };

  const getTypeBadge = (type) => ({
    label: type,
    color: 'secondary',
  });

  const getActions = (program) => (
    <Dropdown onClick={(e) => e.stopPropagation()} className="ms-auto">
      <Dropdown.Toggle
        size="sm"
        className="!bg-white !border !border-zinc-200 !text-zinc-700 hover:!bg-zinc-50 hover:!border-zinc-400 !text-xs !font-medium !px-3 !py-1.5 !rounded-lg !shadow-none"
      >
        Actions
      </Dropdown.Toggle>
      <Dropdown.Menu className="min-w-[140px] border border-zinc-200 rounded-lg shadow-lg py-1">
        {[
          {
            label: 'View',
            event: () => navigate(`${program?.id}`),
            style: 'text-zinc-700 hover:!bg-zinc-50',
          },
          {
            label: 'Edit',
            event: () => handleEditProgram(program),
            style: 'text-zinc-700 hover:!bg-zinc-50',
          },
          {
            label: 'Delete',
            event: () => handleDeleteProgram(program),
            style: 'text-[#E30613] hover:!bg-red-50',
          },
        ].map((action, idx) => (
          <Dropdown.Item
            key={idx}
            onClick={action.event}
            className={`${action.style} text-sm font-medium py-2 px-3 rounded-md mx-1`}
          >
            {action.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSearchTerm('');
  };

  const hasFilters =
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedType !== 'all' ||
    searchTerm;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full flex flex-col min-h-full">

      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
              Programme Management
            </h1>
            <p className="text-sm text-zinc-500">
              Manage short courses, learnerships and internships.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={toggleViewMode}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium text-sm rounded-lg transition-colors"
            >
              {viewMode === 'grid' ? <FaList size={12} /> : <FaThLarge size={12} />}
              <span className="hidden sm:inline">
                {viewMode === 'grid' ? 'List view' : 'Grid view'}
              </span>
            </button>

            <button
              onClick={() => setShowFiltersOffcanvas(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium text-sm rounded-lg transition-colors"
            >
              <FaFilter size={12} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <button
              onClick={handleAddProgram}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm rounded-lg transition-colors"
            >
              <FaPlus size={12} />
              <span>Add Programme</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          SEARCH BAR
          ============================================================ */}
      <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <InputGroup className="flex-1">
            <InputGroup.Text className="bg-white border-r-0 border-zinc-300">
              <FaSearch className="text-zinc-400" size={12} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search programmes by name, description or tags…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-l-0 border-zinc-300 text-sm"
            />
          </InputGroup>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-red-200 text-[#E30613] hover:bg-red-50 font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ============================================================
          LIST / GRID VIEW
          ============================================================ */}
      <div className="flex-1">
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

      {/* ============================================================
          MODALS
          ============================================================ */}
      <DeleteProgramModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        program={selectedProgram}
        setResponse={() => {}}
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