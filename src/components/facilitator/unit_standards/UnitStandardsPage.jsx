import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useState } from 'react';
import { FaFileAlt, FaPlus } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteUnitStandardModal from './DeleteUnitStandardModal';
import UnitStandardsFilters from './UnitStandardsFilters';
import UnitStandardsHeader from './UnitStandardHeader';
import UnitStandardsStats from './UnitStandardsStats';
import UnitStandardsTable from './UnitStandardsTable';

export default function UnitStandardsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [refreshKey, setRefreshKey] = useState(0);
  const { showResponse } = useApiResponse();
  const navigate = useNavigate();
  const location = useLocation();
  const { program } = location?.state || {};

  async function handleDelete() {
    if (!editingItem) return;

    try {
      const result = await apiFetch(
        `/api/unit-standards/${editingItem.unitStandardId}`,
        { method: 'DELETE' }
      );

      setShowDeleteModal(false);
      setEditingItem(null);
      showResponse(result);

      if (result?.success) {
        setRefreshKey((k) => k + 1);
      }
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

      <UnitStandardsStats refreshKey={refreshKey} />

      <UnitStandardsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <UnitStandardsTable
        searchTerm={searchTerm}
        filterType={filterType}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={(item) => {
          setEditingItem(item);
          setShowDeleteModal(true);
        }}
        refreshKey={refreshKey}
      />

      <DeleteUnitStandardModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        item={editingItem}
        onConfirm={handleDelete}
      />
    </div>
  );
}