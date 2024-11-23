import React, { useState, useRef, useEffect } from "react";
import { 
  Snackbar, 
  Alert, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Checkbox, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Tooltip, 
  IconButton 
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

const Picture = () => {
  const [media, setMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Image modal state
  const [selectedImage, setSelectedImage] = useState(null); // Selected image state

  const fileInputRef = useRef(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getFileExtension = (mimeType) => {
    switch (mimeType) {
      case "image/png":
        return "PNG";
      case "image/jpeg":
        return "JPEG";
      case "image/jpg":
        return "JPG";
      case "image/gif":
        return "GIF";
      default:
        return "Unknown";
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar("Please select a valid image file (PNG, JPEG, JPG, GIF).", "error");
        return;
      }
      handleUpload(file);
      event.target.value = '';
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", "My file caption");

    try {
      const response = await fetch("http://localhost:8080/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showSnackbar("File uploaded successfully.");
        fetchMedia();
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
      const response = await fetch("http://localhost:8080/api/photos");
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      } else {
        showSnackbar("Failed to load media.", "error");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      showSnackbar("An error occurred while loading media.", "error");
    }
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedFiles((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedFiles((prevSelected) => prevSelected.filter((fileId) => fileId !== id));
    }
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      setSelectedFiles(media.map((item) => item.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) {
      showSnackbar("No files selected for deletion.", "error");
      return;
    }

    try {
      for (const id of selectedFiles) {
        const response = await fetch(`http://localhost:8080/api/photos/delete/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          showSnackbar(`Failed to delete file with ID ${id}.`, "error");
        }
      }
      showSnackbar("Selected files deleted successfully.");
      fetchMedia();
    } catch (error) {
      console.error("Error deleting files:", error);
      showSnackbar("An error occurred during deletion.", "error");
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  useEffect(() => {
    fetchMedia();
    setSelectedFiles([]);
  }, []);

  return (
    <main style={{ margin: 0, width: "100%" }}>
      <Box margin="0px 10px 10px 10px">
        <Box
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: (theme) => theme.palette.background.paper,
            boxShadow: 1,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            component="div"
          >
            Image List
          </Typography>
          <Box display="flex" gap={1} width="auto">
            {selectedFiles.length > 0 && (
              <Tooltip title="Delete">
               <IconButton onClick={deleteSelectedFiles}>
                 <DeleteIcon />
               </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Upload File">
              <IconButton 
                component="label"
                sx={{ padding: "8px", margin: "5px" }}
              >
                <UploadIcon />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{height:"70vh"}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.length === media.length}
                    onChange={handleSelectAllChange}
                    disabled={media.length === 0}
                  />
                </TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Upload Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {media.length > 0 ? (
                media.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(item.id)}
                        onChange={(event) => handleCheckboxChange(event, item.id)}
                      />
                    </TableCell>
                    <TableCell onClick={() => openImageModal(item)} style={{ cursor: "pointer" }}>
                      {item.filename}
                    </TableCell>
                    <TableCell onClick={() => openImageModal(item)} style={{ cursor: "pointer" }}>
                      {getFileExtension(item.type)}
                    </TableCell>
                    <TableCell onClick={() => openImageModal(item)} style={{ cursor: "pointer" }}>
                      {new Date(item.uploadDate).toLocaleString("en-US", {
                        weekday: 'short',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No media found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span>View Image</span>
            <Button onClick={() => setIsImageModalOpen(false)} color="secondary">
              Close
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {selectedImage && (
            <img
              src={`data:${selectedImage.type};base64,${selectedImage.media}`}
              alt={selectedImage.filename}
              style={{
                maxHeight: '50%',
                maxWidth: '50%',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Picture;
