import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

export default function UnitStandardsTable({
  standards,
  onRowClick,
  onEdit,
  onDelete,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl">

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {['SAQA ID', 'Title', 'Credits', 'NQF Level', 'Type', ''].map((h) => (
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
            {standards.map((standard) => (
              <tr
                key={standard.unitStandardId}
                onClick={() => onRowClick(standard)}
                className="hover:bg-red-50/30 cursor-pointer transition-colors"
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
                  <span className="text-sm text-zinc-700 tabular-nums">
                    {standard.credits || '—'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {renderNQFBadge(standard.nqfLevel)}
                </td>

                <td className="px-4 py-3">
                  {renderTypeBadge(standard.type)}
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
        {standards.map((standard) => (
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
              {standard.credits && (
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

  const normalized = type.toUpperCase();

  const styles = {
    FUNDAMENTAL: 'bg-zinc-900 text-white',
    CORE: 'bg-[#E30613] text-white',
    ELECTIVE: 'bg-zinc-100 text-zinc-600',
  };

  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
        styles[normalized] || 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {type}
    </span>
  );
}