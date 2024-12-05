package com.creative_clarity.clarity_springboot.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;
import com.creative_clarity.clarity_springboot.Repository.PhotoRepository;

@Service
public class PhotoService {

    private static final Logger logger = LoggerFactory.getLogger(PhotoService.class);

    @Value("${file.upload-dir}")
    private String uploadDirectory;

    @Autowired
    private PhotoRepository prepo;

    @Autowired
    private CourseRepository crepo;

    public PhotoEntity uploadPhoto(MultipartFile file, String caption, int courseId) throws IOException {
        Path path = Paths.get(uploadDirectory);

        // Ensure the upload directory exists
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            logger.info("Created upload directory: " + uploadDirectory);
        }

        String filename = file.getOriginalFilename();
        String uniqueFilename = System.currentTimeMillis() + "_" + filename;
        Path filePath = Paths.get(uploadDirectory).resolve(uniqueFilename);

        // Ensure file is an image
        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }

        try {
            // Convert the file to byte array
            byte[] media = file.getBytes();

            // Write the file to the upload directory
            Files.write(filePath, media);
            logger.info("File uploaded: " + uniqueFilename);

            // Create and save the PhotoEntity
            PhotoEntity photoEntity = new PhotoEntity();
            photoEntity.setFilename(uniqueFilename);
            photoEntity.setCaption(caption);
            photoEntity.setType(file.getContentType());
            photoEntity.setFilePath(filePath.toString());
            photoEntity.setMedia(media);
            photoEntity.setUploadDate(java.time.LocalDateTime.now()); // Set the upload date
            CourseEntity course = crepo.findById(courseId).orElseThrow(() -> 
                new RuntimeException("Course not found"));
            photoEntity.setCourse(course);
            return prepo.save(photoEntity);

        } catch (IOException e) {
            logger.error("Failed to upload file: " + filename, e);
            throw e; // rethrow the exception
        }
    }

    public List<PhotoEntity> getAllPhotos() {
        return prepo.findAll();
    }

    public PhotoEntity getPhotoById(Long id) {
        return prepo.findById(id).orElse(null);
    }

    public void deletePhoto(Long id) {
        PhotoEntity photo = prepo.findById(id).orElse(null);
        if (photo != null) {
            Path filePath = Paths.get(photo.getFilePath());
            logger.info("Attempting to delete file: " + filePath.toString()); // Log the file path
    
            try {
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    logger.info("File deleted: " + photo.getFilename());
                } else {
                    logger.warn("File not found, could not delete: " + photo.getFilename());
                }
    
                prepo.deleteById(id);
                logger.info("Photo entity deleted from database: " + photo.getFilename());
            } catch (IOException e) {
                logger.error("Failed to delete file: " + photo.getFilename(), e);
                throw new RuntimeException("Failed to delete file.", e);
            }
        } else {
            logger.warn("Photo with ID " + id + " not found for deletion.");
        }
    }

    public List<PhotoEntity> getPhotosByCourseId(int courseId){
        return prepo.findAll().stream()
            .filter(photo -> photo.getCourse() != null && photo.getCourse().getCourseId() == courseId)
            .collect(Collectors.toList());
    }
}