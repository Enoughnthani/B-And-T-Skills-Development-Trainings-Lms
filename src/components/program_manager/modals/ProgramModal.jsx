import { apiFetch } from '@/api/api';
import RichTextEditor from '@/components/common/RichTextEditor';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { X } from 'lucide-react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaBook, FaPenSquare, FaSave, FaUpload } from 'react-icons/fa';
import { programTypes } from '../utils/constants';
import { useState } from 'react';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function ProgramModal({
    show,
    onHide,
    programForm,
    setProgramForm,
    editingProgram,
    getPrograms,
    resetForm
}) {

    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null);
    const { showResponse} = useApiResponse()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProgramForm(prev => ({
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

                setProgramForm(prev => ({
                    ...prev,
                    imageBase64: reader.result,
                    imageBlob: imageUrl
                }));
            }

            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionChange = (value) => {
        setProgramForm(prev => ({ ...prev, description: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);
            const result = await apiFetch(editingProgram ? `${PROGRAMS}/${editingProgram.id}` : `${PROGRAMS}`, {
                method: editingProgram ? 'PUT' : 'POST',
                body: programForm
            });

            showResponse(result)
            setResponse(result);
            getPrograms();

            if (result?.success) {
                resetForm()
            }

        } catch (error) {
            setResponse({ success: false, message: 'An error occurred while saving the program. Please try again. '+error });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header className="border-0 py-3 flex">
                <Modal.Title className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {editingProgram ? <FaPenSquare className='text-orange-600' /> : <FaBook className='text-blue-700' />}
                    {editingProgram ? 'Edit Program' : 'Add New Program'}
                </Modal.Title>

                <X size={25} onClick={onHide} className='cursor-pointer  text-gray-600 ms-auto' />

            </Modal.Header>

            <Modal.Body className="pt-0">

                <ResponseMessage setResponse={setResponse} response={response} />

                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Form.Group >
                            <Form.Label>Program Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={programForm.name || ''}
                                onChange={handleInputChange}
                                placeholder="Enter program name"
                                required
                                className="border-gray-300"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={programForm.category || ''}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                            >
                                <option value="">Select Category</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="SHORT_COURSE">Short Course</option>
                                <option value="LEARNERSHIP">Learnership</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                name="type"
                                value={programForm.type || ''}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
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
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={programForm.capacity || ''}
                                onChange={handleInputChange}
                                min="1"
                                required
                                className="border-gray-300"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={programForm.status || 'active'}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                            >
                                <option value="NOT_STARTED">Not Started</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                name="location"
                                value={programForm.location || ''}
                                onChange={handleInputChange}
                                placeholder='Enter program location'
                                className="border-gray-300"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={programForm.startDate || ''}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={programForm.endDate || ''}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-span-2">
                            <Form.Label>Descriptiion</Form.Label>
                            <RichTextEditor content={programForm?.description} onChange={handleDescriptionChange} />
                            <Form.Text className="text-muted dark:text-slate-400">Format your text with bold, italic, lists, and links</Form.Text>
                        </Form.Group>


                        {/* Image Upload Section */}
                        <Form.Group className="col-span-2">
                            <Form.Label>Program Image</Form.Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
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
                                    <FaUpload className="text-gray-400 text-2xl" />
                                    <span className="text-sm text-gray-500">
                                        Click to upload image
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        PNG, JPG, JPEG up to 5MB
                                    </span>
                                </label>

                                {/* Image Preview */}
                                {programForm.imageBlob && (
                                    <div className="mt-4 relative inline-block">
                                        <img
                                            src={programForm.imageBlob}
                                            alt="Program preview"
                                            className="max-h-48 rounded-lg object-cover shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProgramForm(prev => ({
                                                    ...prev,
                                                    imageFile: null,
                                                    imageBlob: null
                                                }));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    </div>



                    <div className="border-t pt-4 flex justify-end gap-2">
                        <Button
                            variant="outline-secondary"
                            onClick={onHide}
                            disabled={loading}
                        >
                            Close
                        </Button>
                        <Button
                            variant="success"
                            type='submit'
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" />
                                    {editingProgram ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    {editingProgram ? 'Update Program' : 'Create Program'}
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}