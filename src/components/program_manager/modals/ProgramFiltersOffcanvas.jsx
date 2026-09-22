import { Offcanvas, Form, Button } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { categories, statuses, programTypes } from '../utils/constants';

export default function ProgramFiltersOffcanvas({ 
    show, 
    onHide, 
    selectedCategory, 
    setSelectedCategory, 
    selectedStatus, 
    setSelectedStatus, 
    selectedType, 
    setSelectedType,
    onApply,
    onReset
}) {
    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="w-80">
            <Offcanvas.Header className="border-b">
                <Offcanvas.Title className="flex items-center gap-2">
                    <FaFilter className="text-red-600" />
                    <span className="font-bold">Filters</span>
                </Offcanvas.Title>
                <button 
                    onClick={onHide}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                    <FaTimes className="text-gray-500" />
                </button>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="space-y-6">
                    <div>
                        <h6 className="font-semibold text-gray-700 mb-3">Category</h6>
                        <div className="space-y-2">
                            <Form.Check
                                type="radio"
                                name="category"
                                id="category-all"
                                label="All Categories"
                                value="all"
                                checked={selectedCategory === 'all'}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="mb-2"
                            />
                            {categories.map(cat => (
                                <Form.Check
                                    key={cat.id}
                                    type="radio"
                                    name="category"
                                    id={`category-${cat.id}`}
                                    label={cat.label}
                                    value={cat.id}
                                    checked={selectedCategory === cat.id}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h6 className="font-semibold text-gray-700 mb-3">Status</h6>
                        <div className="space-y-2">
                            <Form.Check
                                type="radio"
                                name="status"
                                id="status-all"
                                label="All Status"
                                value="all"
                                checked={selectedStatus === 'all'}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="mb-2"
                            />
                            {statuses.map(status => (
                                <Form.Check
                                    key={status.id}
                                    type="radio"
                                    name="status"
                                    id={`status-${status.id}`}
                                    label={status.label}
                                    value={status.id}
                                    checked={selectedStatus === status.id}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h6 className="font-semibold text-gray-700 mb-3">Type</h6>
                        <div className="space-y-2">
                            <Form.Check
                                type="radio"
                                name="type"
                                id="type-all"
                                label="All Types"
                                value="all"
                                checked={selectedType === 'all'}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="mb-2"
                            />
                            {programTypes.map(type => (
                                <Form.Check
                                    key={type}
                                    type="radio"
                                    name="type"
                                    id={`type-${type}`}
                                    label={type}
                                    value={type}
                                    checked={selectedType === type}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button 
                            variant="outline-danger" 
                            onClick={onReset}
                            className="flex-1"
                        >
                            Reset
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={onApply}
                            className="flex-1"
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}