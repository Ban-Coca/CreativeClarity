import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import SideBar from '../components/Sidebar'; // Import SideBar component

axios.defaults.baseURL = 'http://localhost:8080';

const Progress = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('progress');
  const [courses, setCourses] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesResponse = await axios.get('/api/course/getallcourse');
        console.log('Fetched courses data:', coursesResponse.data); // Debug log
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchInitialGrades = async () => {
      try {
        const initialGradesPromises = courses.map(course =>
          axios.get(`/api/grade/getallgradesbycourse/${course.courseId}`)
            .then(response => ({
              courseName: course.courseName,
              grade: calculateInitialGrade(response.data)
            }))
            .catch(error => {
              console.error(`Error fetching grades for course ${course.courseId}:`, error);
              return { courseName: course.courseName, grade: null }; // Return null for failed requests
            })
        );
        const initialGrades = await Promise.all(initialGradesPromises);
        const chartDataWithColors = initialGrades.map(({ courseName, grade }) => ({
          courseName,
          value: grade,
          color: getColorForGrade(grade)
        }));
        console.log('Initial Grades:', initialGrades); // Debug log
        setChartData(chartDataWithColors);
      } catch (error) {
        console.error('Error fetching initial grades:', error);
      }
    };

    if (courses.length > 0) {
      fetchInitialGrades();
    }
  }, [courses]);

  const calculateInitialGrade = (grades) => {
    if (grades.length === 0) return 0;
    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalPoints = grades.reduce((sum, grade) => sum + grade.total_points, 0);
    console.log('Total Score:', totalScore); // Debug log
    console.log('Total Points:', totalPoints); // Debug log
    const grade = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    console.log('Calculated Grade:', grade); // Debug log
    return grade;
  };

  const getColorForGrade = (grade) => {
    if (grade >= 70) return 'green';
    if (grade >= 30) return 'orange';
    return 'red';
  };

  console.log('Courses:', courses.map(course => course.courseName)); // Debug log
  console.log('Chart Data:', chartData); // Debug log

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideBar onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '260px', mt: 2 , mr: 2}}>
        <Typography variant="h4" gutterBottom sx={{ mb: 10, fontWeight: 'bold' }}>
          Courses Analytics
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            All Courses Grades Progress
          </Typography>
          <BarChart
            series={[{ data: chartData.map(data => data.value), color: chartData.map(data => data.color) }]}
            height={290}
            xAxis={[{ data: chartData.map(data => data.courseName), scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Progress;
