import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Tag, Check, Book, FileText, ClipboardCheck, Heart } from 'lucide-react';
import { toast } from 'sonner'; // Assuming use of a toast library for notifications

const ReminderPage = () => {
  const navigate = useNavigate();
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderCategory, setReminderCategory] = useState('');
  const [reminderDateTime, setReminderDateTime] = useState('');
  // Memoized categories for performance optimization
  const categories = useMemo(() => [
    { name: 'Study', color: 'bg-blue-100', textColor: 'text-blue-600', icon: Book },
    { name: 'Assignment', color: 'bg-green-100', textColor: 'text-green-600', icon: FileText },
    { name: 'Exam', color: 'bg-red-100', textColor: 'text-red-600', icon: ClipboardCheck },
    { name: 'Personal', color: 'bg-purple-100', textColor: 'text-purple-600', icon: Heart },
    { name: 'Other', color: 'bg-gray-100', textColor: 'text-gray-600', icon: Tag }
  ], []);

  // Validation function
  const validateForm = useCallback(() => {
    
    if (!reminderTitle.trim()) {
      toast.error('Please enter a reminder title');
      return false;
    }
    // if (!reminderDate) {
    //   toast.error('Please select a date');
    //   return false;
    // }
    // if (!reminderTime) {
    //   toast.error('Please select a time');
    //   return false;
    // }
    if (!reminderDateTime) {
      toast.error('Please select a date and time');
      return false;
    }
    if (!reminderCategory) {
      toast.error('Please choose a category');
      return false;
    }
    return true;
  }, [reminderTitle, reminderDate, reminderTime, reminderCategory]);

  // Handle form submission with improved error handling
  const handleSubmit = useCallback(async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    
    if (!validateForm()) return;

    //const reminderDateTime = `${reminderDate}T${reminderTime}:00.000Z`;
    //const formattedDate = new Date(reminderDateTime).toLocaleString();
    //console.log('Reminder Date/Time:', formattedDate);
    // Example of a more robust reminder creation
    const newReminder = {
      title: reminderTitle.trim(),
      reminderDateTime: new Date(reminderDateTime).toISOString(),
      category: reminderCategory,
      createdAt: new Date().toISOString(),
      notified: false
    };
    console.log('New Reminder:', newReminder);
    try {
      // TODO: Replace with actual storage mechanism (e.g., localStorage, backend API)
      const response = await fetch('http://localhost:8080/api/reminder/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReminder)
      })
      if (!response.ok) {
        throw new Error('Failed to create reminder');
      }
      // Success notification
      toast.success('Reminder created successfully!', {
        description: `${newReminder.title} - ${newReminder.date} at ${newReminder.time}`
      });

      // Reset form and navigate
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create reminder', {
        description: 'Please try again'
      });
      console.error('Reminder creation error:', error);
    }
  }, [navigate, validateForm, reminderTitle, reminderDate, reminderTime, reminderCategory]);

  // Prevent past dates
  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800 mr-4 group"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-3 text-blue-600" />
            Create Reminder
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Reminder Title */}
          <div>
            <label htmlFor="reminderTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="reminderTitle"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                placeholder="Enter reminder title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                maxLength={100} // Prevent overly long titles
                required
              />
              <Tag className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* <div>
              <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="reminderDate"
                value={reminderDate}
                min={minDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                id="reminderTime"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div> */}
            <div>
              <label htmlFor="reminderDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                Date and Time
              </label>
              <input
                type="datetime-local"
                id="reminderDateTime"
                value={reminderDateTime}
                onChange={(e) => setReminderDateTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setReminderCategory(category.name)}
                    className={`
                      flex flex-col items-center justify-center 
                      py-3 rounded-lg transition duration-200 group
                      ${reminderCategory === category.name 
                        ? `${category.color} ${category.textColor} ring-2 ring-offset-2 ring-blue-500`
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                    `}
                    aria-selected={reminderCategory === category.name}
                  >
                    <div className={`
                      h-8 w-8 rounded-full ${category.color} 
                      flex items-center justify-center mb-1
                      group-hover:scale-110 transition
                    `}>
                      {reminderCategory === category.name ? (
                        <Check className={`h-4 w-4 ${category.textColor}`} />
                      ) : (
                        <CategoryIcon className={`h-4 w-4 ${category.textColor}`} />
                      )}
                    </div>
                    <span className="text-xs">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="
                w-full bg-blue-600 text-white py-3 rounded-lg 
                hover:bg-blue-700 transition duration-300 
                flex items-center justify-center space-x-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={!reminderTitle || !reminderDateTime || !reminderCategory}
            >
              <Bell className="h-5 w-5" />
              <span>Create Reminder</span>
            </button>
          </div>
        </form>
      </main>
       {/* Logo */}
       <div className="absolute bottom-6 right-6 flex items-center space-x-3">
        <img
          src="/src/assets/images/logoCreativeClarity.png"
          alt="Logo"
          className="h-10"
        />
      </div>
    </div>
  );
};

export default ReminderPage;
