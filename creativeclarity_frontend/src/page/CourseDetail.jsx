<<<<<<< Updated upstream
=======
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Snackbar, Alert, Tabs, Tab, Box, Typography } from '@mui/material';
import ArchivePage from './Archive';
import Grades from './Grades';
import Gallery from './Gallery';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
function CourseDetail({ onLogout }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const validTabs = ['notes', 'archive', 'grades', 'gallery'];
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tabFromPath = location.pathname.split('/').pop();
  const [activeTab, setActiveTab] = useState(validTabs.includes(tabFromPath) ? tabFromPath : 'notes');

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/course/${courseId}/${newValue}`);
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/course/${courseId}`);
      if (response.status !== 200) {
        showSnackbar('Failed to load course details.', 'error');
        return;
      }

      const course = response.data; // Directly parse the JSON response
      console.log(course);
      setCourseName(course.courseName);
      setCourseCode(course.code);
    } catch (error) {
      console.error('Error fetching course details:', error);
      showSnackbar('An error occurred while loading course details.', 'error');
    }
  };

  const fetchAllData = async () => {
    await fetchCourseDetails();
    // Add other fetch functions here if needed
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, activeTab, location.pathname]); // Fetch course details whenever courseId, activeTab, or pathname changes

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar onLogout={onLogout} activeTab="courses" setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {courseName || 'Loading...'}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {courseCode || 'Loading...'}
          </Typography>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ marginTop: '10px' }}
          >
            <Tab value="notes" label="Notes" />
            <Tab value="archive" label="Archive" />
            <Tab value="grades" label="Grades" />
            <Tab value="gallery" label="Gallery" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box mt={1.5}>
          {activeTab === 'archive' && <ArchivePage />}
          {activeTab === 'grades' && <Grades courseId={courseId} onLogout={onLogout} fetchAllData={fetchAllData} />} 
          {activeTab === 'gallery' && <Gallery />}
        </Box>
      </main>

      {/* Snackbar (Toast) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CourseDetail;
>>>>>>> Stashed changes
