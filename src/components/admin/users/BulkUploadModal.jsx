// BulkUploadPage.jsx
import { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import { FaUpload, FaDownload, FaArrowLeft, FaFileCsv, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { apiFetch } from '@/api/api';
import { USERS } from '@/utils/apiEndpoint';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useTopLoader } from '../../../contexts/TopLoaderContext';
import { useNavigate } from 'react-router-dom';

export default function BulkUploadPage({ }) {
    const navigate = useNavigate();
    const [bulkFile, setBulkFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const { start, complete } = useTopLoader();
    const [response, setResponse] = useState(null)

    const handleBulkUpload = async () => {
        if (!bulkFile) {
            setResponse({ success: false, message: "Please select a file" });
            return;
        }

        setUploading(true);
        start();

        try {
            const formData = new FormData();
            formData.append('file', bulkFile);

            const result = await apiFetch(`${USERS}/bulk`, {
                method: "POST",
                body: formData,
            });

            setResponse(result);
        } catch (error) {
            setResponse({ success: false, message: "Bulk upload failed: " + error.message });
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
        const template = "firstname,lastname,email,contactNumber,idNumber,roles,status\nJohn,Doe,john@email.com,0812345678,9001015123089,LEARNER,ACTIVE";
        downloadCSV(template, 'bulk_upload_template.csv');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="overflow-y-auto w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 py-6 px-4">
            <div>
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleCancel}
                        className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 text-sm transition-colors"
                    >
                        <FaArrowLeft size={14} /> Back
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FaUpload className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-0.5">
                                Bulk Upload Users
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Import multiple users at once using a CSV file
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        {/* Success Message */}
                        {uploadSuccess && (
                            <Alert variant="success" className="mb-4 rounded-xl border-l-4 border-success">
                                <div className="flex items-start gap-3">
                                    <FaCheckCircle className="text-success text-xl mt-0.5" />
                                    <div>
                                        <h6 className="fw-semibold mb-1">Upload Complete!</h6>
                                        <p className="mb-0 text-sm">
                                            Successfully created <strong>{uploadSuccess.created}</strong> users.
                                            {uploadSuccess.errors > 0 && (
                                                <span className="text-warning"> {uploadSuccess.errors} errors encountered.</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-muted mt-2 mb-0">
                                            Redirecting to users list...
                                        </p>
                                    </div>
                                </div>
                            </Alert>
                        )}

                        {/* Info Alert */}
                        <div className="mb-5 bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FaFileCsv className="text-blue-600 text-sm" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-2 text-sm">CSV Format Requirements:</p>
                                    <ul className="mb-2 text-sm text-gray-600 space-y-1 pl-4">
                                        <li>File must be in <strong className="text-blue-600">.csv</strong> format</li>
                                        <li>Maximum file size: <strong className="text-blue-600">10MB</strong></li>
                                        <li>Required columns: firstname, lastname, email, contactNumber, idNumber, roles, status</li>
                                    </ul>
                                    <p className="mb-1 text-sm font-medium text-gray-700 mt-2">Column Order:</p>
                                    <code className="bg-gray-100 p-2 rounded-lg text-xs block font-mono">
                                        firstname,lastname,email,contactNumber,idNumber,roles,status
                                    </code>
                                    <p className="mb-1 text-sm font-medium text-gray-700 mt-2">Example:</p>
                                    <code className="bg-gray-100 p-2 rounded-lg text-xs block font-mono">
                                        John,Doe,john@email.com,0812345678,9001015123089,LEARNER,ACTIVE
                                    </code>
                                </div>
                            </div>
                        </div>

                        <ResponseMessage setResponse={setResponse} response={response} />

                        {/* File Upload Section */}
                        <div className="mb-5">
                            <Form.Label className="fw-semibold text-gray-700 mb-2">Select CSV File</Form.Label>
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${bulkFile ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-400 bg-gray-50/30'}`}>
                                <input
                                    type="file"
                                    id="csv-file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file && file.size > 10 * 1024 * 1024) {
                                            setResponse({
                                                success: false,
                                                message: "File size exceeds 10MB limit"
                                            });
                                            return;
                                        }
                                        setBulkFile(file);
                                        setResponse(null);
                                        setUploadSuccess(null);
                                    }}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="csv-file"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bulkFile ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <FaFileCsv className={`text-2xl ${bulkFile ? 'text-green-600' : 'text-gray-400'}`} />
                                    </div>
                                    <span className={`text-sm font-medium ${bulkFile ? 'text-green-600' : 'text-gray-600'}`}>
                                        {bulkFile ? bulkFile.name : 'Click to upload CSV file'}
                                    </span>
                                    {bulkFile && (
                                        <span className="text-xs text-gray-400">
                                            {(bulkFile.size / 1024).toFixed(2)} KB
                                        </span>
                                    )}
                                    {!bulkFile && (
                                        <span className="text-xs text-gray-400">
                                            CSV files only (max 10MB)
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Download Template Button */}
                        <div className="mb-5 flex gap-2">
                            <Button
                                variant="primary"
                                onClick={downloadTemplate}
                                className="flex items-center gap-2 rounded-lg border-gray-200 hover:border-blue-300"
                            >
                                <FaDownload size={14} /> Download Template CSV
                            </Button>

                            <Button
                                variant="success"
                                onClick={handleBulkUpload}
                                disabled={!bulkFile || uploading}
                                className='flex items-center gap-2'
                            >
                                {uploading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload size={14} /> Upload & Create Users
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Tips Section */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                💡 Tips for successful upload:
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1 pl-4">
                                <li>• First row must contain column headers exactly as shown</li>
                                <li>• Role must be one of: ADMIN, PROGRAM_MANAGER, FACILITATOR, MENTOR, INTERN, LEARNER, ASSESSOR, MODERATOR</li>
                                <li>• ID Number must be a valid South African ID (13 digits)</li>
                                <li>• Email addresses must be unique in the system</li>
                                <li>• Contact number must be 10 digits starting with 0</li>
                                <li>• Status must be either ACTIVE or INACTIVE</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}