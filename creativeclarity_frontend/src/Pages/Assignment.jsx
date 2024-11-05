import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import '../Components/css/Assignment.css';
import Frame from '../Components/TopBar';

const AssignmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    assignmentId: null,
    title: '',
    description: '',
    due_date: '',
    score: ''
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [assignmentToUpdate, setAssignmentsToUpdate] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const menuRef = useRef(null);
  const updateModalRef = useRef(null);

  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/assignments/getallassignments');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  // Function to update an assignment
  const handleUpdate = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8080/api/assignments/putassignmentdetails/${assignmentToUpdate}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment)
      });
      if (response.ok) {
        const updatedAssignment = await response.json();
        setAssignments((prevAssignments) => 
          prevAssignments.map(a => a.assignmentId === updatedAssignment.assignmentId ? updatedAssignment : a)
        );
        toggleUpdateModal(); // Close the update modal
        resetNewAssignment();
      } else {
        console.error('Failed to update the assignment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetNewAssignment = () => {
    setNewAssignment({ assignmentId: null, title: '', description: '', due_date: '', score: '' });
  };

  // Open the update modal
  const openEditModal = (assignment) => {
    setNewAssignment({ ...assignment });
    setIsUpdateModalOpen(true); // Open update modal only here
    setOpenMenuId(null); // Close the menu
  };

  // Delete function
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/assignments/deleteassignmentdetails/${assignmentToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAssignments((prevAssignments) => 
          prevAssignments.filter(a => a.assignmentId !== assignmentToDelete)
        );
        toggleDeleteModal();
      } else {
        console.error('Failed to delete the assignment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
      if (updateModalRef.current && !updateModalRef.current.contains(event.target)) setIsUpdateModalOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-bar">
          <Frame />
        </header>
        <section className="assignments-section">
          <div className="section-header">
            <h2 className="section-title">Assignments</h2>
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
                <div key={assignment.assignmentId} className="assignment-card">
                  <div className="assignment-content">
                    <div className="assignment-info">
                      <h3>{assignment.title}</h3>
                      <p>{assignment.description}</p>
                      <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
                    </div>
                    <span className="status-tag">Due Today</span>
                  </div>
                  <button className="menu-button" onClick={() => toggleMenu(assignment.assignmentId)}>⋮</button>
                  {openMenuId === assignment.assignmentId && (
                    <div className="dropdown-menu" ref={menuRef}>
                      <button onClick={() => {
                        setAssignmentsToUpdate(assignment.assignmentId);
                        openEditModal(assignment)}}>Edit</button>
                      <button onClick={() => {
                        setAssignmentToDelete(assignment.assignmentId);
                        toggleDeleteModal();
                      }}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No assignments available.</p>
            )}
          </div>
        </section>
        {isUpdateModalOpen && (
          <div className="modal-overlay">
            <div className="modal" ref={updateModalRef}>
              <h2>Edit Assignment</h2>
              <form onSubmit={handleUpdate}>
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
                  name="due_date"
                  value={newAssignment.due_date}
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
                <button type="submit" className='submit-button'>Update Assignment</button>
                <button type="button" onClick={toggleUpdateModal} className='close-button'>Cancel</button>
              </form>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this assignment?</p>
              <button onClick={handleDelete} className='confirm-delete-button'>Yes, Delete</button>
              <button onClick={toggleDeleteModal} className='close-button'>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignmentsPage;