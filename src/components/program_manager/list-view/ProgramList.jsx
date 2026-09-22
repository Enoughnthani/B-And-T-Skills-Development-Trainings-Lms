import { Badge, Button, Card, Pagination, ProgressBar, Table } from 'react-bootstrap';
import { FaBook, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProgramList({
    programs,
    currentPage,
    itemsPerPage,
    totalPages,
    sortConfig,
    onSort,
    onPageChange,
    onProgramClick,
    onAddProgram,
    getCategoryIcon,
    getCategoryColor,
    getStatusBadge,
    getTypeBadge,
    getActions
}) {
    const navigate = useNavigate();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPrograms = programs.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Card className="border-0 shadow-sm p-1 rounded-lg">
            <Card.Body className="p-0">
                <div>
                    {currentPrograms.length > 0 ? (
                        <>
                            <Table hover className="mb-0">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer"
                                            onClick={() => onSort('name')}
                                        >
                                            Program {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer"
                                            onClick={() => onSort('category')}
                                        >
                                            Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer"
                                            onClick={() => onSort('type')}
                                        >
                                            Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer"
                                            onClick={() => onSort('status')}
                                        >
                                            Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer"
                                            onClick={() => onSort('learners')}
                                        >
                                            Learners {sortConfig.key === 'learners' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="border-0 px-4 py-3 text-gray-700 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPrograms.map(program => (
                                        <tr
                                            onClick={() => onProgramClick(program)}
                                            key={program.id}
                                            className="cursor-pointer hover:bg-red-50/30 border-b border-gray-100"
                                        >
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex-shrink-0 bg-${getCategoryColor(program.category)}-100 rounded-md p-2`}>
                                                        <div className={`text-${getCategoryColor(program.category)}-600`}>
                                                            {getCategoryIcon(program.category)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-800">{program.name}</div>
                                                        <div className="text-sm text-gray-600">{program.facilitator}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge bg="light" text="dark" className="border border-gray-200 px-3">
                                                    {program.category === 'SHORT_COURSE' ? 'Short Course' :
                                                        program.category === 'LEARNERSHIP' ? 'Learnership' : 'Internship'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getTypeBadge(program.type)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(program.status)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div>
                                                    <div className="font-medium">{program?.enrolledCount}/{program.capacity}</div>
                                                    <ProgressBar
                                                        now={(program.enrolledCount) / program.capacity * 100}
                                                        variant={getCategoryColor(program.category)}
                                                        className="h-1 mt-1 w-24"
                                                    />
                                                </div>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()} className="p-4 align-middle">
                                                {getActions(program)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Pagination */}
                            {programs.length > 0 && (
                                <div className="mt-auto flex flex-col sm:flex-row items-center justify-between py-6 gap-4 px-4">
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
                    ) : (
                        <div className="text-center py-12">
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
                </div>
            </Card.Body>
        </Card>
    );
}