import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import SideBar from '../components/Sidebar';
import { fetchTasks } from '../service/taskService';
import { Priority, PriorityColors } from '../utils/Priority';
import { formatDate, formatDateForInput } from '../utils/dateUtils';

const Calendar = ({ onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      document.title = 'Calendar';
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
        console.log(fetchedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const adjustForTimezone = (date) => {
    if (!date) return null;
    const d = new Date(date);
    // Add timezone offset instead of subtracting
    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const formattedDate = formatDateForInput(currentDateObj);
        const dayTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const adjustedDueDate = adjustForTimezone(task.due_date);
            const taskDate = formatDateForInput(adjustedDueDate);
            return taskDate === formattedDate;
        });
        
        days.push(
            <div key={day} className="h-24 border border-gray-200 p-1 overflow-hidden">
                <div className="flex justify-between items-start">
                    <span className="font-medium">{day}</span>
                </div>
                <div className="mt-1">
                    {dayTasks.map(task => (
                        <div
                            key={task.taskId}
                            style={{
                            backgroundColor: `${PriorityColors[task.priority]}20`,
                            color: PriorityColors[task.priority]
                            }}
                            className="text-xs mb-1 p-1 rounded truncate"
                        >
                            {task.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
            <SideBar 
                onLogout={onLogout}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
        <div className="flex-1 h-screen overflow-auto">
            <div className="mt-8 ml-8 p-2">
                <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-4xl p-4 border rounded-lg shadow-sm bg-white">
                    <div className="pb-4 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-blue-500 ">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronLeft />
                                </button>
                                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-0 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-medium p-2">
                                {day}
                            </div>
                        ))}
                        </div>
                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-0">
                            {generateCalendarDays()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Calendar;