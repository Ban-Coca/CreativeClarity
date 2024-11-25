import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Clock, CheckSquare, Bell, User, LogOut, School, PanelsTopLeft, Archive} from 'lucide-react';

const SideBar = ( {onLogout, activeTab, setActiveTab}) => {
  //const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <img
            src="/src/assets/images/logoCreativeClarity.png"
            alt="Logo"
            className="h-12 mb-8"
            onClick={ () => navigate('/dashboard')}
          />
          
          <nav className="space-y-2">
            <button 
              onClick={() => {
                setActiveTab('overview')
                navigate('/dashboard')
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <PanelsTopLeft className="h-5 w-5" />
              <span>Overview</span>
            </button>

            <button 
              onClick={() =>{
                setActiveTab('courses')
                navigate('/courses')
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'courses' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </button>

            <button 
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </button>
            
            <button 
              onClick={() =>{
                setActiveTab('tasks')
                navigate('/tasks')
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              <span>Tasks</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('archive')
                navigate('/archive')
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'archive' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Archive className="h-5 w-5" />
              <span>Archive</span>
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </nav>
        </div>
        
        <button 
          onClick={onLogout}
          className="absolute bottom-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
  );
};

export default SideBar; 