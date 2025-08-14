import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart3, Upload, Download, Star, Award, GraduationCap } from 'lucide-react';
import LoginForm from './components/LoginForm';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import { User, Assignment, Submission } from './types';
import { initializeData, getCurrentUser, setCurrentUser } from './utils/storage';

function App() {
  const [currentUser, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize predefined data on first load
    initializeData();
    
    // Check for existing session
    const user = getCurrentUser();
    setUser(user);
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading Academic Tracker...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'teacher':
        return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
      case 'student':
        return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
      case 'parent':
        return <ParentDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
}

export default App;