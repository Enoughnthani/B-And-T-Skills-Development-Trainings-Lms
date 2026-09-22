import { Button, Modal, ProgressBar } from 'react-bootstrap';
import { FaClock, FaUsers, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { categories, statuses } from '../utils/constants';

export default function ViewProgramModal({ show, onHide, program, onEdit, getCategoryIcon, getStatusBadge }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.color : 'gray';
    };

    if (!program) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="text-xl font-bold text-gray-800">
                    Program Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 bg-${getCategoryColor(program.category)}-100 rounded-xl flex items-center justify-center`}>
                                <div className={`text-${getCategoryColor(program.category)}-600 text-2xl`}>
                                    {getCategoryIcon(program.category)}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-800">{program.title}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    {getStatusBadge(program.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Duration</div>
                            <div className="font-semibold flex items-center justify-center gap-1">
                                <FaClock /> {program.duration}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Learners</div>
                            <div className="font-semibold flex items-center justify-center gap-1">
                                <FaUsers /> {program.learners}/{program.capacity}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Location</div>
                            <div className="font-semibold flex items-center justify-center gap-1">
                                <FaMapMarkerAlt /> {program.location}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Type</div>
                            <div className="font-semibold">{program.type}</div>
                        </div>
                    </div>

                    <div>
                        <h6 className="font-bold text-gray-800 mb-2">Description</h6>
                        <p className="text-gray-700">{program.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h6 className="font-bold text-gray-800 mb-2">Program Details</h6>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Facilitator:</span>
                                    <span className="font-medium">{program.facilitator}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Start Date:</span>
                                    <span className="font-medium">{formatDate(program.startDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">End Date:</span>
                                    <span className="font-medium">{formatDate(program.endDate)}</span>
                                </div>
                                {program.price > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price:</span>
                                        <span className="font-medium">${program.price}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {program.tags && program.tags.length > 0 && (
                            <div>
                                <h6 className="font-bold text-gray-800 mb-2">Tags</h6>
                                <div className="flex flex-wrap gap-2">
                                    {program.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <h6 className="font-bold text-gray-800 mb-2">Enrollment Progress</h6>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Learner Capacity</span>
                                <span>{program.learners}/{program.capacity}</span>
                            </div>
                            <ProgressBar
                                now={(program.learners / program.capacity) * 100}
                                variant="danger"
                                className="h-2"
                            />
                            <div className="text-xs text-gray-500 text-right">
                                {Math.round((program.learners / program.capacity) * 100)}% filled
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-t pt-4">
                <Button
                    variant="outline-warning"
                    onClick={() => {
                        onHide();
                        onEdit(program);
                    }}
                    className="flex items-center gap-2"
                >
                    <FaEdit /> Edit Program
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}