import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Snackbar, Alert } from '@mui/material';

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [archives, setArchives] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [archiveToDelete, setArchiveToDelete] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
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
        const response = await axios.get('http://localhost:8080/api/archive/getallarchives');
        setArchives(response.data);
      } catch (error) {
        console.error('Error fetching archives:', error);
        showSnackbar('Failed to fetch archives', 'error');
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/course/getallcourse');
        setCourses(response.data);
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
      const response = await axios.delete(
        `http://localhost:8080/api/archive/deletearchivedetails/${archiveToDelete}`
      );
      if (response.status === 200) {
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>
      
      <main className="flex-1 p-6 overflow-auto">
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <ArrowBack className="cursor-pointer" />
            <h2 className="text-2xl font-semibold">Archives</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="ml-auto px-4 py-2 border rounded-md"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {filteredArchives.length > 0 ? (
              filteredArchives.map((archive) => (
                <div key={archive.archiveId} className="bg-white border rounded-lg p-4 flex justify-between items-center">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => openArchiveDetailsModal(archive)}
                  >
                    <h3 className="font-semibold">{archive.title}</h3>
                    <p className="text-gray-600">Archived: {formatDate(archive.archive_date)}</p>
                  </div>
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={() => toggleMenu(archive.archiveId)}
                    >
                      ⋮
                    </button>
                    {openMenuId === archive.archiveId && !selectedArchive && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border" ref={menuRef}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No archives available.</p>
            )}
          </div>
        </section>

        {/* Archive Details Modal */}
        {selectedArchive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeArchiveDetailsModal}>
            <div
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-between items-center mb-4'>
                <h2 className="text-2xl font-semibold">{selectedArchive.title}</h2>
                <div className="relative">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={() => toggleMenu(selectedArchive.archiveId)}
                  >
                    ⋮
                  </button>
                  {openMenuId === selectedArchive.archiveId && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border" ref={menuRef}>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
              </div>
              <div className='space-y-4'>
                <p className='text-gray-700'>{selectedArchive.description}</p>
                <p><strong>Type:</strong> {selectedArchive.type}</p>
                <p><strong>Tags:</strong> {selectedArchive.tags}</p>
                <p><strong>Archived:</strong> {formatDate(selectedArchive.archive_date)}</p>
              </div>
              <div className='flex justify-end gap-4 mt-6'>
                <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
                  Unarchive
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={closeArchiveDetailsModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">Delete Archive</h2>
              <p className="mb-6">Are you sure you want to delete this archive?</p>
              <div className="flex justify-end gap-4">
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={handleDelete}>
                  Delete
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={toggleDeleteModal}>
                  Cancel
                </button>
              </div>
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
