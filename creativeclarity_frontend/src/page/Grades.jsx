import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Paper, Typography, Grid, Container } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate, useBeforeUnload, useLocation } from 'react-router-dom';
import SideBar from '../components/Sidebar';// Import Frame component

axios.defaults.baseURL = 'http://localhost:8080'; // Add this line to set the base URL for axios

function Grades({onLogout}) {
  const location = useLocation();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('courses');
  const navigate = useNavigate();
  const [courses, SetCourses] = useState(location.state?.courses || []); // Add this line to initialize courses state
  const [grades, setGrades] = useState(() => {
    const savedGrades = localStorage.getItem('grades');
    return savedGrades ? JSON.parse(savedGrades) : [];
  });
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeDetails, setGradeDetails] = useState({
    score: '', 
    total_points: '',
    assessment_type: '',
    dateRecorded: '',
  });
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchCourses = async () => {
    if(!courses){
      try {
        console.log('Fetching courses');
        const response = await axios.get('/api/course/getallcourses', {
          headers: getHeaders()
        });
        console.log('Courses fetched:', response.data);
        SetCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        console.error('Error details:', error.response?.data || error.message);
        showSnackbar('Failed to fetch courses', 'error');
      }
    }
  }

  const fetchGrades = async () => {
    try {
      console.log(`Fetching grades for courseId: ${courseId}`);
      const response = await axios.get(`/api/grade/getallgradesbycourse/${courseId}`, {
        headers: getHeaders()
      });
      console.log('Grades fetched:', response.data);
      setGrades(response.data);
      localStorage.setItem('grades', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching grades:', error);
      console.error('Error details:', error.response?.data || error.message);
      showSnackbar('Failed to fetch grades', 'error');
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [courseId]);

  useEffect(() => {
    const saveGradesBeforeUnload = () => {
      localStorage.setItem('grades', JSON.stringify(grades));
    };

    window.addEventListener('beforeunload', saveGradesBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', saveGradesBeforeUnload);
    };
  }, [grades]);

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGradeDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeSubmit = async () => {
    try {
      // Validate required fields
      if (!gradeDetails.score || !gradeDetails.total_points || !gradeDetails.assessment_type || !gradeDetails.dateRecorded) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      const gradeData = {
        course: { courseId: parseInt(courseId) }, // Ensure courseId is included here
        score: parseFloat(gradeDetails.score), // Ensure score is a float
        total_points: parseFloat(gradeDetails.total_points), // Ensure total_points is a float
        dateRecorded: gradeDetails.dateRecorded,
        assessment_type: gradeDetails.assessment_type
      };
      console.log('Submitting grade data:', gradeData); // Add this line to log the grade data
      let response;
      if (selectedGrade) {
        response = await axios.put(`/api/grade/putgradedetails?gradeId=${selectedGrade}`, gradeData, {
          headers: getHeaders()
        });
        showSnackbar('Grade updated successfully');
      } else {
        response = await axios.post(`/api/grade/postgraderecord`, gradeData);
        showSnackbar('Grade added successfully');
      }
      setGrades(prev => {
        const updatedGrades = selectedGrade
          ? prev.map(grade => grade.gradeId === selectedGrade ? response.data : grade)
          : [...prev, response.data];
        localStorage.setItem('grades', JSON.stringify(updatedGrades));
        return updatedGrades;
      });
      console.log('Fetching courses after grade submit');
      await fetchCourses(); // Ensure fetchCourses is awaited
      setGradeModalOpen(false);
      setSelectedGrade(null);
      setGradeDetails({
        score: '', 
        total_points: '',
        assessment_type: '',
        dateRecorded: '',
      });
    } catch (error) {
      console.error('Error saving grade:', error);
      const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message || 'An unknown error occurred';
      showSnackbar(`Failed to save grade: ${errorMessage}`, 'error');
    }
  };

  const handleGradeEdit = (grade) => {
    setGradeDetails({
      score: grade.score,
      total_points: grade.total_points, // Changed totalPoints to total_points
      dateRecorded: grade.dateRecorded.split('T')[0],
      assessment_type: grade.assessment_type // Added assessment_type
    });
    setSelectedGrade(grade.gradeId);
    setGradeModalOpen(true);
  };

  const handleGradeDelete = async (gradeId) => {
    try {
      await axios.delete(`/api/grade/deletegradedetails/${gradeId}`, {
        headers: getHeaders()
      });
      showSnackbar('Grade deleted successfully');
      setGrades(prev => {
        const updatedGrades = prev.filter(grade => grade.gradeId !== gradeId);
        localStorage.setItem('grades', JSON.stringify(updatedGrades));
        return updatedGrades;
      });
      await fetchGrades(); // Ensure fetchGrades is awaited
      console.log('Fetching courses after grade delete');
      await fetchCourses(); // Ensure fetchCourses is awaited
    } catch (error) {
      console.error('Error deleting grade:', error);
      showSnackbar(`Failed to delete grade: ${error.response?.data || error.message}`, 'error');
    }
  };

  const handleNavigateBack = () => {
    localStorage.setItem('grades', JSON.stringify(grades));
    navigate('/courses');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideBar
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        />
        <Box sx={{ 
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
          overflowY: 'auto',
        }}>
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNavigateBack}
              >
                Back to Courses
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setGradeModalOpen(true)}
              >
                Add Grade
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Paper elevation={3} sx={{ padding: 2, maxHeight: '70vh', overflowY: 'auto', width: '350px' }}>
                <Typography variant="h5" gutterBottom>
                  Grade List
                </Typography>
                {grades.map((grade) => (
                  <Paper key={grade.gradeId} elevation={3} sx={{ padding: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Assessment Type: {grade.assessment_type}
                    </Typography>
                    <Typography variant="body1">
                      Score: {grade.score}
                    </Typography>
                    <Typography variant="body1">
                      Total Points: {grade.total_points}
                    </Typography>
                    <Typography variant="body1">
                      Date Recorded: {new Date(grade.dateRecorded).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleGradeEdit(grade)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleGradeDelete(grade.gradeId)}>Delete</Button>
                    </Box>
                  </Paper>
                ))}
              </Paper>
            </Box>

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
                  name="total_points"
                  label="Total Points"
                  value={gradeDetails.total_points} // Changed totalPoints to total_points
                  onChange={handleGradeChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  name="assessment_type"
                  label="Assessment Type"
                  value={gradeDetails.assessment_type}
                  onChange={handleGradeChange}
                  fullWidth
                  margin="normal"
                  required
                /> {/* Added assessment_type */}
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
          </Container>
        </Box>
    </Box>
  );
}

export default Grades;