import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import '../Components/css/Archive.css';
import Frame from '../Components/TopBar';
import ArrowBack from "@mui/icons-material/ArrowBack";

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [archives, setArchives] = useState([]);
  const [courses, setCourses] = useState([]); // New state for course list
  const [selectedCourse, setSelectedCourse] = useState(''); // New state for selected course
  const [newArchive, setNewArchive] = useState({
    archiveId: null,
    title: '',
    description: '',
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [archiveToDelete, setArchiveToDelete] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const menuRef = useRef(null);

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Fetch archives and courses
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/archive/getallarchives');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setArchives(data);
      } catch (error) {
        console.error('Error fetching archives:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/course/getallcourses');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchArchives();
    fetchCourses();
  }, []);

  // Delete function
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
        toggleDeleteModal();
      } else {
        console.error('Failed to delete the archive');
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle opening archive details modal
  const openArchiveDetailsModal = (archive) => setSelectedArchive(archive);
  const closeArchiveDetailsModal = () => setSelectedArchive(null);

  // Filter archives by course
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
            <ArrowBack/>
            <h2 className="section-title">Archives</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="course-filter"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
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
                    onClick={() => toggleMenu(archive.archiveId)}
                  >
                    ⋮
                  </button>
                  {openMenuId === archive.archiveId && (
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
              </div>
              <div className='modal-details'>
                <p className='modal-description'>{selectedArchive.description}</p>
                <p><strong>Type:</strong> {selectedArchive.type}</p>
                <p><strong>Tags:</strong> {selectedArchive.tags}</p>
                <p><strong>Archived:</strong> {formatDate(selectedArchive.archive_date)}</p>
              </div>
              <button className="close-button" onClick={closeArchiveDetailsModal}>
                Close
              </button>
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
    </div>
  );
};

export default ArchivePage;
