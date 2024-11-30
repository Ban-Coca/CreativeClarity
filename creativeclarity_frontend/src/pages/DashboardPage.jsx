import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, BookOpen, Clock, CheckSquare, Bell, User, LogOut, ChevronRight, ChevronLeft} from 'lucide-react';
import { toast } from 'sonner';
import SideBar from '../components/Sidebar';
import { formatDate } from '../utils/dateUtils';
import { fetchTasks } from '../service/taskService'; 
import { useNavigate } from 'react-router-dom';
const DashboardPage = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const getTasks = async () => {
    try{
      const data = await fetchTasks();
      setTasks(data);
      console.log(data)
      console.log(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } 
  }
  useEffect(() => {
    document.title = 'Home';
    console.log('User logged in', currentUser.userId);
    getTasks(); 
  }, []);
  const handleTaskClick = () => {
    navigate(`/tasks/`);
  };
  // Calculate pagination
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const courses = [
    { id: 1, name: 'History 101', progress: 75 },
    { id: 2, name: 'Calculus II', progress: 60 },
    { id: 3, name: 'Physics 201', progress: 85 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      <SideBar 
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.firstName} {currentUser.lastName}!</h1>
            <p className="text-gray-600">Here&apos;s your academic overview</p>
          </div>
          <button className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow hover:shadow-md transition">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Assignments Card */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between space-x-2">
                <div className='flex items-center space-x-2'>
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
                </div>
                

                <div className="flex justify-between items-center ">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-1 py-1 text-blue-600 mr-1 rounded-md disabled:opacity-50"
                  >
                    <ChevronLeft/>
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-1 py-1 text-blue-600 ml-1 rounded-md disabled:opacity-50"
                  >
                    <ChevronRight/>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 min-h-80">
              <div className="space-y-4">
                {currentTasks.map(assignment => (
                  <div 
                    key={assignment.taskId} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    onClick={handleTaskClick}
                    >
                    <div>
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course.courseName}</p>
                    </div>
                    <div className="text-sm text-blue-600">Due: {formatDate(assignment.due_date)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Progress Card */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{course.name}</span>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
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