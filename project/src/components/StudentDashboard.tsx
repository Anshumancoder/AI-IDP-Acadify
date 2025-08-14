import React, { useState, useEffect } from 'react';
import { User, Assignment, Submission } from '../types';
import { getAssignments, getSubmissions, saveSubmission, calculateEduScores, generateId, getUsers } from '../utils/storage';
import { GraduationCap, FileText, Upload, Clock, Star, Award, LogOut, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import SubmissionForm from './SubmissionForm';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [eduScores, setEduScores] = useState(calculateEduScores());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAssignments(getAssignments());
    setSubmissions(getSubmissions());
    setEduScores(calculateEduScores());
  };

  const handleSubmitAssignment = (assignmentId: string, content: string, attachments: any[]) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    const now = new Date();
    const dueDate = new Date(assignment?.dueDate || '');
    const isLate = now > dueDate;

    const submission: Submission = {
      id: generateId(),
      assignmentId,
      studentId: user.id,
      studentName: user.name,
      studentClass: user.class || '',
      content,
      attachments,
      submittedAt: now.toISOString(),
      isLate
    };

    saveSubmission(submission);
    loadData();
    setSelectedAssignment(null);
  };

  const mySubmissions = submissions.filter(s => s.studentId === user.id);
  const myScore = eduScores.find(score => score.studentId === user.id);
  const classmates = eduScores.filter(score => score.studentClass === user.class);
  const myRank = classmates
    .sort((a, b) => b.percentage - a.percentage)
    .findIndex(score => score.studentId === user.id) + 1;

  const pendingAssignments = assignments.filter(assignment => 
    !mySubmissions.some(sub => sub.assignmentId === assignment.id)
  );

  const completedAssignments = assignments.filter(assignment => 
    mySubmissions.some(sub => sub.assignmentId === assignment.id)
  );

  const stats = {
    totalAssignments: assignments.length,
    completed: completedAssignments.length,
    pending: pendingAssignments.length,
    averageScore: myScore?.averageScore || 0,
    totalScore: myScore?.totalScore || 0,
    percentage: myScore?.percentage || 0,
    rank: myRank
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
              <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="w-10 h-10 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.percentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">EduScore</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Award className="w-10 h-10 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
                <p className="text-sm text-gray-600">Class Rank</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{stats.completed}/{stats.totalAssignments} assignments</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${(stats.completed / stats.totalAssignments) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {myScore && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{myScore.totalScore}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{myScore.percentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{myScore.averageScore.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'assignments', label: 'Assignments', icon: FileText },
                { key: 'submissions', label: 'My Submissions', icon: Upload }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'border-green-500 text-green-600'
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Assignments</h2>
                
                {/* Pending Assignments */}
                {pendingAssignments.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-orange-600" />
                      Pending ({pendingAssignments.length})
                    </h3>
                    <div className="grid gap-4">
                      {pendingAssignments.map(assignment => {
                        const isOverdue = new Date() > new Date(assignment.dueDate);
                        return (
                          <div key={assignment.id} className={`border rounded-lg p-4 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                  {isOverdue && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{assignment.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Due: {new Date(assignment.dueDate).toLocaleString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1" />
                                    Max Score: {assignment.maxScore}
                                  </span>
                                  <span className="text-gray-400">
                                    By: {assignment.teacherName}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <button
                                  onClick={() => setSelectedAssignment(assignment)}
                                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                    isOverdue && !assignment.allowLateSubmission
                                      ? 'bg-gray-400 cursor-not-allowed'
                                      : 'bg-green-600 hover:bg-green-700'
                                  }`}
                                  disabled={isOverdue && !assignment.allowLateSubmission}
                                >
                                  {isOverdue && assignment.allowLateSubmission ? 'Submit Late' : 'Submit'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Completed Assignments */}
                {completedAssignments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Completed ({completedAssignments.length})
                    </h3>
                    <div className="grid gap-4">
                      {completedAssignments.map(assignment => {
                        const submission = mySubmissions.find(s => s.assignmentId === assignment.id);
                        return (
                          <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  {submission?.isLate && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                      Late Submission
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-2">Submitted: {new Date(submission?.submittedAt || '').toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                {submission?.score !== undefined ? (
                                  <div>
                                    <p className="text-2xl font-bold text-green-600">
                                      {submission.score}/{assignment.maxScore}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {((submission.score / assignment.maxScore) * 100).toFixed(1)}%
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-orange-600 font-medium">
                                    Awaiting Grade
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {assignments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No assignments available yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Submissions</h2>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {mySubmissions.filter(s => s.score === undefined).length} Pending Grade
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {mySubmissions.filter(s => s.score !== undefined).length} Graded
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {mySubmissions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet. Complete your first assignment!</p>
                    </div>
                  ) : (
                    mySubmissions
                      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                      .map(submission => {
                        const assignment = assignments.find(a => a.id === submission.assignmentId);
                        return (
                          <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">{assignment?.title}</h4>
                                  {submission.isLate && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
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
                                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                </p>
                                {submission.feedback && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-900 mb-1">Feedback:</p>
                                    <p className="text-sm text-blue-800">{submission.feedback}</p>
                                  </div>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                {submission.score !== undefined ? (
                                  <div>
                                    <p className="text-2xl font-bold text-green-600 mb-1">
                                      {submission.score}/{assignment?.maxScore}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {((submission.score / (assignment?.maxScore || 1)) * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Graded: {new Date(submission.gradedAt || '').toLocaleDateString()}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <Clock className="w-8 h-8 text-orange-500 mx-auto mb-1" />
                                    <p className="text-sm text-orange-600 font-medium">
                                      Awaiting Grade
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <SubmissionForm
          assignment={selectedAssignment}
          onSubmit={handleSubmitAssignment}
          onCancel={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;