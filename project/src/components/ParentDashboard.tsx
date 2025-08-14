import React, { useState, useEffect } from 'react';
import { User, Submission, EduScore } from '../types';
import { getAssignments, getSubmissions, calculateEduScores, getUsers } from '../utils/storage';
import { Heart, TrendingUp, Award, Calendar, BookOpen, LogOut, BarChart3, Target, Clock, CheckCircle } from 'lucide-react';

interface ParentDashboardProps {
  user: User;
  onLogout: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState([]);
  const [eduScores, setEduScores] = useState<EduScore[]>([]);
  const [child, setChild] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    const childUser = allUsers.find(u => u.id === user.childId);
    setChild(childUser || null);
    
    setAssignments(getAssignments());
    setSubmissions(getSubmissions());
    setEduScores(calculateEduScores());
  };

  if (!child) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Child information not found.</p>
        </div>
      </div>
    );
  }

  const childSubmissions = submissions.filter(s => s.studentId === child.id);
  const childScore = eduScores.find(score => score.studentId === child.id);
  const classmates = eduScores.filter(score => score.studentClass === child.class);
  const childRank = classmates
    .sort((a, b) => b.percentage - a.percentage)
    .findIndex(score => score.studentId === child.id) + 1;

  const recentSubmissions = childSubmissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const gradedSubmissions = childSubmissions.filter(s => s.score !== undefined);
  const pendingSubmissions = childSubmissions.filter(s => s.score === undefined);

  const stats = {
    totalSubmissions: childSubmissions.length,
    graded: gradedSubmissions.length,
    pending: pendingSubmissions.length,
    averageScore: childScore?.averageScore || 0,
    percentage: childScore?.percentage || 0,
    rank: childRank,
    totalStudents: classmates.length
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 75) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 60) return { label: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const performanceBadge = getPerformanceBadge(stats.percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
                <p className="text-gray-600">{user.name} - Monitoring {child.name}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Child Info Card */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-lg text-white p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{child.name}</h2>
              <p className="text-orange-100 mb-3">Class: {child.class}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Rank #{stats.rank}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{stats.percentage.toFixed(1)}% EduScore</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-10 h-10" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${performanceBadge.color} text-gray-900`}>
                {performanceBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BookOpen className="w-10 h-10 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.graded}</p>
                <p className="text-sm text-gray-600">Graded</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="w-10 h-10 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending Grade</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="w-10 h-10 text-purple-600 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${getPerformanceColor(stats.averageScore)}`}>
                  {stats.averageScore.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Performance Overview
            </h3>
            
            {childScore ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Score</span>
                    <span className="text-sm text-gray-600">
                      {childScore.totalScore}/{childScore.maxPossibleScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${childScore.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{childScore.percentage.toFixed(1)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{childScore.assignmentsCompleted}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">{childScore.averageScore.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Avg Score</p>
                  </div>
                </div>

                {/* Class Ranking */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Class Ranking</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">#{stats.rank}</span>
                    <span className="text-sm text-gray-600">out of {stats.totalStudents} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${((stats.totalStudents - stats.rank + 1) / stats.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No performance data available yet.</p>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Recent Submissions
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet.</p>
                </div>
              ) : (
                recentSubmissions.map(submission => {
                  const assignment = assignments.find((a: any) => a.id === submission.assignmentId);
                  return (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {assignment?.title || 'Unknown Assignment'}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2">
                            {submission.isLate && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                Late
                              </span>
                            )}
                            {submission.score !== undefined ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Graded
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {submission.score !== undefined ? (
                            <div>
                              <p className="text-lg font-bold text-green-600">
                                {submission.score}/{assignment?.maxScore}
                              </p>
                              <p className="text-xs text-gray-600">
                                {((submission.score / (assignment?.maxScore || 1)) * 100).toFixed(1)}%
                              </p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Awaiting</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {submission.feedback && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs font-medium text-blue-900 mb-1">Teacher Feedback:</p>
                          <p className="text-xs text-blue-800">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        {childScore && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Performance Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Completion Rate</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {((childScore.assignmentsCompleted / assignments.length) * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-blue-700">
                  {childScore.assignmentsCompleted} out of {assignments.length} assignments
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Success Rate</h4>
                <p className="text-2xl font-bold text-green-600">{childScore.percentage.toFixed(1)}%</p>
                <p className="text-sm text-green-700">
                  {childScore.percentage >= 75 ? 'Above average performance' : 'Room for improvement'}
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Class Position</h4>
                <p className="text-2xl font-bold text-orange-600">#{stats.rank}</p>
                <p className="text-sm text-orange-700">
                  {stats.rank <= 3 ? 'Top performer!' : 'Keep encouraging!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;