import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, CircularProgress } from '@mui/material';
import SideBar from '../components/Sidebar';

function ArchivePage({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('archive');
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const menuRef = useRef(null);

  const [archiveToDelete, setArchiveToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [archiveToUnarchive, setArchiveToUnarchive] = useState(null);
  const [isUnarchiveModalOpen, setIsUnarchiveModalOpen] = useState(false);


  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleUnarchiveModal = () => setIsUnarchiveModalOpen(!isUnarchiveModalOpen);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Function to filter archives based on type and search query
  const filterArchives = () => {
    let filtered = archives;

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter((archive) => archive.type === selectedType);
    }

    // Apply search filter based on title
    if (searchQuery) {
      filtered = filtered.filter((archive) =>
        archive.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArchives(filtered);
  };

  // Function to fetch archives
  const fetchArchives = async () => {
    setLoading(true); // Start loading
    try {
      // Simulate a longer delay before making the actual API request (e.g., 3 seconds)
      setTimeout(async () => {
        const response = await axios.get('http://localhost:8080/api/archive/getbycourseid/' + courseId, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setArchives(response.data);
        filterArchives(); // Filter archives after fetching data
        setLoading(false); // Stop loading after receiving the data
        toast.success("Fetched Archives Successfully!");
      }, 1500);
    } catch (error) {
      console.error('Error fetching archives:', error);
      toast.error("Failed to fetch archives");
      setLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    fetchArchives(); // Fetch archives initially
  }, [selectedType]); // Refetch archives when the selectedType changes

  useEffect(() => {
    filterArchives(); // Apply filtering when searchQuery changes
  }, [searchQuery, archives, selectedType]); // Reapply filtering when searchQuery or archives change

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/archive/${archiveToDelete.archiveId}`);
      fetchArchives(); // Refresh the list
      toast.success("Archive deleted successfully");
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      toast.error("Error occurred while deleting archive");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleUnarchive = async (archiveId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/archive/unarchive/${archiveId}`
      );
  
      if (response.status === 200) {
        toast.success("Archive unarchived successfully");
        fetchArchives(); // Fetch updated archives after unarchiving
      } else {
        toast.error("Failed to unarchive archive");
      }
    } catch (error) {
      console.error("Error unarchiving archive:", error);
      toast.error("Error occurred while unarchiving archive");
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

  const openArchiveDetailsModal = (archive) => {
    setSelectedArchive(archive);
    setArchiveToDelete(null); // Reset when viewing details
  };

  const closeArchiveDetailsModal = () => {
    setSelectedArchive(null);
    setArchiveToDelete(null); // Reset when closing modal
  };

  const handleMenuUnarchive = (archive) => {
    confirmUnarchive(archive); // Open modal instead of API call
    setOpenMenuId(null); // Close the menu
  };

  const handleModalUnarchive = (archiveId) => {
    handleUnarchive(archiveId);
    closeArchiveDetailsModal();
  }

  const confirmUnarchive = (archive) => {
    setArchiveToUnarchive(archive);
    setIsUnarchiveModalOpen(true); // Ensure modal opens
  };

  const handleConfirmUnarchive = async () => {
    if (archiveToUnarchive) {
      await handleUnarchive(archiveToUnarchive.archiveId);
      setArchiveToUnarchive(null); // Clear state after action
      setIsUnarchiveModalOpen(false); // Close modal
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <SideBar
            onLogout={onLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />
      </div>
      <main className="flex-1 p-2.5 overflow-auto">
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <label className="text-gray-700 mr-3" htmlFor="type-filter">
                Filter by:
              </label>
              <select
                id="type-filter"
                className="border px-3 py-2 rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Course">Courses</option>
                <option value="Task">Tasks</option>
                <option value="Note">Notes</option>
              </select>
            </div>
            <input
              type="text"
              className="border px-3 py-2 rounded-md"
              placeholder="Search archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center">
                <CircularProgress size={50} color="primary" sx={{ marginTop: '40px' }} />
                <p className="text-center text-gray-500 mb-5 mt-2">Loading archives...</p>
              </div>
            ) : filteredArchives.length > 0 ? (
              filteredArchives.map((archive) => (
                <div key={archive.archiveId} className="bg-white border rounded-lg p-7 flex justify-between items-center">
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
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border" ref={menuRef}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setArchiveToDelete(archive);
                            toggleDeleteModal();
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => confirmUnarchive(archive)}
                        >
                          Unarchive
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mb-10 mt-10">No archives available.</p>
            )}
          </div>
        </section>

        {/* Archive Details Modal */}
        {selectedArchive && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeArchiveDetailsModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">{selectedArchive.title}</h3>
                <p className="text-sm text-gray-500">
                  Type: <span className="font-medium">{selectedArchive.type}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Archived on: <span className="font-medium">{formatDate(selectedArchive.archive_date)}</span>
                </p>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">{selectedArchive.description}</p>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => confirmUnarchive(selectedArchive)}
                >
                  Unarchive
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 transition"
                  onClick={closeArchiveDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isUnarchiveModalOpen && archiveToUnarchive && (
          <Dialog
            open={isUnarchiveModalOpen}
            onClose={() => setIsUnarchiveModalOpen(false)}
            aria-labelledby="unarchive-dialog-title"
            aria-describedby="unarchive-dialog-description"
          >
            <DialogTitle id="unarchive-dialog-title">Confirm Unarchive</DialogTitle>
            <DialogContent>
              <Typography id="unarchive-dialog-description" variant="body1">
                Are you sure you want to unarchive this item?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setIsUnarchiveModalOpen(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUnarchive}
                color="primary"
                variant="contained"
              >
                Unarchive
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && archiveToDelete && (
          <Dialog
            open={isDeleteModalOpen}
            onClose={toggleDeleteModal}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Are you sure you want to delete this archive?</DialogTitle>
            <DialogActions>
              <Button
                onClick={handleDelete}
                color="error"
                variant="contained"
              >
                Yes
              </Button>
              <Button
                onClick={toggleDeleteModal}
                color="default"
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </main>
      <Toaster richColors position="bottom-right" closeButton/>
    </div>
  );
}

export default ArchivePage;