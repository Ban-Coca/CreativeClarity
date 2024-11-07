import SideBar from '../components/SideBar';
import Frame from '../components/Frame';
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import '../components/css/Course.css';
import { ArrowBack } from '@mui/icons-material'; // Add this import

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [gradeDetails, setGradeDetails] = useState({
    score: '',
    overall: '',
    dateRecorded: ''
  });
  const [totalScore, setTotalScore] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(null); // Add this line

  axios.defaults.baseURL = 'http://localhost:8080';

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/course/getallcourse');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showSnackbar('Failed to fetch courses', 'error');
    }
  };

  const fetchGrades = async (courseId) => {
    try {
        const response = await axios.get(`/api/grade/getallgradesbycourse`, {
            params: { courseId }
        });
        setGrades(response.data);
        const total = response.data.reduce((sum, grade) => sum + grade.score, 0);
        setTotalScore(total);
    } catch (error) {
        console.error('Error fetching grades:', error);
        showSnackbar('Failed to fetch grades', 'error');
    }
};

  // Update the handleOpen function to properly set course details
  const handleOpen = (course) => {
    if (course) {
      setCourseDetails({
        courseId: course.courseId,
        courseName: course.courseName,
        subject: course.subject,
        startDate: course.startDate?.split('T')[0] || '',
        endDate: course.endDate?.split('T')[0] || ''
      });
      setSelectedCourse(course.courseId);
      fetchGrades(course.courseId);
    } else {
      const currentDate = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
      setCourseDetails({
        courseName: '',
        subject: '',
        startDate: currentDate,  // Set today's date as default
        endDate: ''
      });
      setSelectedCourse(null);
    }
    setModalOpen(true);
  };
  
  const handleClose = () => {
    setModalOpen(false);
    setSelectedCourse(null);
    setCourseDetails({
      courseName: '',
      subject: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGradeDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedCourse) {
        const updateData = {
          courseId: selectedCourse,
          courseName: courseDetails.courseName,
          subject: courseDetails.subject,
          startDate: courseDetails.startDate,
          endDate: courseDetails.endDate
        };
        
        await axios.put(`/api/course/putcoursedetails/${selectedCourse}`, updateData);
        showSnackbar('Course updated successfully');
      } else {
        await axios.post('/api/course/postcourserecord', courseDetails);
        showSnackbar('Course created successfully');
      }
      await fetchCourses();
      handleClose();
    } catch (error) {
      console.error('Error saving course:', error);
      const errorMessage = error.response?.data || error.message || 'An unknown error occurred';
      showSnackbar(`Failed to save course: ${errorMessage}`, 'error');
    }
  };

  const handleGradeSubmit = async () => {
    try {
      const gradeData = {
        courseId: selectedCourse,
        score: gradeDetails.score,
        overall: gradeDetails.overall,
        dateRecorded: gradeDetails.dateRecorded
      };
      if (selectedGrade) {
        await axios.put(`/api/grade/putgradedetails?gradeId=${selectedGrade}`, gradeData);
        showSnackbar('Grade updated successfully');
      } else {
        await axios.post('/api/grade/postgraderecord', gradeData);
        showSnackbar('Grade added successfully');
      }
      fetchGrades(selectedCourse);
      setGradeModalOpen(false);
      setSelectedGrade(null); // Reset selected grade
    } catch (error) {
      console.error('Error saving grade:', error);
      const errorMessage = error.response?.data || error.message || 'An unknown error occurred';
      showSnackbar(`Failed to save grade: ${errorMessage}`, 'error');
    }
  };

  const handleGradeEdit = (grade) => {
    setGradeDetails({
      score: grade.score,
      overall: grade.overall,
      dateRecorded: grade.dateRecorded.split('T')[0]
    });
    setSelectedGrade(grade.gradeId);
    setGradeModalOpen(true);
  };

  const handleGradeDelete = async (gradeId) => {
    try {
      await axios.delete(`/api/grade/deletegradedetails/${gradeId}`);
      showSnackbar('Grade deleted successfully');
      fetchGrades(selectedCourse);
    } catch (error) {
      console.error('Error deleting grade:', error);
      showSnackbar(`Failed to delete grade: ${error.response?.data || error.message}`, 'error');
    }
  };

  const handleDeleteConfirmation = (courseId) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) {
      showSnackbar('Invalid course ID', 'error');
      return;
    }
  
    try {
      await axios.delete(`/api/course/deletecoursedetails/${courseToDelete}`);
      await fetchCourses(); // Refresh the list after deletion
      showSnackbar('Course deleted successfully');
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      showSnackbar(`Failed to delete course: ${error.response?.data || error.message}`, 'error');
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1 }}>
        <Frame />
        <main className="main-content">
          <div className="title-container">
            <Button
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <h2>Courses</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen(null)}
            >
              Add Course
            </Button>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.courseId} className="course-card">
                <h3>{course.courseName}</h3>
                <p>{course.subject}</p>
                <p>
                  {new Date(course.startDate).toLocaleDateString()} -{' '}
                  {new Date(course.endDate).toLocaleDateString()}
                </p>
                <p>Total Score: {grades.filter(grade => grade.courseId === course.courseId).reduce((sum, grade) => sum + grade.score, 0)}</p>
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setSelectedCourse(course.courseId);
                      setGradeModalOpen(true);
                    }}
                  >
                    Add Grade
                  </Button>
                </Box>
                <div className="grade-list">
                  {grades.filter(grade => grade.courseId === course.courseId).map((grade) => (
                    <div key={grade.gradeId} className="grade-item">
                      <p>Score: {grade.score}</p>
                      <p>Overall: {grade.overall}</p>
                      <p>Date Recorded: {new Date(grade.dateRecorded).toLocaleDateString()}</p>
                      <Button variant="outlined" color="primary" onClick={() => handleGradeEdit(grade)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleGradeDelete(grade.gradeId)}>Delete</Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

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

          <Dialog
            open={gradeModalOpen}
            onClose={() => setGradeModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>{selectedGrade ? 'Edit Grade' : 'Add Grade'}</DialogTitle>
            <DialogContent>
              <TextField
                name="score"
                label="Score"
                value={gradeDetails.score}
                onChange={handleGradeChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="overall"
                label="Overall"
                value={gradeDetails.overall}
                onChange={handleGradeChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="dateRecorded"
                label="Date Recorded"
                type="date"
                value={gradeDetails.dateRecorded}
                onChange={handleGradeChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                required
              />
              <p>Total Score: {totalScore}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setGradeModalOpen(false)} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleGradeSubmit} 
                color="primary" 
                variant="contained"
              >
                {selectedGrade ? 'Update Grade' : 'Add Grade'}
              </Button>
            </DialogActions>
          </Dialog>

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

          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={3000}
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