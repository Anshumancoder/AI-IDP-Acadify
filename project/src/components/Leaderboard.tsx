import React from 'react';
import { EduScore } from '../types';
import { Award, Trophy, Medal, Star, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  eduScores: EduScore[];
  userClass?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ eduScores, userClass }) => {
  // Filter scores by class if specified, otherwise show all
  const filteredScores = userClass 
    ? eduScores.filter(score => score.studentClass === userClass)
    : eduScores;

  // Sort by percentage in descending order
  const sortedScores = [...filteredScores].sort((a, b) => b.percentage - a.percentage);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <Star className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 75) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 60) return { label: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  if (sortedScores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No scores available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {userClass ? `${userClass} Leaderboard` : 'Overall Leaderboard'}
        </h2>
        <div className="text-sm text-gray-600">
          {sortedScores.length} student{sortedScores.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Top 3 Podium */}
      {sortedScores.length >= 3 && (
        <div className="flex justify-center items-end space-x-4 mb-8">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-24 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-t-lg flex items-center justify-center mb-2">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 min-w-[120px]">
              <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="font-semibold text-gray-900 text-sm">{sortedScores[1].studentName}</p>
              <p className="text-xs text-gray-600 mb-1">{sortedScores[1].studentClass}</p>
              <p className="text-lg font-bold text-gray-700">{sortedScores[1].percentage.toFixed(1)}%</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="w-28 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-lg flex items-center justify-center mb-2">
              <span className="text-white font-bold text-2xl">1</span>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 min-w-[140px] border-2 border-yellow-400">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-bold text-gray-900">{sortedScores[0].studentName}</p>
              <p className="text-xs text-gray-600 mb-2">{sortedScores[0].studentClass}</p>
              <p className="text-xl font-bold text-yellow-600">{sortedScores[0].percentage.toFixed(1)}%</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-24 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-lg flex items-center justify-center mb-2">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 min-w-[120px]">
              <Award className="w-6 h-6 text-orange-600 mx-auto mb-1" />
              <p className="font-semibold text-gray-900 text-sm">{sortedScores[2].studentName}</p>
              <p className="text-xs text-gray-600 mb-1">{sortedScores[2].studentClass}</p>
              <p className="text-lg font-bold text-orange-600">{sortedScores[2].percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Complete Rankings */}
      <div className="space-y-3">
        {sortedScores.map((score, index) => {
          const rank = index + 1;
          const performanceBadge = getPerformanceBadge(score.percentage);
          
          return (
            <div
              key={score.studentId}
              className={`rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${getRankColor(rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(rank)}
                    <span className={`text-2xl font-bold ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      #{rank}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      {score.studentName}
                    </h3>
                    <p className={`text-sm ${rank <= 3 ? 'text-white opacity-90' : 'text-gray-600'}`}>
                      {score.studentClass}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className={`text-sm ${rank <= 3 ? 'text-white opacity-75' : 'text-gray-600'}`}>
                      Assignments
                    </p>
                    <p className={`text-lg font-semibold ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      {score.assignmentsCompleted}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-sm ${rank <= 3 ? 'text-white opacity-75' : 'text-gray-600'}`}>
                      Avg Score
                    </p>
                    <p className={`text-lg font-semibold ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      {score.averageScore.toFixed(1)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-sm ${rank <= 3 ? 'text-white opacity-75' : 'text-gray-600'}`}>
                      EduScore
                    </p>
                    <p className={`text-2xl font-bold ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      {score.percentage.toFixed(1)}%
                    </p>
                  </div>

                  {rank > 3 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${performanceBadge.color}`}>
                      {performanceBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className={`w-full rounded-full h-2 ${rank <= 3 ? 'bg-white bg-opacity-30' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      rank <= 3 ? 'bg-white' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, score.percentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Statistics */}
      {sortedScores.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(sortedScores.reduce((sum, score) => sum + score.percentage, 0) / sortedScores.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Class Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {sortedScores[0].percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Highest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {sortedScores[sortedScores.length - 1].percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Lowest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {sortedScores.filter(s => s.percentage >= 75).length}
              </p>
              <p className="text-sm text-gray-600">Above 75%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;