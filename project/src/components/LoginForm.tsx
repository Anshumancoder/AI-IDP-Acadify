import React, { useState } from 'react';
import { User, GraduationCap, LogIn, Users, BookOpen, Heart } from 'lucide-react';
import { getUsers } from '../utils/storage';
import { User as UserType } from '../types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | 'parent'>('student');
  const [selectedUser, setSelectedUser] = useState<string>('');

  const users = getUsers();
  const filteredUsers = users.filter(user => user.role === selectedRole);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUser);
    if (user) {
      onLogin(user);
    }
  };

  const roleConfig = {
    teacher: { icon: BookOpen, color: 'bg-blue-600', description: 'Create assignments and grade submissions' },
    student: { icon: GraduationCap, color: 'bg-green-600', description: 'Submit assignments and view grades' },
    parent: { icon: Heart, color: 'bg-orange-600', description: 'Monitor your child\'s progress' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Tracker</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Your Role
            </label>
            {Object.entries(roleConfig).map(([role, config]) => {
              const IconComponent = config.icon;
              return (
                <div
                  key={role}
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedRole(role as 'teacher' | 'student' | 'parent');
                    setSelectedUser('');
                  }}
                >
                  <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center mr-3`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 capitalize">{role}</h3>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => {}}
                    className="absolute opacity-0 inset-0 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* User Selection */}
          {filteredUsers.length > 0 && (
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2">
                Select Account
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose an account...</option>
                {filteredUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.class ? `(${user.class})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedUser}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">Demo Accounts Available</p>
            <div className="flex justify-center space-x-4 text-xs">
              <span className="flex items-center"><Users className="w-3 h-3 mr-1" />3 Teachers</span>
              <span className="flex items-center"><GraduationCap className="w-3 h-3 mr-1" />3 Students</span>
              <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />3 Parents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;