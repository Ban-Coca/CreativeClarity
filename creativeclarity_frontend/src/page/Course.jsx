import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert, 
  Menu, 
  MenuItem, 
  IconButton,
  Select,
  FormControl,
  InputLabel 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import SideBar from '../components/Sidebar';
import '../components/css/Course.css';
import { ArrowBack } from '@mui/icons-material';
import Grades from './Grades'; // Import the Grades component
import { Link, useLocation } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080'; // Ensure this line is present to set the base URL for axios

function Course({onLogout}) {
  const [courses, setCourses] = useState([]); // Ensure initial state is an empty array
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [courseDetails, setCourseDetails] = useState({
    courseName: '',
    code: '',
    semester: '',
    academicYear: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [courseGridVisible, setCourseGridVisible] = useState(true); // New state for course grid visibility
  const location = useLocation();

  // Define semester options
  const semesterOptions = [
    { value: '1st Semester', label: '1st Semester', period:'August-December' },
    { value: '2nd Semester', label: '2nd Semester', period:'January-May' },
    { value: 'Summer', label: 'Summer', period:'June-July' }
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchCourses = useCallback(async () => {
    try {
      console.log('Fetching courses...');
      const response = await axios.get('/api/course/getallcourse');
      console.log('Courses fetched:', response.data);
      setCourses(Array.isArray(response.data) ? response.data : []); // Ensure response data is an array
      setCourseGridVisible(true); // Ensure course grid is visible after fetching courses
    } catch (error) {
      console.error('Error fetching courses:', error);
      showSnackbar('Failed to fetch courses', 'error');
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, location]);

  const handleOpen = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setCourseDetails({
        courseName: course.courseName,
        code: course.code,
        semester: course.semester,
        academicYear: course.academicYear,
      });
    } else {
      setSelectedCourse(null);
      setCourseDetails({
        courseName: '',
        code: '',
        semester: '',
        academicYear: '',
      });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedCourse(null);
    setCourseDetails({
      courseName: '',
      code: '',
      semester: '',
      academicYear: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { courseName, code, semester, academicYear } = courseDetails;
      const courseData = { courseName, code, semester, academicYear };

      if (selectedCourse) {
        // Update existing course
        await axios.put(`/api/course/putcoursedetails/${selectedCourse.courseId}`, courseData);
        showSnackbar('Course updated successfully');
      } else {
        // Create new course
        console.log(courseData);
        await axios.post('/api/course/postcourserecord', courseData);
        showSnackbar('Course created successfully');
      }

      console.log('Fetching courses after course submit');
      await fetchCourses(); // Fetch courses after creating or updating
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'An unknown error occurred';
      showSnackbar(`Failed to ${selectedCourse ? 'update' : 'create'} course: ${errorMessage}`, 'error');
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) {
      showSnackbar('Invalid course ID', 'error');
      return;
    }
    try {
      await axios.delete(`/api/course/deletecoursedetails/${courseToDelete}`);
      await fetchCourses();
      showSnackbar('Course deleted successfully');
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      showSnackbar(`Failed to delete course: ${error.response?.data || error.message}`, 'error');
      setDeleteDialogOpen(false);
    }
  };

  const handleMenuClick = (event, course) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditCourse = () => {
    handleOpen(selectedCourse);
    handleMenuClose();
  };

  const handleDeleteConfirmation = () => {
    setCourseToDelete(selectedCourse?.courseId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideBar
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '240px' }}>
        <Box sx={{ marginTop: '64px' }}>
          <div className="title-container">
            <h2>Courses</h2>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
              Add Course
            </Button>
          </div>

          {courseGridVisible && (
            <div className="course-grid">
              {courses.map((course) => (
                <div 
                  key={course.courseId}
                  className="course-card" 
                  style={{
                    position: 'relative',
                    height: '150px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    margin: '8px',
                  }}
                >
                  {/* Wrap most of the card content in Link, excluding the menu */}
                  <Link
                    to={`/course/${course.courseId}`}
                    style={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      display: 'block',
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                  >
                    {/* Course Details */}
                    <div className="course-content">
                      <h3>{course.courseName}</h3>
                      <p>{course.code}</p>
                      <p>{course.semester} - {course.academicYear}</p>
                      <p>{course.subject}</p>
                    </div>
                  </Link>

                  {/* Menu Icon outside of Link */}
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton 
                      onClick={(event) => handleMenuClick(event, course)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </div>
              ))}
            </div>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditCourse}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteConfirmation}>Delete</MenuItem>
        </Menu>

        <Dialog open={modalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add Course'}</DialogTitle>
          <DialogContent>
            <TextField 
              name="courseName" 
              label="Course Name" 
              value={courseDetails.courseName} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <TextField 
              name="code" 
              label="Course Code" 
              value={courseDetails.code} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                name="semester"
                value={courseDetails.semester}
                onChange={handleChange}
                label="Semester"
              >
                {semesterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Replaced TextField with Select for Academic Year */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="academic-year-label">Academic Year</InputLabel>
              <Select
                labelId="academic-year-label"
                name="academicYear"
                value={courseDetails.academicYear}
                onChange={handleChange}
                label="Academic Year"
              >
                {/* Only two academic year options available */}
                <MenuItem value="2024-2025">2024-2025</MenuItem>
                <MenuItem value="2025-2026">2025-2026</MenuItem>
                <MenuItem value="2026-2027">2026-2027</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              color="primary" 
              variant="contained"
            >
              {selectedCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this course?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteCourse} 
              sx={{ 
                backgroundColor: 'red', 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Course;