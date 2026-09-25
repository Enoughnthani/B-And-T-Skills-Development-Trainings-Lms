import { useState } from 'react';
import {
    FaArrowLeft,
    FaCheckCircle,
    FaDownload,
    FaFileCsv,
    FaUpload,
} from 'react-icons/fa';
import { apiFetch } from '@/api/api';
import { USERS } from '@/utils/apiEndpoint';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useTopLoader } from '../../../contexts/TopLoaderContext';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ROLES = [
    'ADMIN',
    'PROGRAM_MANAGER',
    'FACILITATOR',
    'MENTOR',
    'INTERN',
    'LEARNER',
    'ASSESSOR',
    'MODERATOR',
];

const COLUMNS = 'firstname,lastname,email,contactNumber,idNumber,roles,status';
const EXAMPLE = 'John,Doe,john@email.com,0812345678,9001015123089,LEARNER,ACTIVE';

export default function BulkUploadPage() {
    const navigate = useNavigate();
    const [bulkFile, setBulkFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [response, setResponse] = useState(null);
    const { start, complete } = useTopLoader();

    const handleBulkUpload = async () => {
        if (!bulkFile) {
            setResponse({ success: false, message: 'Please select a file.' });
            return;
        }

        setUploading(true);
        start();

        try {
            const formData = new FormData();
            formData.append('file', bulkFile);

            const result = await apiFetch(`${USERS}/bulk`, {
                method: 'POST',
                body: formData,
            });

            setResponse(result);
        } catch (error) {
            setResponse({
                success: false,
                message: 'Bulk upload failed: ' + error.message,
            });
            setUploadSuccess(null);
        } finally {
            setUploading(false);
            setBulkFile(null);
            complete();
        }
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadTemplate = () => {
        const template = `${COLUMNS}\n${EXAMPLE}`;
        downloadCSV(template, 'bulk_upload_template.csv');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > MAX_FILE_SIZE) {
            setResponse({ success: false, message: 'File size exceeds 10MB limit.' });
            return;
        }
        setBulkFile(file);
        setResponse(null);
        setUploadSuccess(null);
    };

    const handleCancel = () => navigate(-1);

    return (
        <div className="p-4 sm:p-6 lg:p-8 mx-auto w-full">

            <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
            >
                <FaArrowLeft size={12} />
                Back
            </button>

            <div className="flex items-start sm:items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                    <FaUpload className="text-zinc-700" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
                        Bulk Upload Users
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Import multiple users at once using a CSV file.
                    </p>
                </div>
            </div>

            {/* ============================================================
          CARD
          ============================================================ */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="p-4 sm:p-6 space-y-5">

                    {/* ---------- Success message ---------- */}
                    {uploadSuccess && (
                        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                            <FaCheckCircle className="text-green-600 text-lg mt-0.5 shrink-0" />
                            <div className="text-sm text-green-900 min-w-0">
                                <p className="font-bold mb-1">Upload complete</p>
                                <p className="break-words">
                                    Successfully created <strong>{uploadSuccess.created}</strong> users.
                                    {uploadSuccess.errors > 0 && (
                                        <span className="text-amber-700">
                                            {' '}
                                            {uploadSuccess.errors} errors encountered.
                                        </span>
                                    )}
                                </p>
                                <p className="text-zinc-600 mt-1">Redirecting to users list…</p>
                            </div>
                        </div>
                    )}

                    {/* ---------- Info block ---------- */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                                <FaFileCsv className="text-zinc-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-zinc-800 mb-2 text-sm">
                                    CSV format requirements
                                </p>

                                <ul className="text-sm text-zinc-600 space-y-1 list-disc pl-4 mb-3 break-words">
                                    <li>
                                        File must be in <strong className="text-zinc-900">.csv</strong> format
                                    </li>
                                    <li>
                                        Maximum file size:{' '}
                                        <strong className="text-zinc-900">10MB</strong>
                                    </li>
                                    <li className="break-all">Required columns: {COLUMNS}</li>
                                </ul>

                                <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                                    Column order
                                </p>
                                <code className="block bg-zinc-900 text-zinc-100 p-2.5 rounded-lg text-xs font-mono mb-3 break-all whitespace-pre-wrap">
                                    {COLUMNS}
                                </code>

                                <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                                    Example row
                                </p>
                                <code className="block bg-zinc-900 text-zinc-100 p-2.5 rounded-lg text-xs font-mono break-all whitespace-pre-wrap">
                                    {EXAMPLE}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* ---------- API response ---------- */}
                    <ResponseMessage setResponse={setResponse} response={response} />

                    {/* ---------- Dropzone ---------- */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Select CSV file
                        </label>

                        <div
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${bulkFile
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50/50'
                                }`}
                        >
                            <input
                                type="file"
                                id="csv-file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="csv-file"
                                className="cursor-pointer flex flex-col items-center gap-2 w-full"
                            >
                                <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${bulkFile ? 'bg-green-100' : 'bg-zinc-100'
                                        }`}
                                >
                                    <FaFileCsv
                                        className={`text-2xl ${bulkFile ? 'text-green-600' : 'text-zinc-400'
                                            }`}
                                    />
                                </div>

                                <span
                                    className={`text-sm font-medium max-w-full truncate px-2 ${bulkFile ? 'text-green-700' : 'text-zinc-600'
                                        }`}
                                >
                                    {bulkFile ? bulkFile.name : 'Click to upload CSV file'}
                                </span>

                                {bulkFile ? (
                                    <span className="text-xs text-zinc-500">
                                        {(bulkFile.size / 1024).toFixed(2)} KB
                                    </span>
                                ) : (
                                    <span className="text-xs text-zinc-400">
                                        CSV files only (max 10MB)
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* ---------- Actions ---------- */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                            type="button"
                            onClick={downloadTemplate}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-800 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                            <FaDownload size={12} />
                            Download template
                        </button>

                        <button
                            type="button"
                            onClick={handleBulkUpload}
                            disabled={!bulkFile || uploading}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                            {uploading ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <FaUpload size={12} />
                                    Upload &amp; create users
                                </>
                            )}
                        </button>
                    </div>

                    {/* ---------- Tips ---------- */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4">
                        <p className="text-sm font-bold text-zinc-800 mb-2">
                            Tips for a successful upload
                        </p>
                        <ul className="text-xs text-zinc-600 space-y-1.5 list-disc pl-4 break-words">
                            <li>First row must contain column headers exactly as shown</li>
                            <li className="break-all">
                                Role must be one of: {ROLES.join(', ')}
                            </li>
                            <li>ID number must be a valid South African ID (13 digits)</li>
                            <li>Email addresses must be unique in the system</li>
                            <li>Contact number must be 10 digits starting with 0</li>
                            <li>Status must be either ACTIVE or INACTIVE</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}