import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, User, LogOut, FileText, Bell, Clock, X } from 'lucide-react';


const DashboardPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/user-profile') return 'profile';
    if (location.pathname === '/calendar') return 'calendar';
    if (location.pathname === '/tasks') return 'tasks';
    if (location.pathname === '/notes') return 'notes';
    return 'overview';
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'overview':
        navigate('/dashboard');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'tasks':
        navigate('/tasks');
        break;
      case 'notes':
        navigate('/notes');
        break;
      case 'profile':
        navigate('/user-profile');
        break;
      default:
        break;
    }
  };

  const handleProfileImageUpdate = async (imageUrl) => {
    setIsUpdatingImage(true);
    setImageError('');

    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : {};

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:8080/api/user/update-profile?userId=${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...user,
          profilePicture: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }

      const updatedUser = await response.json();
      const finalUserData = {
        ...updatedUser,
        profilePicture: imageUrl || 'http://localhost:8080/uploads/default-profile.png'
      };

      localStorage.setItem('user', JSON.stringify(finalUserData));
    setShowImageModal(false);
  } catch (error) {
    console.error('Profile image update error:', error);
    setImageError(error.message || 'Failed to update profile picture');
  } finally {
    setIsUpdatingImage(false);
  }
};

  const ImageUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Profile Picture</h3>
          <button
            onClick={() => setShowImageModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {imageError && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {imageError}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleProfileImageUpdate('http://localhost:8080/uploads/default-profile.png')}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isUpdatingImage}
          >
            {isUpdatingImage ? 'Updating...' : 'Upload New Picture'}
          </button>
        </div>
      </div>
    </div>
  );

  // Sample data - in a real app, this would come from your backend
  const upcomingAssignments = [
    { id: 1, title: 'Research Paper', course: 'History 101', dueDate: '2024-11-10' },
    { id: 2, title: 'Math Problem Set', course: 'Calculus II', dueDate: '2024-11-12' },
    { id: 3, title: 'Lab Report', course: 'Physics 201', dueDate: '2024-11-15' }
  ];

  const courses = [
    { id: 1, name: 'History 101', progress: 75 },
    { id: 2, name: 'Calculus II', progress: 60 },
    { id: 3, name: 'Physics 201', progress: 85 }
  ];

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { firstName: 'Student' };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {showImageModal && <ImageUploadModal />}
      {/* Sidebar */}
      <div className="w-64 h-screen flex-shrink-0 bg-white shadow-lg fixed">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <img
                src="/src/assets/images/logoCreativeClarity.png"
                alt="Logo"
                className="h-12"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
                  CreativeClarity
                </h1>
              </div>
            </div>
            
            <nav className="space-y-2">
              {[
                { icon: BookOpen, label: 'Overview', value: 'overview' },
                { icon: Calendar, label: 'Calendar', value: 'calendar' },
                { icon: CheckSquare, label: 'Tasks', value: 'tasks' },
                { icon: FileText, label: 'Notes', value: 'notes' },
                { icon: User, label: 'Profile', value: 'profile' }
              ].map(({ icon: Icon, label, value }) => (
                <button 
                  key={value}
                  onClick={() => handleTabChange(value)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === value 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <button 
            onClick={onLogout}
            className="mt-auto mb-6 mx-6 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
    <div className="h-full p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">Here&apos;s your academic overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow hover:shadow-md transition">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile Picture with Redirect to UserProfile */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 bg-white p-1 rounded-full shadow hover:shadow-md transition"
                  onClick={() => navigate('/user-profile')}
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden relative">
                    <img 
                      src={user.profilePicture || "/api/placeholder/32/32"} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        console.log('Attempted image URL:', user.profilePicture);
                        e.target.src = '/src/assets/images/default-profile.png';
                      }} 
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Assignments Card */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming Assignments
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingAssignments.map(assignment => (
                    <div 
                      key={assignment.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-blue-600">
                          Due: {assignment.dueDate}
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 transition">
                          <Clock className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 px-4 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-200">
                  View All Assignments
                </button>
              </div>
            </div>

            {/* Course Progress Card */}
            <div className="bg-white rounded-lg shadow-sm h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Course Progress
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {courses.map(course => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {course.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-2 px-4 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-200">
                  View All Courses
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="col-span-2 lg:col-span-3 bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200 flex flex-col items-center justify-center space-y-2">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Start Timer</span>
                </button>
                <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200 flex flex-col items-center justify-center space-y-2">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">New Study Session</span>
                </button>
                <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200 flex flex-col items-center justify-center space-y-2">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Set Reminder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardPage.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default DashboardPage;