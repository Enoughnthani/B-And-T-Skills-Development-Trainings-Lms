import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FaBook, FaPenSquare } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { programTypes } from '../utils/constants';

const EMPTY_FORM = {
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
  imageBlob: null,
};

export default function ProgramForm({ getPrograms }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { program } = location.state || {};
  const { showResponse } = useApiResponse();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

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
        imageBlob: program.imageUrl || null,
      });
    }
  }, [program]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageBase64: reader.result,
        imageBlob: imageUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageBase64: '', imageBlob: null }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingProgram(null);
    setResponse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        category: formData.category,
        type: formData.type,
        description: formData.description,
        capacity: parseInt(formData.capacity, 10),
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        imageBase64: formData.imageBase64 || null,
      };

      const result = await apiFetch(
        editingProgram ? `${PROGRAMS}/${editingProgram.id}` : PROGRAMS,
        {
          method: editingProgram ? 'PUT' : 'POST',
          body: submitData,
        }
      );

      showResponse(result);
      setResponse(result);

      if (result?.success) {
        if (getPrograms) getPrograms();
        if (!editingProgram) resetForm();
        setTimeout(() => navigate(-1, { replace: true }), 1500);
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'An error occurred while saving the program. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    navigate(-1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto w-full">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Heading */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
          {editingProgram ? (
            <FaPenSquare className="text-zinc-700 text-base" />
          ) : (
            <FaBook className="text-zinc-700 text-base" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-black">
            {editingProgram ? 'Edit Programme' : 'Create New Programme'}
          </h1>
          <p className="text-sm text-zinc-500">
            {editingProgram
              ? 'Update the programme details.'
              : 'Add a new programme to the system.'}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <ResponseMessage setResponse={setResponse} response={response} />

          <Form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Programme name <span className="text-[#E30613]">*</span>
                </label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Business Administration NQF 4"
                  required
                  className="text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Category <span className="text-[#E30613]">*</span>
                </label>
                <Form.Select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  required
                  className="text-sm"
                >
                  <option value="">Select category</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="SHORT_COURSE">Short Course</option>
                  <option value="LEARNERSHIP">Learnership</option>
                </Form.Select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Field / Type <span className="text-[#E30613]">*</span>
                </label>
                <Form.Select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  required
                  className="text-sm"
                >
                  <option value="">Select field</option>
                  {programTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Capacity <span className="text-[#E30613]">*</span>
                </label>
                <Form.Control
                  type="number"
                  name="capacity"
                  value={formData.capacity || ''}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Status <span className="text-[#E30613]">*</span>
                </label>
                <Form.Select
                  name="status"
                  value={formData.status || 'NOT_STARTED'}
                  onChange={handleInputChange}
                  required
                  className="text-sm"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Form.Select>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Location
                </label>
                <Form.Control
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Gauteng"
                  className="text-sm"
                />
              </div>

              {/* Start date */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Start date <span className="text-[#E30613]">*</span>
                </label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                  required
                  className="text-sm"
                />
              </div>

              {/* End date */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  End date <span className="text-[#E30613]">*</span>
                </label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  required
                  className="text-sm"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Description
                </label>
                <RichTextEditor
                  content={formData?.description}
                  onChange={handleDescriptionChange}
                />
                <p className="text-xs text-zinc-400 mt-1.5">
                  Format your text with bold, italic, lists and links.
                </p>
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Programme image
                </label>

                <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:border-zinc-400 bg-zinc-50/40 transition-colors">
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
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                      <Upload className="text-zinc-400 text-xl" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      Click to upload image
                    </span>
                    <span className="text-xs text-zinc-400">
                      PNG, JPG or JPEG — up to 5MB
                    </span>
                  </label>

                  {formData.imageBlob && (
                    <div className="mt-4 relative inline-block">
                      <img
                        src={formData.imageBlob}
                        alt="Programme preview"
                        className="max-h-48 max-w-full rounded-xl object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#E30613] transition-colors shadow"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 mt-6 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    {editingProgram ? 'Updating…' : 'Creating…'}
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {editingProgram ? 'Update Programme' : 'Create Programme'}
                  </>
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}