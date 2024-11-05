import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import '../Components/css/Archive.css';
import Frame from '../Components/TopBar';

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [archives, setArchives] = useState([]);
  const [newArchive, setNewArchive] = useState({
    archiveId: null,
    title: '',
    description: '',
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [archiveToUpdate, setArchiveToUpdate] = useState(null);
  const [archiveToDelete, setArchiveToDelete] = useState(null);
  const menuRef = useRef(null);
  
  const updateModalRef = useRef(null);

  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArchive({ ...newArchive, [name]: value });
  };

  // Fetch archives
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/archives/getallarchives');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setArchives(data);
      } catch (error) {
        console.error('Error fetching archives:', error);
      }
    };

    fetchArchives();
  }, []);

  // Function to update an archive
  const handleUpdate = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8080/api/archives/putarchivedetails/${archiveToUpdate}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArchive)
      });
      if (response.ok) {
        const updatedArchive = await response.json();
        setArchives((prevArchives) => 
          prevArchives.map(a => a.archiveId === updatedArchive.archiveId ? updatedArchive : a)
        );
        toggleUpdateModal(); // Close the update modal
        resetNewArchive();
      } else {
        console.error('Failed to update the archive');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Open the update modal
  const openEditModal = (archive) => {
    setNewArchive({ ...archive });
    setIsUpdateModalOpen(true); // Open update modal only here
    setOpenMenuId(null); // Close the menu
  };

  // Delete function
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/archives/deletearchivedetails/${archiveToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setArchives((prevArchives) => 
          prevArchives.filter(a => a.archiveId !== archiveToDelete)
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
        <section className="archives-section">
          <div className="section-header">
            <h2 className="section-title">Archives</h2>
          </div>
          <div className="archive-list">
            {archives.length > 0 ? (
              archives.map((archive) => (
                <div key={archive.archiveId} className="archive-card">
                  <div className="archive-content">
                    <div className="archive-info">
                      <h3>{archive.title}</h3>
                      <p>{archive.description}</p>
                    </div>
                  </div>
                  <button className="menu-button" onClick={() => toggleMenu(archive.archiveId)}>⋮</button>
                  {openMenuId === archive.archiveId && (
                    <div className="dropdown-menu" ref={menuRef}>
                      <button onClick={() => {
                        setArchiveToDelete(archive.archiveId);
                        toggleDeleteModal();
                      }}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No archives available.</p>
            )}
          </div>
        </section>
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Delete Archive</h2>
              <p>Are you sure you want to delete this archive?</p>
              <button className="confirm-delete-button" onClick={handleDelete}>Delete</button>
              <button className="cancel-button" onClick={toggleDeleteModal}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArchivePage;