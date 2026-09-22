import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FaBook, FaPenSquare } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { programTypes } from '../utils/constants';

export default function ProgramForm({ getPrograms }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const { showResponse } = useApiResponse();
    const location = useLocation();
    const { program } = location.state || {};
    const [editingProgram, setEditingProgram] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        type: '',
        description: '',
        capacity: 30,
        status: 'NOT_STARTED',
        startDate: '',
        endDate: '',
        location: '',
        imageBase64: '',
        imageBlob: null
    });

    useEffect(() => {
        if (program) {
            setEditingProgram(program);
            setFormData({
                name: program.name || '',
                category: program.category || '',
                type: program.type || '',
                description: program.description || '',
                capacity: program.capacity || 30,
                status: program.status || 'NOT_STARTED',
                startDate: program.startDate?.split('T')[0] || '',
                endDate: program.endDate?.split('T')[0] || '',
                location: program.location || '',
                imageBase64: program.imageBase64 || '',
                imageBlob: program.imageUrl ? program.imageUrl : null
            });
        }
    }, [program]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const reader = new FileReader();

            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageBase64: reader.result,
                    imageBlob: imageUrl
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            type: '',
            description: '',
            capacity: 30,
            status: 'NOT_STARTED',
            startDate: '',
            endDate: '',
            location: '',
            imageBase64: '',
            imageBlob: null
        });
        setEditingProgram(null);
        setResponse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            
            const submitData = {
                name: formData.name,
                category: formData.category,
                type: formData.type,
                description: formData.description,
                capacity: parseInt(formData.capacity),
                status: formData.status,
                startDate: formData.startDate,
                endDate: formData.endDate,
                location: formData.location,
                imageBase64: formData.imageBase64 || null
            };

            const result = await apiFetch(editingProgram ? `${PROGRAMS}/${editingProgram.id}` : PROGRAMS, {
                method: editingProgram ? 'PUT' : 'POST',
                body: submitData
            });

            showResponse(result);
            setResponse(result);

            if (result?.success) {
                if (getPrograms) getPrograms();
                
                if (!editingProgram) {
                    resetForm();
                }
                
                setTimeout(() => {
                    navigate(-1, { replace: true });
                }, 1500);
            }
        } catch (error) {
            setResponse({ success: false, message: 'An error occurred while saving the program. Please try again. ' + error });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        navigate(-1);
    };

    return (
        <div className="border-gray-200 overflow-y-auto h-screen p-2">
            <div className="border bg-white rounded py-6 px-4 mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 text-sm transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${editingProgram ? 'bg-orange-100' : 'bg-blue-100'}`}>
                            {editingProgram ?
                                <FaPenSquare className="text-orange-600 text-xl" /> :
                                <FaBook className="text-blue-600 text-xl" />
                            }
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-0.5">
                                {editingProgram ? 'Edit Program' : 'Create New Program'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {editingProgram ? 'Update program details' : 'Add a new program to the system'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl overflow-hidden">
                    <div className="p-6">
                        <ResponseMessage setResponse={setResponse} response={response} />

                        <Form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Form.Group className="md:col-span-2">
                                    <Form.Label className="text-sm font-medium text-gray-700">Program Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter program name"
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-sm font-medium text-gray-700">Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="INTERNSHIP">Internship</option>
                                        <option value="SHORT_COURSE">Short Course</option>
                                        <option value="LEARNERSHIP">Learnership</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-sm font-medium text-gray-700">Type</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={formData.type || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    >
                                        <option value="">Select Field</option>
                                        {programTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-sm font-medium text-gray-700">Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity || ''}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-sm font-medium text-gray-700">Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formData.status || 'NOT_STARTED'}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    >
                                        <option value="NOT_STARTED">Not Started</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="md:col-span-2">
                                    <Form.Label className="text-sm font-medium text-gray-700">Location</Form.Label>
                                    <Form.Control
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter program location"
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-sm font-medium text-gray-700">Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-sm font-medium text-gray-700">End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                                    />
                                </Form.Group>

                                <Form.Group className="md:col-span-2">
                                    <Form.Label className="text-sm font-medium text-gray-700">Description</Form.Label>
                                    <RichTextEditor content={formData?.description} onChange={handleDescriptionChange} />
                                    <Form.Text className="text-gray-400 text-xs mt-1">
                                        Format your text with bold, italic, lists, and links
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="md:col-span-2">
                                    <Form.Label className="text-sm font-medium text-gray-700">Program Image</Form.Label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-gray-50/30">
                                        <input
                                            type="file"
                                            id="program-image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="program-image"
                                            className="cursor-pointer flex flex-col items-center gap-2"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Upload className="text-gray-400 text-xl" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">
                                                Click to upload image
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                PNG, JPG, JPEG up to 5MB
                                            </span>
                                        </label>

                                        {formData.imageBlob && (
                                            <div className="mt-4 relative inline-block">
                                                <img
                                                    src={formData.imageBlob}
                                                    alt="Program preview"
                                                    className="max-h-48 rounded-xl object-cover shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            imageBase64: '',
                                                            imageBlob: null
                                                        }));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-rose-600 transition"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>
                            </div>

                            <div className="border-t border-gray-100 pt-5 mt-5 flex justify-end gap-3">
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-5 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-0 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            {editingProgram ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            {editingProgram ? 'Update Program' : 'Create Program'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}