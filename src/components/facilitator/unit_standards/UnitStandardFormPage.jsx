import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { FaArrowLeft, FaBook, FaCode, FaFileAlt, FaGraduationCap, FaSave, FaStar, FaTag } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function UnitStandardFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const location = useLocation()
  const { programId } = useParams()
  const { unitStandard } = location?.state || {}
  const [response, setResponse] = useState(null)
  const { showResponse } = useApiResponse()

  const [formData, setFormData] = useState({
    unitStandardId: '',
    title: '',
    description: '',
    credits: '',
    nqfLevel: 'NQF Level 4',
    type: 'Core',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && unitStandard) {
      setFormData({
        unitStandardId: unitStandard?.unitStandardId,
        title: unitStandard?.title,
        description: unitStandard?.description,
        credits: unitStandard?.credits,
        nqfLevel: unitStandard?.nqfLevel,
        type: unitStandard?.type,
      });
    }
  }, [isEditing, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        unitStandardId: formData?.unitStandardId,
        title: formData.title,
        description: formData.description,
        credits: parseInt(formData.credits),
        nqfLevel: formData.nqfLevel,
        type: formData?.type.toUpperCase(),
        programId: programId
      };

      var data;

      if (isEditing) {
        data = await apiFetch(`/api/unit-standards/${formData?.unitStandardId}`, {
          method: 'PUT',
          body: submitData
        });
      } else {
        data = await apiFetch('/api/unit-standards', {
          method: 'POST',
          body: submitData
        });
      }

      if (data?.success) {
        resetForm()
      }


      setResponse(data)
      showResponse(data)
    } catch (err) {
      console.log('Failed to save unit standard');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      unitStandardId: '',
      title: '',
      description: '',
      credits: '',
      nqfLevel: 'NQF Level 4',
      type: 'Core',
    });

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <div className='p-3 m-1 bg-white rounded-xl overflow-hidden'>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition"
          >
            <FaArrowLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isEditing ? 'bg-orange-100' : 'bg-blue-100'}`}>
              {isEditing ? (
                <FaCode className="text-orange-600 text-xl" />
              ) : (
                <FaCode className="text-blue-600 text-xl" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Edit Unit Standard' : 'Create Unit Standard'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEditing ? 'Update unit standard details' : 'Add a new unit standard to the learnership'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className='bg-transparent border-0'>
          <Card.Body className="p-6">
            {error && (
              <Alert variant="danger" className="mb-4 rounded-lg">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Code */}
                <Form.Group>
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">
                    <FaCode className="inline mr-1 text-blue-500" size={12} />
                    SAQA ID *
                  </Form.Label>
                  <Form.Control
                    disabled={isEditing}
                    type="text"
                    name="unitStandardId"
                    placeholder="e.g., 14933"
                    value={formData.unitStandardId}
                    onChange={handleChange}
                    className="border-gray-300 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-200 transition"
                    required
                  />
                  <Form.Text className="text-xs text-gray-400">
                    Unique identifier for this unit standard
                  </Form.Text>
                </Form.Group>

                {/* Credits */}
                <Form.Group>
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">
                    <FaStar className="inline mr-1 text-amber-500" size={12} />
                    Credits
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="credits"
                    placeholder="e.g., 5"
                    value={formData.credits}
                    onChange={handleChange}
                    className="border-gray-300 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-200 transition"
                  />
                  <Form.Text className="text-xs text-gray-400">
                    Number of credits for this unit
                  </Form.Text>
                </Form.Group>

                {/* Title */}
                <Form.Group className="md:col-span-2">
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">
                    <FaBook className="inline mr-1 text-green-500" size={12} />
                    Unit Standard Title *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter the full title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border-gray-300 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-200 transition"
                    required
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="md:col-span-2">
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">
                    <FaFileAlt className="inline mr-1 text-purple-500" size={12} />
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Enter a detailed description of the unit standard..."
                    value={formData.description}
                    onChange={handleChange}
                    className="border-gray-300 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-200 transition resize-none"
                  />
                </Form.Group>

                {/* NQF Level */}
                <Form.Group>
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">
                    <FaGraduationCap className="inline mr-1 text-indigo-500" size={12} />
                    NQF Level
                  </Form.Label>
                  <Form.Select
                    name="nqfLevel"
                    value={formData.nqfLevel}
                    onChange={handleChange}
                    className="border-gray-300 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-200 transition"
                  >
                    <option value="NQF Level 1">NQF Level 1</option>
                    <option value="NQF Level 2">NQF Level 2</option>
                    <option value="NQF Level 3">NQF Level 3</option>
                    <option value="NQF Level 4">NQF Level 4</option>
                    <option value="NQF Level 5">NQF Level 5</option>
                  </Form.Select>
                </Form.Group>

                {/* Type */}
                <Form.Group>
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">
                    <FaTag className="inline mr-1 text-pink-500" size={12} />
                    Type
                  </Form.Label>
                  <div className="flex gap-3">
                    {['Fundamental', 'Core', 'Elective'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`text-sm px-2 py-0.5 rounded-full ${type === 'Fundamental' ? 'bg-blue-100 text-blue-700' :
                          type === 'Core' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </Form.Group>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <Button
                  variant='success'
                  type="submit"
                  disabled={loading}
                  className="font-semibold flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={16} />
                      {isEditing ? 'Update Unit Standard' : 'Create Unit Standard'}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}