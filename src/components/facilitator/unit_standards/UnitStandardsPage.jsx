import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { apiFetch } from '@/api/api';
import UnitStandardsHeader from './UnitStandardHeader';
import UnitStandardsStats from './UnitStandardsStats';
import UnitStandardsFilters from './UnitStandardsFilters';
import UnitStandardsTable from './UnitStandardsTable';
import DeleteUnitStandardModal from './DeleteUnitStandardModal';
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function UnitStandardsPage() {
  const [unitStandards, setUnitStandards] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const { showResponse } = useApiResponse()
  const navigate = useNavigate();
  const location = useLocation();
  const { program } = location?.state || {};

  useEffect(() => {
    const getUnitStandards = async () => {
      setLoading(true);
      const data = await apiFetch('/api/unit-standards/program/' + program?.id);
      setUnitStandards(data);
      setLoading(false);
    };
    getUnitStandards();
  }, [program]);

  const filteredStandards = unitStandards.filter(unitStandard => {
    const matchesSearch = unitStandard.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || unitStandard.type === filterType?.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: unitStandards.length,
    fundamental: unitStandards.filter(u => u.type === 'FUNDAMENTAL').length,
    core: unitStandards.filter(u => u.type === 'CORE').length,
    elective: unitStandards.filter(u => u.type === 'ELECTIVE').length,
    totalCredits: unitStandards.reduce((sum, u) => sum + (u.credits || 0), 0)
  };

  const handleDelete = async () => {
    if (!editingItem) return;

    try {
      const result = await apiFetch(`/api/unit-standards/${editingItem.unitStandardId}`, {
        method: 'DELETE'
      });


      if (result?.success) {
        setUnitStandards(unitStandards.filter(item => item.unitStandardId !== editingItem.unitStandardId));
      }

      setShowDeleteModal(false);
      setEditingItem(null);
      showResponse(result)
    } catch (error) {
    }
  };

  const handleEdit = (unitStandard) => {
    navigate(`${unitStandard.unitStandardId}/edit`, { state: { unitStandard, program } });
  };

  return (
    <div className="w-full overflow-y-auto h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <UnitStandardsHeader onAdd={() => navigate('new', { state: { program } })} />

        <UnitStandardsStats stats={stats} />

        <UnitStandardsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="text-gray-400 text-3xl animate-spin" />
          </div>
        ) : filteredStandards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No unit standards found</h3>
            <p className="text-gray-400 text-sm mb-4">Click "Add Unit Standard" to create one</p>
            <Button onClick={() => navigate('new', { state: { program } })} variant="primary" className="border-0 rounded-xl">
              <FaPlus className="inline mr-2" size={12} /> Add Unit Standard
            </Button>
          </div>
        ) : (
          <UnitStandardsTable
            standards={filteredStandards}
            onRowClick={(unitStandard) => navigate(`${unitStandard.unitStandardId}`, { state: { unitStandard } })}
            onEdit={handleEdit}
            onDelete={(item) => {
              setEditingItem(item);
              setShowDeleteModal(true);
            }}
          />
        )}
      </div>

      <DeleteUnitStandardModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        item={editingItem}
        onConfirm={handleDelete}
      />
    </div>
  );
}