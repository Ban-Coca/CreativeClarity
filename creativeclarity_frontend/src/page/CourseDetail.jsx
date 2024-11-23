import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Snackbar, Alert, Tabs, Tab, Box, Typography } from '@mui/material';
import ArchivePage from './Archive';
import Grades from './Grades';
import Gallery from './Gallery';

function CourseDetail({ onLogout }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.split('/').pop() || 'notes');

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

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/course/${courseId}`);
        if (response.ok) {
          const course = await response.json();
          setCourseName(course.courseName);
          setCourseCode(course.code);
        } else {
          showSnackbar('Failed to load course details.', 'error');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        showSnackbar('An error occurred while loading course details.', 'error');
      }
    };

    fetchCourseDetails();
  }, [courseId]);

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
          {activeTab === 'notes' && <Typography>Notes Content</Typography>}
          {activeTab === 'archive' && <ArchivePage />}
          {activeTab === 'grades' && <Grades courseId={courseId} />}
          {activeTab === 'gallery' && <Gallery courseId={courseId} />}
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
