import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function Grades({ courseId }) {
  const [grades, setGrades] = useState([]);
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

  const fetchGrades = async () => {
    try {
      console.log(`Fetching grades for courseId: ${courseId}`);
      const response = await axios.get(`/api/grade/getallgradesbycourse/${courseId}`);
      console.log('Grades fetched:', response.data);
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      showSnackbar('Failed to fetch grades', 'error');
    }
  };

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
        course: { courseId }, // Ensure courseId is included here
        score: parseFloat(gradeDetails.score), // Ensure score is a float
        total_points: parseFloat(gradeDetails.total_points), // Ensure total_points is a float
        dateRecorded: gradeDetails.dateRecorded,
        assessment_type: gradeDetails.assessment_type
      };
      console.log('Submitting grade data:', gradeData); // Add this line to log the grade data
      if (selectedGrade) {
        await axios.put(`/api/grade/putgradedetails?gradeId=${selectedGrade}`, gradeData);
        showSnackbar('Grade updated successfully');
      } else {
        await axios.post(`/api/grade/postgraderecord`, gradeData);
        showSnackbar('Grade added successfully');
      }
      fetchGrades(); // Fetch grades without appending
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
      await axios.delete(`/api/grade/deletegradedetails/${gradeId}`);
      showSnackbar('Grade deleted successfully');
      fetchGrades();
    } catch (error) {
      console.error('Error deleting grade:', error);
      showSnackbar(`Failed to delete grade: ${error.response?.data || error.message}`, 'error');
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [courseId]);

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setGradeModalOpen(true)}
      >
        Add Grade
      </Button>
      <div className="grade-list">
        {grades.map((grade) => (
          <div key={grade.gradeId} className="grade-item">
            <p>Score: {grade.score}</p>
            <p>Total Points: {grade.total_points}</p> {/* Changed totalPoints to total_points */}
            <p>Assessment Type: {grade.assessment_type}</p> {/* Added assessment_type */}
            <p>Date Recorded: {new Date(grade.dateRecorded).toLocaleDateString()}</p>
            <Button variant="outlined" color="primary" onClick={() => handleGradeEdit(grade)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => handleGradeDelete(grade.gradeId)}>Delete</Button>
          </div>
        ))}
      </div>

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
    </div>
  );
}

export default Grades;