import React, { useState } from 'react';
import { Assignment, FileAttachment } from '../types';
import { X, Upload, FileText, Image, AlertCircle } from 'lucide-react';
import { generateId } from '../utils/storage';

interface SubmissionFormProps {
  assignment: Assignment;
  onSubmit: (assignmentId: string, content: string, attachments: FileAttachment[]) => void;
  onCancel: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ assignment, onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOverdue = new Date() > new Date(assignment.dueDate);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Check file type (PDF or image)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF files and images (JPEG, PNG, GIF, WebP) are allowed.');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const attachment: FileAttachment = {
          id: generateId(),
          name: file.name,
          type: file.type,
          data: reader.result as string,
          size: file.size
        };
        setAttachments(prev => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const downloadAttachment = (attachment: FileAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) {
      alert('Please provide either text content or file attachments.');
      return;
    }

    setIsSubmitting(true);
    onSubmit(assignment.id, content, attachments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Submit Assignment</h2>
            <p className="text-gray-600 mt-1">{assignment.title}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isOverdue && (
          <div className="mx-6 mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">
                This assignment is overdue. {assignment.allowLateSubmission ? 'Late submission allowed.' : 'Late submissions not accepted.'}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Assignment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Assignment Details</h3>
            <p className="text-gray-600 mb-3">{assignment.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
              <span>Max Score: {assignment.maxScore} points</span>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Type your assignment response here..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Upload Files (PDF or Images)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, JPEG, PNG, GIF, WebP. Max size: 10MB per file.
            </p>
            
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {attachment.type.startsWith('image/') ? (
                        <Image className="w-5 h-5 mr-2 text-green-600" />
                      ) : (
                        <FileText className="w-5 h-5 mr-2 text-red-600" />
                      )}
                      <div>
                        <span className="text-sm text-gray-700 font-medium">{attachment.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => downloadAttachment(attachment)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignment Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assignment Files:</h4>
              <div className="space-y-2">
                {assignment.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{attachment.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadAttachment(attachment)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (isOverdue && !assignment.allowLateSubmission)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : isOverdue ? 'Submit Late' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;