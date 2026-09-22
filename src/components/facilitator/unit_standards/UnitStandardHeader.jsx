import { FaCode, FaPlus } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function UnitStandardsHeader({ onAdd }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <FaCode className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Unit Standards</h1>
          </div>
          <p className="text-gray-500">Manage learnership unit standards and outcomes</p>
        </div>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 rounded-lg px-4 py-2 border-0"
        >
          <FaPlus size={14} /> Add Unit Standard
        </Button>
      </div>
    </div>
  );
}