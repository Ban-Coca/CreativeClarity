import React, { useState, useRef } from "react";
import SideBar from "../components/Sidebar";
import { Snackbar, Alert, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Picture = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedMessage, setUploadedMessage] = useState("");
  const [media, setMedia] = useState([
    {
      type: 'image',
      media: 'base64StringHere',
      filename: 'dummy.jpg',
    },
    {
      type: 'video',
      media: 'base64VideoStringHere',
      filename: 'dummy.mp4',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [menuAnchor, setMenuAnchor] = useState(null); // State for menu anchor
  const [selectedMedia, setSelectedMedia] = useState(null); // Track selected media for delete

  const fileInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar("Please select a valid image file (PNG, JPEG, JPG, GIF).", 'error');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      handleUpload();
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", "My file caption");
    formData.append("userId", loggedInUserId); // Replace with the actual user ID
  
    try {
      const response = await fetch("http://localhost:8080/api/media/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const message = await response.text();
        setUploadedMessage(message);
        fetchMedia();
        showSnackbar("File uploaded successfully.");
      } else {
        showSnackbar("Failed to upload media.", "error");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      showSnackbar("An error occurred during upload.", "error");
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/media");
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      } else {
        showSnackbar("Failed to load media.", 'error');
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      showSnackbar("An error occurred while loading media.", 'error');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    fetchMedia();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openMenu = (event, mediaItem) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMedia(mediaItem);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedMedia(null);
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`http://localhost:8080/api/media/delete/${selectedMedia.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSnackbar("File deleted successfully.");
        setMedia(prevMedia => prevMedia.filter(item => item.id !== selectedMedia.id));
      } else {
        showSnackbar("Failed to delete media.", 'error');
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      showSnackbar("An error occurred while deleting media.", 'error');
    }

    closeMenu();
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <SideBar />
      <main style={{ margin: 0, width: '100%' }}>
        

        <button
          onClick={openModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '10px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Gallery
        </button>

        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '701px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                justifyItems: 'center',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  border: 'none',
                  fontSize: '18px',
                  color: 'white', /* Text color */
                  backgroundColor: 'red', /* Red background */
                  borderRadius: '20%', /* Round shape */
                  width: '35px', /* Button size */
                  height: '35px', /* Button size */
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: '1100', /* Make sure it's above other modal content */
                  transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out', /* Smooth transitions */
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'darkred'} /* Hover effect */
                onMouseOut={(e) => e.target.style.backgroundColor = 'red'} /* Hover out effect */
              >
                X
              </button>
              <h2
                style={{
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  textAlign: 'center',
                  color: 'black',
                }}
              >
                Media
              </h2>

              <div
                style={{
                  width: '100%',
                  padding: '0.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    justifyContent: 'center',
                    maxHeight: '450px',
                    overflowY: 'auto',
                  }}
                >
                  {media.length > 0 ? (
                    media.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          border: '2px solid #ccc',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          width: '8rem',
                          margin: '0.5rem',
                          textAlign: 'center',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            height: '6rem',
                            width: '6rem',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          {item.type.startsWith("image") && item.media && (
                            <img
                              src={`data:${item.type};base64,${item.media}`}
                              alt={`Uploaded ${index + 1}`}
                              style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          )}
                        </div>

                        {item.filename && (
                          <p
                            style={{
                              fontSize: '0.8rem',
                              textAlign: 'center',
                              width: '100%',
                              whiteSpace: 'wrap',
                              padding: '0.25rem',
                            }}
                          >
                            {item.filename}
                          </p>
                        )}

                        <IconButton
                          onClick={(e) => openMenu(e, item)}
                          style={{ position: 'absolute', top: '5px', right: '5px' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </div>
                    ))
                  ) : (
                    <p>No media found</p>
                  )}
                </div>
              </div>
              {/* File Input Centered Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
};

export default Picture;
