import { Button, Card, Pagination, ProgressBar } from 'react-bootstrap';
import { FaBook, FaClock, FaMapMarkerAlt, FaPlus, FaUsers } from 'react-icons/fa';

export default function ProgramGrid({ 
    programs, 
    currentPage, 
    itemsPerPage, 
    totalPages,
    onPageChange,
    onProgramClick,
    onAddProgram,
    getCategoryIcon,
    getCategoryColor,
    getStatusBadge,
    getActions
}) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPrograms = programs.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPrograms.map(program => (
                    <Card 
                        onClick={() => onProgramClick(program)} 
                        key={program.id} 
                        className="cursor-pointer border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <Card.Body className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-10 h-10 bg-${getCategoryColor(program.category)}-100 rounded-lg flex items-center justify-center`}>
                                    <div className={`text-${getCategoryColor(program.category)}-600`}>
                                        {getCategoryIcon(program.category)}
                                    </div>
                                </div>
                            </div>

                            <h5 className="font-bold min-h-[2.5rem] text-gray-800 mb-2 line-clamp-2">{program.name}</h5>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <FaUsers className="text-xs" /> {program?.category === 'INTERNSHIP' ? 'Interns' : 'Learners'}
                                    </span>
                                    <span className="font-medium">
                                        {program.enrolledCount}/{program.capacity}
                                    </span>
                                </div>
                                <ProgressBar
                                    now={(program.enrolledCount / program.capacity) * 100}
                                    variant={getCategoryColor(program.category)}
                                    className="h-1.5"
                                />

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <FaClock className="text-xs" /> Duration
                                    </span>
                                    <span className="font-medium">{program.duration}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-xs" /> Location
                                    </span>
                                    <span className="font-medium">{program.location}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    {getStatusBadge(program.status)}
                                </div>
                            </div>

                            
                            <div className='w-full me-auto'>
                                {getActions(program)}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {programs.length === 0 && (
                <div className="w-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBook className="text-gray-400 text-2xl" />
                    </div>
                    <h4 className="text-gray-700 font-medium mb-2">No programs found</h4>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or add a new program</p>
                    <Button variant="primary" onClick={onAddProgram}>
                        <FaPlus className="me-2" /> Add First Program
                    </Button>
                </div>
            )}

            {/* Pagination */}
            {programs.length > 0 && (
                <div className="mt-auto flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, programs.length)} of {programs.length} programs
                    </div>
                    <Pagination className="mb-0">
                        <Pagination.Prev
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, idx) => (
                            <Pagination.Item
                                key={idx + 1}
                                active={idx + 1 === currentPage}
                                onClick={() => onPageChange(idx + 1)}
                            >
                                {idx + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </>
    );
}