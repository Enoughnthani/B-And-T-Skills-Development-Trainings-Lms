import { X, AlertCircle, CheckCircle } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ApiResponseContext = createContext();

export function ApiResponseProvider({ children }) {
  const [response, setResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const location = useLocation()



  function showResponse(newResponse) {
    if (visible) {
      setVisible(false);

      setTimeout(() => {
        setResponse(newResponse);
        setShouldRender(true);
        setVisible(true);
      }, 300);
    } else {
      setResponse(newResponse);
      setShouldRender(true);
      setVisible(true);
    }
  }

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    setVisible(false)
  }, [location])

  const handleAnimationEnd = () => {
    if (!visible) {
      setShouldRender(false);
    }
  };


  const isBulk = response?.payload?.successCount !== undefined;

  const successCount = isBulk ? response?.payload?.successCount || 0 : 0;
  const errorCount = isBulk ? response?.payload?.errorCount || 0 : 0;

  const isFullSuccess = isBulk
    ? response?.success && successCount > 0 && errorCount === 0
    : response?.success;

  const isPartialSuccess = isBulk
    ? successCount > 0 && errorCount > 0
    : false;

  const isFullFailure = isBulk
    ? successCount === 0 && errorCount > 0
    : !response?.success;

  const alertVariant = isFullSuccess
    ? "success"
    : isPartialSuccess
      ? "warning"
      : "danger";

  const Icon = isFullSuccess ? CheckCircle : AlertCircle;

  return (
    <ApiResponseContext.Provider value={{ showResponse }}>
      {children}

      {shouldRender && (
        <Alert
          variant={alertVariant}
          onAnimationEnd={handleAnimationEnd}
          className={`fixed py-3 px-4 flex gap-3 items-start top-[13%] right-4 z-[9999] w-[350px]
          ${visible ? "animate-pop-in" : "animate-pop-out"}`}
        >
          <Icon className="w-5 h-5 mt-1 flex-shrink-0" />

          <div className="flex-1 text-sm">
            <p className="font-semibold m-0">
              {response?.message || "Error"}
            </p>

            {/* ✅ BULK DETAILS */}
            {isBulk && (isPartialSuccess || isFullFailure) && (
              <div className="mt-2 max-h-32 overflow-y-auto pr-1 text-xs space-y-1">
                {successCount > 0 && (
                  <p className="text-green-600">
                    ✅ IDs: {response?.payload?.successfulIds?.join(", ")}
                  </p>
                )}

                {errorCount > 0 && (
                  <div className="text-red-600">
                    ❌ Errors:
                    <ul className="list-disc ml-4">
                      {response?.payload?.errors?.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <X
            onClick={() => setVisible(false)}
            className="cursor-pointer ms-auto flex-shrink-0"
          />
        </Alert>
      )}
    </ApiResponseContext.Provider>
  );
}

export const useApiResponse = () => useContext(ApiResponseContext);