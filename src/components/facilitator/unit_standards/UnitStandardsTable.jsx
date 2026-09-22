import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { getTypeBadge, getNQFBadge } from './utils/unitStandardHelpers';

export default function UnitStandardsTable({ standards, onRowClick, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div >
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">SAQA ID</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Credits</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">NQF Level</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {standards.map((standard) => (
              <tr onClick={() => onRowClick(standard)} key={standard.unitStandardId} className="hover:bg-gray-100 cursor-pointer transition group">
                <td className="p-3">
                  <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {standard.unitStandardId}
                  </span>
                </td>
                <td className="p-3">
                  <p className="text-sm m-0 font-medium text-gray-800 " >
                    {standard.title}
                  </p>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-amber-400" size={12} />
                    <span className="text-sm text-gray-700">{standard.credits}</span>
                  </div>
                </td>
                <td className="p-3">{getNQFBadge(standard.nqfLevel)}</td>
                <td className="p-3">{getTypeBadge(standard.type)}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <Dropdown align="end">
                    <Dropdown.Toggle as="button" className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1 text-sm border-0">
                          Actions
                        </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow-lg border-0 rounded-lg">
                      <Dropdown.Item onClick={() => onEdit(standard)}>
                        <FaEdit className="inline mr-2 text-blue-500" size={12} /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => onDelete(standard)} className="text-red-600">
                        <FaTrash className="inline mr-2" size={12} /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}