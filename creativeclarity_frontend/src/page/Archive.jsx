import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import '../Components/css/Archive.css';
import Frame from '../Components/Topbar';
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Snackbar, Alert } from '@mui/material';

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [archives, setArchives] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null); // Track open menu for archive cards
  const [archiveToDelete, setArchiveToDelete] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null); // Track selected archive for modal
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const menuRef = useRef(null);

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Show Snackbar function
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

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/archive/getallarchives');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setArchives(data);
      } catch (error) {
        console.error('Error fetching archives:', error);
        showSnackbar('Failed to fetch archives', 'error');
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/course/getallcourse');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        showSnackbar('Failed to fetch courses', 'error');
      }
    };

    fetchArchives();
    fetchCourses();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/archive/deletearchivedetails/${archiveToDelete}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        setArchives((prevArchives) =>
          prevArchives.filter((a) => a.archiveId !== archiveToDelete)
        );
        showSnackbar('Archive deleted successfully');
        toggleDeleteModal();
      } else {
        console.error('Failed to delete the archive');
        showSnackbar('Failed to delete archive', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Error occurred while deleting archive', 'error');
    }
  };

  const toggleMenu = (id) => {
      setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openArchiveDetailsModal = (archive) => setSelectedArchive(archive);
  const closeArchiveDetailsModal = () => setSelectedArchive(null);

  const filteredArchives = archives.filter((archive) =>
    selectedCourse ? archive.course_id === selectedCourse : true
  );

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-bar">
          <Frame />
        </header>
        <section className="archives-section">
          <div className="section-header">
            <ArrowBack />
            <h2 className="section-title">Archives</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="course-filter"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="archive-list">
            {filteredArchives.length > 0 ? (
              filteredArchives.map((archive) => (
                <div key={archive.archiveId} className="archive-card">
                  <div
                    className="archive-content"
                    onClick={() => openArchiveDetailsModal(archive)}
                  >
                    <div className="archive-info">
                      <h3>{archive.title}</h3>
                      <p>Archived: {formatDate(archive.archive_date)}</p>
                    </div>
                  </div>
                  <button
                    className="menu-button"
                    onClick={() => toggleMenu(archive.archiveId)} // Toggle menu for archive cards
                  >
                    ⋮
                  </button>
                  {openMenuId === archive.archiveId && !selectedArchive && ( // Only show menu if modal isn't open
                    <div className="dropdown-menu" ref={menuRef}>
                      <button
                        onClick={() => {
                          setArchiveToDelete(archive.archiveId);
                          toggleDeleteModal();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No archives available.</p>
            )}
          </div>
        </section>

        {/* Archive Details Modal */}
        {selectedArchive && (
          <div className="modal-overlay" onClick={closeArchiveDetailsModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className='modal-header'>
                <h2>{selectedArchive.title}</h2>
                <button
                  className="menu-button"
                  onClick={() => toggleMenu(selectedArchive.archiveId)} // Toggle menu for selected archive
                >
                  ⋮
                </button>
                {openMenuId === selectedArchive.archiveId && ( // Show menu for selected archive
                  <div className="selected-dropdown-menu" ref={menuRef}>
                    <button
                      onClick={() => {
                        setArchiveToDelete(selectedArchive.archiveId);
                        toggleDeleteModal();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className='modal-details'>
                <p className='modal-description'>{selectedArchive.description}</p>
                <p><strong>Type:</strong> {selectedArchive.type}</p>
                <p><strong>Tags:</strong> {selectedArchive.tags}</p>
                <p><strong>Archived:</strong> {formatDate(selectedArchive.archive_date)}</p>
              </div>
              <div className='modal-button'>
                <button className='restore-button'>
                  Restore
                </button>
                <button className="close-button" onClick={closeArchiveDetailsModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Delete Archive</h2>
              <p>Are you sure you want to delete this archive?</p>
              <button className="confirm-delete-button" onClick={handleDelete}>
                Delete
              </button>
              <button className="cancel-delete-button" onClick={toggleDeleteModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Snackbar (Toast) */}
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
};

export default ArchivePage;
