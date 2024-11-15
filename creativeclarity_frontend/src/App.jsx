import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Course from './page/Course';
import Grades from './page/Grades';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'; // Add this line to set the base URL for axios

function App() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/course/getallcourse');
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<Course fetchCourses={fetchCourses} />} />
        <Route path="/grades/:courseId" element={<Grades fetchCourses={fetchCourses} />} />
      </Routes>
    </Router>
  );
}

export default App;