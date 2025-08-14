import React, { useState } from 'react';
import { Submission, Assignment, FileAttachment } from '../types';
import { X, Download, Star, Calendar, User, FileText, Image } from 'lucide-react';

interface SubmissionViewProps {
  submission: Submission;
  assignment: Assignment;
  onGrade: (submissionId: string, score: number, feedback: string) => void;
  onClose: () => void;
}

const SubmissionView: React.FC<SubmissionViewProps> = ({ submission, assignment, onGrade, onClose }) => {
  const [score, setScore] = useState(submission.score || 0);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isGrading, setIsGrading] = useState(false);

  const downloadAttachment = (attachment: FileAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGrading(true);
    onGrade(submission.id, score, feedback);
  };

  const previewAttachment = (attachment: FileAttachment) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      if (attachment.type.startsWith('image/')) {
        newWindow.document.write(`
          <html>
            <head><title>${attachment.name}</title></head>
            <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">
              <img src="${attachment.data}" style="max-width: 100%; max-height: 100vh; object-fit: contain;" alt="${attachment.name}">
            </body>
          </html>
        `);
      } else if (attachment.type === 'application/pdf') {
        newWindow.document.write(`
          <html>
            <head><title>${attachment.name}</title></head>
            <body style="margin: 0;">
              <embed src="${attachment.data}" type="application/pdf" width="100%" height="100%" />
            </body>
          </html>
        `);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {submission.score !== undefined ? 'View Graded Submission' : 'Grade Submission'}
            </h2>
            <p className="text-gray-600 mt-1">{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-medium text-gray-900">{submission.studentName}</p>
                  <p className="text-sm text-gray-500">{submission.studentClass}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                  {submission.isLate && (
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs mt-1">
                      Late Submission
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Content */}
          {submission.content && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Student Response</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {submission.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Submitted Files</h3>
              <div className="grid gap-3">
                {submission.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      {attachment.type.startsWith('image/') ? (
                        <Image className="w-6 h-6 mr-3 text-green-600" />
                      ) : (
                        <FileText className="w-6 h-6 mr-3 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">
                          {attachment.type} • {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => previewAttachment(attachment)}
                        className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => downloadAttachment(attachment)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grading Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {submission.score !== undefined ? 'Grade & Feedback' : 'Grade This Submission'}
            </h3>
            
            <form onSubmit={handleGrade} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    Score (out of {assignment.maxScore})
                  </label>
                  <input
                    type="number"
                    id="score"
                    value={score}
                    onChange={(e) => setScore(Math.max(0, Math.min(assignment.maxScore, parseInt(e.target.value) || 0)))}
                    min="0"
                    max={assignment.maxScore}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submission.score !== undefined}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Percentage: {assignment.maxScore > 0 ? ((score / assignment.maxScore) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide feedback to help the student improve..."
                  disabled={submission.score !== undefined}
                />
              </div>

              {submission.score !== undefined ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      This submission has been graded: {submission.score}/{assignment.maxScore} points
                    </span>
                  </div>
                  {submission.gradedAt && (
                    <p className="text-sm text-green-700 mt-1">
                      Graded on: {new Date(submission.gradedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGrading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    {isGrading ? 'Saving Grade...' : 'Save Grade'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionView;