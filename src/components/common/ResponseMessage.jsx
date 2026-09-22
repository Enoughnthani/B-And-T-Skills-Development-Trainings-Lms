import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function ResponseMessage({ response, setResponse }) {
  if (!response) return null;

  // ✅ Detect if it's a bulk response
  const isBulk = response?.payload?.successCount !== undefined;

  // Counts (only valid for bulk)
  const successCount = isBulk ? response?.payload?.successCount || 0 : 0;
  const errorCount = isBulk ? response?.payload?.errorCount || 0 : 0;

  // ✅ STATUS LOGIC (FIXED)
  const isFullSuccess = isBulk
    ? (response?.success && successCount > 0 && errorCount === 0)
    : response?.success;

  const isPartialSuccess = isBulk
    ? (successCount > 0 && errorCount > 0)
    : false;

  const isFullFailure = isBulk
    ? (successCount === 0 && errorCount > 0)
    : !response?.success;

  // React Bootstrap Alert variant
  const alertVariant = isFullSuccess
    ? "success"
    : isPartialSuccess
      ? "warning"
      : "danger";

  // Tailwind classes for additional styling
  const tailwindClasses = isFullSuccess
    ? "border-l-4 border-l-green-600"
    : isPartialSuccess
      ? "border-l-4 border-l-yellow-600"
      : "border-l-4 border-l-red-600";

  // Icon
  const Icon = isFullSuccess ? CheckCircle : AlertCircle;

  // Auto close (3 minutes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse(null);
    }, 3 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [setResponse]);

  return (
    <Alert
      variant={alertVariant}
      className={`${tailwindClasses} p-3 mb-4 relative`}
      onClose={() => setResponse(null)}
      dismissible
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className="text-sm font-semibold m-0">
            {response?.message}
          </p>

          {/* ✅ BULK DETAILS ONLY */}
          {isBulk && (isPartialSuccess || isFullFailure) && (
            <div className="text-sm mt-3 space-y-2 max-h-40 overflow-y-auto pr-2">
              {/* Success IDs */}
              {successCount > 0 && (
                <p className="text-green-700 dark:text-green-300">
                  ✅ Successfully processed IDs:{" "}
                  {response?.payload?.successfulIds?.join(", ")}
                </p>
              )}

              {/* Errors */}
              {errorCount > 0 && (
                <div className="text-red-700 dark:text-red-300">
                  ❌ Errors ({errorCount}):
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    {response?.payload?.errors?.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
}