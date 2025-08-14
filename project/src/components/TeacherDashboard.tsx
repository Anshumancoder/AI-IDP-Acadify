import React, { useState, useEffect } from 'react';
import { User, Assignment, Submission } from '../types';
import { getAssignments, getSubmissions, saveAssignment, saveSubmission, calculateEduScores, generateId } from '../utils/storage';
import { BookOpen, Plus, Users, BarChart3, LogOut, Calendar, Clock, FileText, Download, Star, Award } from 'lucide-react';
import AssignmentForm from './AssignmentForm';
import SubmissionView from './SubmissionView';
import Leaderboard from './Leaderboard';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [eduScores, setEduScores] = useState(calculateEduScores());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAssignments(getAssignments());
    setSubmissions(getSubmissions());
    setEduScores(calculateEduScores());
  };

  const handleCreateAssignment = (assignmentData: Omit<Assignment, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>) => {
    const assignment: Assignment = {
      ...assignmentData,
      id: generateId(),
      teacherId: user.id,
      teacherName: user.name,
      createdAt: new Date().toISOString()
    };
    
    saveAssignment(assignment);
    loadData();
    setShowAssignmentForm(false);
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      const updatedSubmission = {
        ...submission,
        score,
        feedback,
        gradedAt: new Date().toISOString()
      };
      saveSubmission(updatedSubmission);
      loadData();
      setSelectedSubmission(null);
    }
  };

  const myClassSubmissions = submissions.filter(s => s.studentClass === user.class);
  const pendingSubmissions = myClassSubmissions.filter(s => s.score === undefined);
  const gradedSubmissions = myClassSubmissions.filter(s => s.score !== undefined);

  const stats = {
    totalAssignments: assignments.length,
    pendingGrading: pendingSubmissions.length,
    totalSubmissions: myClassSubmissions.length,
    classAverage: eduScores
      .filter(score => score.studentClass === user.class)
      .reduce((sum, score) => sum + score.percentage, 0) / 
      eduScores.filter(score => score.studentClass === user.class).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">{user.name} - {user.class}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FileText className="w-10 h-10 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
                <p className="text-sm text-gray-600">Total Assignments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="w-10 h-10 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingGrading}</p>
                <p className="text-sm text-gray-600">Pending Grading</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="w-10 h-10 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="w-10 h-10 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.classAverage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Class Average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'assignments', label: 'Assignments', icon: FileText },
                { key: 'submissions', label: 'Submissions', icon: Users },
                { key: 'leaderboard', label: 'Leaderboard', icon: Award }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'assignments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
                  <button
                    onClick={() => setShowAssignmentForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Assignment
                  </button>
                </div>

                <div className="grid gap-4">
                  {assignments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No assignments created yet. Create your first assignment!</p>
                    </div>
                  ) : (
                    assignments.map(assignment => (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                            <p className="text-gray-600 mb-3">{assignment.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                Max Score: {assignment.maxScore}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {submissions.filter(s => s.assignmentId === assignment.id).length} submissions
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Submissions</h2>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {pendingSubmissions.length} Pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {gradedSubmissions.length} Graded
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {myClassSubmissions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet.</p>
                    </div>
                  ) : (
                    myClassSubmissions.map(submission => {
                      const assignment = assignments.find(a => a.id === submission.assignmentId);
                      return (
                        <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{submission.studentName}</h3>
                                {submission.isLate && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                    Late
                                  </span>
                                )}
                                {submission.score !== undefined && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    Graded
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Assignment: {assignment?.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                Submitted: {new Date(submission.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              {submission.score !== undefined && (
                                <p className="text-lg font-semibold text-green-600 mb-1">
                                  {submission.score}/{assignment?.maxScore}
                                </p>
                              )}
                              <button
                                onClick={() => setSelectedSubmission(submission)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                {submission.score !== undefined ? 'View Grade' : 'Grade'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard eduScores={eduScores} userClass={user.class} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAssignmentForm && (
        <AssignmentForm
          onSave={handleCreateAssignment}
          onCancel={() => setShowAssignmentForm(false)}
        />
      )}

      {selectedSubmission && (
        <SubmissionView
          submission={selectedSubmission}
          assignment={assignments.find(a => a.id === selectedSubmission.assignmentId)!}
          onGrade={handleGradeSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;