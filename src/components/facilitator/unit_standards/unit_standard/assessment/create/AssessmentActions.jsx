import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

export default function AssessmentActions({ onSubmit, loading, isEditing }) {
  return (
    <div className="mt-6 pt-1 border-t border-gray-200 flex justify-between items-center">
      <div className="flex ms-auto gap-3">
        <Button variant="success" onClick={onSubmit} disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> 
              Saving...
            </>
          ) : (
            <>
              <FaSave size={14} /> 
              {isEditing ? 'Update Assessment' : 'Save Assessment'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}