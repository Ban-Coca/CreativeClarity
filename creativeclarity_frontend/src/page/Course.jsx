import SideBar from '../components/SideBar';
import Frame from '../components/Frame';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import '../components/css/Course.css';

function Course() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [courseDetails, setCourseDetails] = useState({
    courseName: '',
    subject: '',
    startDate: '',
    endDate: '',
  });

  // For delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Configure axios
  axios.defaults.baseURL = 'http://localhost:8080';

  // Add request interceptor for debugging
  axios.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
  });

  // Add response interceptor for debugging
  axios.interceptors.response.use(
    response => {
      console.log('Response:', response);
      return response;
    },
    error => {
      console.log('Response Error:', error);
      return Promise.reject(error);
    }
  );

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/course/getallcourse');
      console.log('Fetched courses:', response.data);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showSnackbar('Failed to fetch courses', 'error');
    }
  };

  // Open modal
  const handleOpen = (course) => {
    setSelectedCourse(course);
    if (course) {
      const formattedCourse = {
        ...course,
        startDate: course.startDate?.split('T')[0] || '',
        endDate: course.endDate?.split('T')[0] || ''
      };
      setCourseDetails(formattedCourse);
    } else {
      setCourseDetails({ courseName: '', subject: '', startDate: '', endDate: '' });
    }
    setModalOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setModalOpen(false);
    setSelectedCourse(null);
    setCourseDetails({ courseName: '', subject: '', startDate: '', endDate: '' });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      let response;
      if (selectedCourse) {
        // Update course
        response = await axios.put(`/api/course/putcoursedetails`, {
          ...courseDetails,
          courseId: selectedCourse.courseId
        });
        showSnackbar('Course updated successfully');
      } else {
        // Create new course
        response = await axios.post('/api/course/postcourserecord', courseDetails);
        showSnackbar('Course created successfully');
      }
      await fetchCourses();
      handleClose();
    } catch (error) {
      console.error('Error saving course:', error);
      showSnackbar('Failed to save course', 'error');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (courseId) => {
    setSelectedCourse(courseId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    try {
      if (!selectedCourse) {
        console.error('No courseId selected for deletion');
        showSnackbar('Invalid course ID', 'error');
        return;
      }
  
      const response = await axios.delete(`/api/course/deletecourse/${selectedCourse}`);
  
      if (response.status === 200) {
        console.log('Course deleted successfully');
        setCourses(prevCourses => prevCourses.filter(course => course.courseId !== selectedCourse));
        showSnackbar('Course deleted successfully');
      }
      setDeleteDialogOpen(false);  // Close the delete confirmation dialog after deletion
    } catch (error) {
      console.error('Error deleting course:', error);
      showSnackbar(`Failed to delete course: ${error.message || error}`, 'error');
      setDeleteDialogOpen(false);  // Close the dialog if error occurs
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1 }}>
        <Frame />
        <main className="main-content">
          {/* Title and Add Button */}
          <div className="title-container">
            <h2>Courses</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen(null)}
            >
              Add Course
            </Button>
          </div>

          {/* Course Grid */}
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.courseId} className="course-card">
                <h3>{course.courseName}</h3>
                <p>{course.subject}</p>
                <p>
                  {new Date(course.startDate).toLocaleDateString()} -{' '}
                  {new Date(course.endDate).toLocaleDateString()}
                </p>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => handleOpen(course)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDeleteConfirmation(course.courseId)}
                  >
                    Delete
                  </Button>
                </Box>
              </div>
            ))}
          </div>

          {/* Add/Edit Course Dialog */}
          <Dialog 
            open={modalOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {selectedCourse ? 'Edit Course' : 'Add Course'}
            </DialogTitle>
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
                name="subject"
                label="Subject"
                value={courseDetails.subject}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                value={courseDetails.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="endDate"
                label="End Date"
                type="date"
                value={courseDetails.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                color="primary" 
                variant="contained"
              >
                {selectedCourse ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog 
            open={deleteDialogOpen}
            onClose={handleCancelDelete}
          >
            <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={3000} // Set to 3 seconds (3000 milliseconds)
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
        </main>
      </Box>
    </Box>
  );
}

export default Course;
