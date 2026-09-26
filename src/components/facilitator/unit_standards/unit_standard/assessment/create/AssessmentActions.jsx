import { FaSave } from 'react-icons/fa';

export default function AssessmentActions({ onSubmit, loading, isEditing }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 mt-5 border-t border-zinc-200">
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <FaSave size={12} />
            {isEditing ? 'Update assessment' : 'Save assessment'}
          </>
        )}
      </button>
    </div>
  );
}