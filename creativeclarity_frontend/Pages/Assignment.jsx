import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import '../Components/css/Assignment.css';
import Frame from '../Components/TopBar';

const AssignmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    score: ''
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null); // Ref to track the menu

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/assignments/getallassignments');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/assignments/postassignmentrecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAssignment)
      });
      if (response.ok) {
        const savedAssignment = await response.json();
        setAssignments((prevAssignments) => [...prevAssignments, savedAssignment]);
        toggleModal();
        setNewAssignment({ title: '', description: '', dueDate: '', score: '' });
      } else {
        console.error('Failed to save the assignment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <header className="top-bar">
          <Frame/>
        </header>

        <section className="assignments-section">
          <div className="section-header">
            <h2 className="section-title">Assignments</h2>
            <button className="new-assignment-button" onClick={toggleModal}>+ New Assignment</button>
          </div>

          <div className="filter-buttons">
            <button className="filter-button active">All</button>
            <button className="filter-button">Pending</button>
            <button className="filter-button">Completed</button>
            <button className="filter-button">Late</button>
          </div>

          <div className="assignment-list">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card">
                  <div className="assignment-content">
                    <div className="assignment-info">
                      <h3>{assignment.title}</h3>
                      <p>{assignment.description}</p>
                      <p><strong>Due Date:</strong> {assignment.dueDate}</p>
                    </div>
                    <span className="status-tag">Due Today</span>
                  </div>

                  {/* Menu Button */}
                  <button
                    className="menu-button"
                    onClick={() => toggleMenu(assignment.assignmentId)}
                  >
                    ⋮
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === assignment.assignmentId && (
                    <div className="dropdown-menu" ref={menuRef}>
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No assignments available.</p>
            )}
          </div>
        </section>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>New Assignment</h2>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Assignment Title"
                  value={newAssignment.title}
                  onChange={handleInputChange}
                  required
                />

                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Assignment Description"
                  value={newAssignment.description}
                  onChange={handleInputChange}
                  required
                ></textarea>

                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newAssignment.dueDate}
                  onChange={handleInputChange}
                  required
                />

                <label>Score</label>
                <input
                  type="number"
                  name="score"
                  placeholder="Score"
                  value={newAssignment.score}
                  onChange={handleInputChange}
                  required
                />

                <button type="submit" className="submit-button">Add Assignment</button>
                <button type="button" className="close-button" onClick={toggleModal}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignmentsPage;
