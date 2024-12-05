import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper, Typography, Container, Menu, MenuItem, IconButton, LinearProgress, Pagination, Select, FormControl, InputLabel, Checkbox } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../components/Sidebar'; // Import Frame component

axios.defaults.baseURL = 'http://localhost:8080'; // Add this line to set the base URL for axios

function Grades({ onLogout, onGradesChange }) {
  const location = useLocation();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, SetCourses] = useState(location.state?.courses || []); // Add this line to initialize courses state
  const [grades, setGrades] = useState(() => {
    const savedGrades = localStorage.getItem(`grades_${courseId}`);
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
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gradesPerPage = 5;
  const [sortOption, setSortOption] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [deleteSelectedConfirmationOpen, setDeleteSelectedConfirmationOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    toast(message, { type });
  };

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchCourses = async () => {
    const token = getAuthToken();
    if(!courses){
      try {
        console.log('Fetching courses');
        const response = await axios.get('/api/course/getallcourses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Courses fetched:', response.data);
        SetCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        console.error('Error details:', error.response?.data || error.message);
        showToast('Failed to fetch courses', 'error');
      }
    }
  };

  const fetchGrades = async () => {
    const token = getAuthToken();
    try {
      console.log(`Fetching grades for courseId: ${courseId}`);
      const response = await axios.get(`/api/grade/getallgradesbycourse/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Grades fetched:', response.data);
      setGrades(response.data);
      localStorage.setItem(`grades_${courseId}`, JSON.stringify(response.data)); // Save grades to local storage
    } catch (error) {
      console.error('Error fetching grades:', error);
      console.error('Error details:', error.response?.data || error.message);
      showToast('Failed to fetch grades', 'error');
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/course/${courseId}`, {
        headers: getHeaders(),
      });
      console.log('Course details fetched:', response.data);
      SetCourses([response.data]);
    } catch (error) {
      console.error('Error fetching course details:', error);
      showToast('Failed to fetch course details', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'grades') {
      fetchGrades();
    }
  }, [courseId, activeTab]);

  useEffect(() => {
    const saveGradesBeforeUnload = () => {
      localStorage.setItem(`grades_${courseId}`, JSON.stringify(grades));
    };

    window.addEventListener('beforeunload', saveGradesBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', saveGradesBeforeUnload);
    };
  }, [grades, courseId]);

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGradeDetails((prev) => {
      if (name === 'score' && parseFloat(value) > parseFloat(prev.total_points)) {
        showToast('Score cannot exceed total points', 'error');
        return prev;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleGradeSubmit = async () => {
    const token = getAuthToken();
    try {
      // Validate required fields
      if (!gradeDetails.score || !gradeDetails.total_points || !gradeDetails.assessment_type || !gradeDetails.dateRecorded) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // Validate score does not exceed total points
      if (parseFloat(gradeDetails.score) > parseFloat(gradeDetails.total_points)) {
        showToast('Score cannot exceed total points', 'error');
        return;
      }

      const gradeData = {
        course: { courseId: parseInt(courseId) }, // Ensure courseId is included here
        score: parseFloat(gradeDetails.score), // Ensure score is a float
        total_points: parseFloat(gradeDetails.total_points), // Ensure total_points is a float
        dateRecorded: gradeDetails.dateRecorded,
        assessment_type: gradeDetails.assessment_type,
      };
      console.log('Submitting grade data:', gradeData); // Add this line to log the grade data
      let response;
      if (selectedGrade) {
        response = await axios.put(`/api/grade/putgradedetails?gradeId=${selectedGrade}`, gradeData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        showToast('Grade updated successfully');
      } else {
        response = await axios.post(`/api/grade/postgraderecord`, gradeData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        showToast('Grade added successfully');
      }
      setGrades((prev) => {
        const updatedGrades = selectedGrade
          ? prev.map((grade) => (grade.gradeId === selectedGrade ? response.data : grade))
          : [...prev, response.data];
        localStorage.setItem(`grades_${courseId}`, JSON.stringify(updatedGrades)); // Save updated grades to local storage
        return updatedGrades;
      });
      await onGradesChange(); // Fetch grades after submit
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
      showToast(`Failed to save grade: ${errorMessage}`, 'error');
    }
  };

  const handleGradeEdit = (grade) => {
    setGradeDetails({
      score: grade.score,
      total_points: grade.total_points, // Changed totalPoints to total_points
      dateRecorded: grade.dateRecorded.split('T')[0],
      assessment_type: grade.assessment_type, // Added assessment_type
    });
    setSelectedGrade(grade.gradeId);
    setGradeModalOpen(true);
  };

  const handleGradeDelete = async (gradeId) => {
    const token = getAuthToken();
    try {
      await axios.delete(`/api/grade/deletegradedetails/${gradeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      showToast('Grade deleted successfully');
      setGrades((prev) => prev.filter((grade) => grade.gradeId !== gradeToDelete)); // Remove grade from local state
      localStorage.setItem(`grades_${courseId}`, JSON.stringify(grades.filter((grade) => grade.gradeId !== gradeToDelete))); // Update local storage
      setDeleteConfirmationOpen(false); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting grade:', error);
      showToast(`Failed to delete grade: ${error.response?.data || error.message}`, 'error');
    }
  };

  const handleDeleteSelectedGrades = async () => {
    try {
      await Promise.all(
        selectedGrades.map((gradeId) =>
          axios.delete(`/api/grade/deletegradedetails/${gradeId}`, {
            headers: getHeaders(),
          })
        )
      );
      showToast('Selected grades deleted successfully');
      setGrades((prev) => {
        const updatedGrades = prev.filter((grade) => !selectedGrades.includes(grade.gradeId));
        localStorage.setItem(`grades_${courseId}`, JSON.stringify(updatedGrades)); // Update local storage with courseId
        return updatedGrades;
      });
      setSelectedGrades([]);
      setDeleteSelectedConfirmationOpen(false); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting selected grades:', error);
      showToast(`Failed to delete selected grades: ${error.response?.data || error.message}`, 'error');
    }
  };

  const confirmDeleteSelectedGrades = () => {
    setDeleteSelectedConfirmationOpen(true);
  };

  const calculateInitialGrade = () => {
    if (grades.length === 0) return null;
    const totalScore = grades.reduce((acc, grade) => acc + grade.score, 0);
    const totalPoints = grades.reduce((acc, grade) => acc + grade.total_points, 0);
    return ((totalScore / totalPoints) * 100).toFixed(2);
  };

  const getProgressBarColor = (grade) => {
    return grade >= 60 ? 'success' : 'error'; // 60 is the passing grade
  };

  const getGradeStatusText = (grade) => {
    return grade >= 60 ? 'Passed' : 'Failed';
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleGradeSelect = (gradeId) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId]
    );
  };

  const sortedGrades = [...grades].sort((a, b) => {
    if (sortOption === 'ascending') {
      return a.score - b.score;
    } else if (sortOption === 'descending') {
      return b.score - a.score;
    } else if (sortOption === 'failing') {
      return (a.score / a.total_points) - (b.score / b.total_points);
    } else {
      return 0;
    }
  });

  const paginatedGrades = sortedGrades.slice((currentPage - 1) * gradesPerPage, currentPage * gradesPerPage);

  const isFailing = (score, totalPoints) => {
    return (score / totalPoints) < 0.6;
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <SideBar 
          onLogout={onLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab} /> {/* Add SideBar component */}
        <Box sx={{ 
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Button variant="contained" color="secondary" onClick={() => setGradeModalOpen(true)}>
              Add Grade
            </Button>
          </Box>
          <Box sx={{ display: 'flex', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, height: '60vh', width: '55%', backgroundColor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', textAlign: 'center' }}>
                  Grade List
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedGrades.length > 0 && (
                    <IconButton
                      aria-label="delete"
                      onClick={confirmDeleteSelectedGrades}
                      sx={{ color: '#f44336', mr: 2, mb: 2, transform: 'scale(1.2)' }} // Slightly bigger delete icon
                    >
                      <Delete />
                    </IconButton>
                  )}
                  <FormControl variant="outlined" sx={{ minWidth: 100, mb: 2 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortOption}
                      onChange={handleSortChange}
                      label="Sort By"
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="ascending">Ascending</MenuItem>
                      <MenuItem value="descending">Descending</MenuItem>
                      <MenuItem value="failing">Failing</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ overflowY: 'auto', height: 'calc(100% - 56px)' }}>
                {paginatedGrades.map((grade) => (
                  <Paper key={grade.gradeId} elevation={3} sx={{ padding: 1.7, mb: 2, backgroundColor: '#e3f2fd', position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedGrades.includes(grade.gradeId)}
                      onChange={() => handleGradeSelect(grade.gradeId)}
                      sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)' }}
                    />
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleGradeEdit(grade)}
                      sx={{ position: 'absolute', top: 8, right: 8, color: '#ff9800' }} // Custom color for the edit icon
                    >
                      <Edit />
                    </IconButton>
                    <Box sx={{ ml: 5, flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1e88e5', ml: 2}}>
                        Assessment Type: {grade.assessment_type}
                      </Typography>
                      <Typography variant="body1" sx={{ color: isFailing(grade.score, grade.total_points) ? 'red' : '#424242', ml: 2 }}>
                        Score: {grade.score}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#424242', ml: 2 }}>
                        Total Points: {grade.total_points}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#424242', ml: 2 }}>
                        Date Recorded: {new Date(grade.dateRecorded).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
              <Pagination
                count={Math.ceil(sortedGrades.length / gradesPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
              />
            </Paper>
            <Box sx={{ flexGrow: 1, ml: 5 }}>
              <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', textAlign: 'center' }}>
                  Initial Computed Grade
                </Typography>
                {calculateInitialGrade() !== null ? (
                  <>
                    <Typography variant="h6" sx={{ color: '#1e88e5', textAlign: 'center' }}>
                      {calculateInitialGrade()}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculateInitialGrade()}
                      color={getProgressBarColor(calculateInitialGrade())}
                      sx={{ height: 20, borderRadius: 5, mt: 2 }}
                    />
                    <Typography variant="h6" sx={{ color: getProgressBarColor(calculateInitialGrade()) === 'success' ? 'green' : 'red', textAlign: 'center', mt: 2 }}>
                      {getGradeStatusText(calculateInitialGrade())}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" sx={{ color: '#1e88e5', textAlign: 'center' }}>
                    No grades available
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>

          <Dialog open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} maxWidth="sm" fullWidth>
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
              />{' '}
              {/* Added assessment_type */}
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
              <Button onClick={handleGradeSubmit} color="primary" variant="contained">
                {selectedGrade ? 'Update Grade' : 'Add Grade'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this grade?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleGradeDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteSelectedConfirmationOpen} onClose={() => setDeleteSelectedConfirmationOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete the selected grades?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteSelectedConfirmationOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteSelectedGrades} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Container>
      </Box>
    </Box>
  );
}

export default Grades;