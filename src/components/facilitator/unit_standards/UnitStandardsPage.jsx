import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { FaFileAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteUnitStandardModal from './DeleteUnitStandardModal';
import UnitStandardsFilters from './UnitStandardsFilters';
import UnitStandardsHeader from './UnitStandardHeader';
import UnitStandardsStats from './UnitStandardsStats';
import UnitStandardsTable from './UnitStandardsTable';

export default function UnitStandardsPage() {
  const [unitStandards, setUnitStandards] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const { showResponse } = useApiResponse();
  const navigate = useNavigate();
  const location = useLocation();
  const { program } = location?.state || {};

  useEffect(() => {
    if (!program?.id) return;
    load();
  }, [program]);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch(
        `/api/unit-standards/program/${program.id}`
      );
      setUnitStandards(data?.payload || data || []);
    } catch {
      setUnitStandards([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredStandards = unitStandards.filter((unitStandard) => {
    const matchesSearch = unitStandard.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'ALL' ||
      unitStandard.type === filterType?.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: unitStandards.length,
    fundamental: unitStandards.filter((u) => u.type === 'FUNDAMENTAL').length,
    core: unitStandards.filter((u) => u.type === 'CORE').length,
    elective: unitStandards.filter((u) => u.type === 'ELECTIVE').length,
    totalCredits: unitStandards.reduce((sum, u) => sum + (u.credits || 0), 0),
  };

  async function handleDelete() {
    if (!editingItem) return;

    try {
      const result = await apiFetch(
        `/api/unit-standards/${editingItem.unitStandardId}`,
        { method: 'DELETE' }
      );

      if (result?.success) {
        setUnitStandards((prev) =>
          prev.filter(
            (item) => item.unitStandardId !== editingItem.unitStandardId
          )
        );
      }

      setShowDeleteModal(false);
      setEditingItem(null);
      showResponse(result);
    } catch {
      // ignore
    }
  }

  function handleEdit(unitStandard) {
    navigate(`${unitStandard.unitStandardId}/edit`, {
      state: { unitStandard, program },
    });
  }

  function handleAdd() {
    navigate('new', { state: { program } });
  }

  function handleRowClick(unitStandard) {
    navigate(`${unitStandard.unitStandardId}`, { state: { unitStandard } });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <UnitStandardsHeader onAdd={handleAdd} />

      <UnitStandardsStats stats={stats} />

      <UnitStandardsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-zinc-400 text-2xl animate-spin" />
        </div>
      ) : filteredStandards.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <UnitStandardsTable
          standards={filteredStandards}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={(item) => {
            setEditingItem(item);
            setShowDeleteModal(true);
          }}
        />
      )}

      <DeleteUnitStandardModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        item={editingItem}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaFileAlt className="text-zinc-400 text-xl" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No unit standards found</h3>
      <p className="text-sm text-zinc-500 mb-5">
        Click "Add unit standard" to create one.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
      >
        <FaPlus size={12} />
        Add unit standard
      </button>
    </div>
  );
}