import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Progress = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/grade/getallgrade')
      .then(response => {
        setGrades(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the grades!', error);
      });
  }, []);

  const data = {
    labels: grades.map((grade, index) => `Grade ${index + 1}`),
    datasets: [
      {
        label: 'Grades Progress',
        data: grades.map(grade => grade.gradeValue), // Assuming gradeValue is the field for grade
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Grades Progress</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default Progress;