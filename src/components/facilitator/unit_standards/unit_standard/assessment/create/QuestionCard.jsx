import { Card, Badge } from 'react-bootstrap';
import { FaCopy, FaTrash, FaPlus } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import QuestionEditor from './QuestionEditor';

export default function QuestionCard({ question, index, questionTypes, onUpdate, onDuplicate, onDelete }) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Badge className="!bg-blue-100 text-blue-700 px-2 py-1">
              {index + 1}. {questionTypes.find(t => t.id === question.type)?.label}
            </Badge>
            <input
              type="number"
              value={question.marks}
              onChange={(e) => onUpdate(question.id, 'marks', e.target.value)}
              placeholder="Marks"
              className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-center"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => onDuplicate(question)} className="p-1 bg-transparent text-blue-500" title="Duplicate">
              <FaCopy size={14} />
            </button>
            <button onClick={() => onDelete(question.id)} className="p-1 bg-transparent text-red-500" title="Delete">
              <FaTrash size={14} />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={question.text}
            onChange={(e) => onUpdate(question.id, 'text', e.target.value)}
            placeholder="Enter your question here..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium"
          />
        </div>
        
        <QuestionEditor question={question} onUpdate={onUpdate} />
        
        <div className="mt-4">
          <textarea
            value={question.explanation}
            onChange={(e) => onUpdate(question.id, 'explanation', e.target.value)}
            placeholder="Explanation (optional) - shown after answering"
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500"
          />
        </div>
      </Card.Body>
    </Card>
  );
}