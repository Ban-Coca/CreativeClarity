import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
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
  IconButton, 
  CircularProgress
} from "@mui/material";
import { Toaster, toast } from "sonner";
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

const Picture = () => {
  const { courseId } = useParams();
  const [media, setMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        showToast("Please select a valid image file (PNG, JPEG, JPG, GIF).", "error");
        return;
      }
      handleUpload(file);
      event.target.value = '';
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Delay function

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", "My file caption");
    formData.append("courseId", courseId);

    try {
      setLoading(true); // Start loading
      const response = await fetch("http://localhost:8080/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showToast("File uploaded successfully.");
        fetchMedia();
      } else {
        showToast("Failed to upload media.", "error");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      showToast("An error occurred during upload.", "error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchMedia = async () => {
    try {
      setLoading(true); // Start loading
      await delay(500); // Simulate delay (e.g., 1.5 seconds before making the request)

      const response = await fetch(`http://localhost:8080/api/photos/course/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
        showToast("Photos Fetched Successfully", "success");
      } else {  
        showToast("Failed to load media.", "error");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      showToast("An error occurred while loading media.", "error");
    } finally {
      setLoading(false); // Stop loading
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
      showToast("No files selected for deletion.", "error");
      return;
    }

    try {
      for (const id of selectedFiles) {
        const response = await fetch(`http://localhost:8080/api/photos/delete/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          showToast(`Failed to delete file with ID ${id}.`, "error");
        }
      }
      showToast("Selected files deleted successfully.");
      fetchMedia();
    } catch (error) {
      console.error("Error deleting files:", error);
      showToast("An error occurred during deletion.", "error");
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  useEffect(() => {
    fetchMedia();
    setSelectedFiles([]);
  }, [courseId]);

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
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
            Image List
          </Typography>
          <Box display="flex" gap={1} width="auto">
            {selectedFiles.length > 0 && media.length > 0 && (
              <Tooltip title="Delete">
                <IconButton onClick={deleteSelectedFiles}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Upload File">
              <IconButton component="label" sx={{ padding: "8px", margin: "5px" }}>
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

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={10}>
            <CircularProgress size={95}/>
            <Typography variant="body1" sx={{ marginLeft: 1 ,marginTop: 5 }}>Loading...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.length === media.length && media.length > 0}
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
        )}
      </Box>

      <Toaster richColors position="bottom-right" closeButton/>

      {/* Image Modal */}
      <Dialog
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      >
        <DialogTitle>Image Details</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box>
              <img
                src={`http://localhost:8080/api/photos/${selectedImage.id}`}
                alt={selectedImage.filename}
                style={{ width: "100%", height: "auto" }}
              />
              <Typography variant="h6">Filename: {selectedImage.filename}</Typography>
              <Typography>Type: {getFileExtension(selectedImage.type)}</Typography>
              <Typography>Uploaded On: {new Date(selectedImage.uploadDate).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Picture;
