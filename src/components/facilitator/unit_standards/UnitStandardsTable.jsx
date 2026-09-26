import { apiFetch } from '@/api/api';
import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const TYPE_LABELS = {
  KNOWLEDGE: 'Knowledge',
  PRACTICAL: 'Practical',
  WORK_EXPERIENCE: 'Work experience',
};

const TYPE_STYLES = {
  KNOWLEDGE: 'bg-zinc-900 text-white',
  PRACTICAL: 'bg-[#E30613] text-white',
  WORK_EXPERIENCE: 'bg-zinc-100 text-zinc-600',
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  PHASED_OUT: 'Phased out',
  PENDING: 'Pending',
};

const STATUS_STYLES = {
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  PHASED_OUT: 'bg-red-50 text-[#E30613]',
  PENDING: 'bg-zinc-100 text-zinc-500',
};

export default function UnitStandardsTable({
  standards: externalStandards,
  searchTerm = '',
  filterType = 'ALL',
  onRowClick,
  onEdit,
  onDelete,
  refreshKey = 0,
}) {
  const { programId } = useParams();
  const [standards, setStandards] = useState(externalStandards || []);
  const [loading, setLoading] = useState(!externalStandards);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (externalStandards) return;
    if (!programId) return;
    load();
  }, [programId, refreshKey, externalStandards]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(
        `/api/unit-standards/program/${programId}`
      );
      setStandards(result?.payload || result || []);
    } catch {
      setError('Failed to load modules.');
      setStandards([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = standards.filter((standard) => {
    const matchesSearch =
      !searchTerm ||
      standard.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      standard.unitStandardId?.toString().includes(searchTerm);

    const matchesFilter =
      filterType === 'ALL' ||
      standard.type?.toUpperCase() === filterType.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-zinc-200 border-t-[#E30613]" />
        <p className="mt-3 text-sm text-zinc-500">Loading modules…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <p className="text-sm text-[#E30613]">{error}</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <p className="text-sm text-zinc-500">
          {searchTerm || filterType !== 'ALL'
            ? 'No modules match your search or filter.'
            : 'No modules added yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl">

      <div className="hidden md:block ">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200">
            <tr>
              {['Code', 'Title', 'Type', 'NQF', 'Credits', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((standard) => (
              <tr
                key={standard.unitStandardId}
                onClick={() => onRowClick(standard)}
                className="hover:bg-zinc-100/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-zinc-700 bg-zinc-100 px-2 py-1 rounded">
                    {standard.unitStandardId}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <p className="font-bold text-zinc-900 truncate max-w-md">
                    {standard.title}
                  </p>
                </td>

                <td className="px-4 py-3">
                  {renderTypeBadge(standard.type)}
                </td>

                <td className="px-4 py-3">
                  {renderNQFBadge(standard.nqfLevel)}
                </td>

                <td className="px-4 py-3">
                  <span className="text-sm text-zinc-700 tabular-nums">
                    {standard.credits ?? '—'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {renderStatusBadge(standard.status)}
                </td>

                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="relative inline-block"
                    ref={openMenuId === standard.unitStandardId ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenuId((id) =>
                          id === standard.unitStandardId
                            ? null
                            : standard.unitStandardId
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                      aria-label="Actions"
                    >
                      <FaEllipsisV size={12} />
                    </button>

                    {openMenuId === standard.unitStandardId && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10">
                        <button
                          onClick={() => {
                            onEdit(standard);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(standard);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#E30613] hover:bg-red-50 transition-colors text-left"
                        >
                          <FaTrash size={12} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-zinc-100">
        {filtered.map((standard) => (
          <div
            key={standard.unitStandardId}
            onClick={() => onRowClick(standard)}
            className="p-4 hover:bg-red-50/30 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="font-mono text-[10px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded shrink-0">
                {standard.unitStandardId}
              </span>
              <FiChevronRight className="text-zinc-300 shrink-0 mt-0.5" size={12} />
            </div>

            <h3 className="font-bold text-zinc-900 text-sm leading-snug mb-2">
              {standard.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {renderTypeBadge(standard.type)}
              {renderNQFBadge(standard.nqfLevel)}
              {renderStatusBadge(standard.status)}
              {standard.credits != null && (
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                  {standard.credits} credits
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-2 pt-3 border-t border-zinc-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(standard)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
              >
                <FaEdit size={10} />
                Edit
              </button>
              <button
                onClick={() => onDelete(standard)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#E30613] bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FaTrash size={10} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderNQFBadge(level) {
  if (!level) return <span className="text-zinc-400">—</span>;
  return (
    <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
      {level}
    </span>
  );
}

function renderTypeBadge(type) {
  if (!type) return <span className="text-zinc-400">—</span>;
  const key = type.toUpperCase();
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
        TYPE_STYLES[key] || 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {TYPE_LABELS[key] || type}
    </span>
  );
}

function renderStatusBadge(status) {
  if (!status) return <span className="text-zinc-400">—</span>;
  const key = status.toUpperCase();
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
        STATUS_STYLES[key] || 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {STATUS_LABELS[key] || status}
    </span>
  );
}