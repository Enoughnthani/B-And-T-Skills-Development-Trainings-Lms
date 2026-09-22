import { AlertCircle, CheckCircle, X } from "lucide-react";

export default function MessageAlert({ response, onClose }) {
    if (!response) return null;

    return (
        <div className={`${response?.success ? "bg-green-100" : "bg-red-100"} rounded p-2 flex items-center mb-4`}>
            {response?.success
                ? <CheckCircle className="text-green-600" />
                : <AlertCircle className="text-red-600" />
            }
            <p className={`text-sm m-0 font-semibold mx-auto ${response?.success ? "text-green-700" : "text-red-700"}`}>
                {response?.message}
            </p>
            <X className="cursor-pointer" onClick={onClose} />
        </div>
    );
}