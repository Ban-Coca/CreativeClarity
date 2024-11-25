package com.creative_clarity.clarity_springboot.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
    private CourseRepository courseRepo;

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
    
            // Fetch the course entity
            CourseEntity course = courseRepo.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
    
            // Create the PhotoEntity and set properties
            PhotoEntity photoEntity = new PhotoEntity();
            photoEntity.setFilename(uniqueFilename);
            photoEntity.setCaption(caption);
            photoEntity.setType(file.getContentType());
            photoEntity.setFilePath(filePath.toString());
            photoEntity.setMedia(media);
            photoEntity.setUploadDate(java.time.LocalDateTime.now()); // Set the upload date
            photoEntity.setCourse(course); // Set the associated course directly
    
            // Save the PhotoEntity, this will automatically save the relationship with the Course
            return prepo.save(photoEntity);  // The CourseEntity will be updated automatically due to CascadeType.ALL
    
        } catch (IOException e) {
            logger.error("Failed to upload file: " + filename, e);
            throw e; // rethrow the exception
        }
    }
    
    public List<PhotoEntity> getAllPhotos() {
        return prepo.findAll();
    }
    // Method to get photos by course
    public List<PhotoEntity> getPhotosByCourse(CourseEntity course) {
        return prepo.findByCourse(course);
    }
    public PhotoEntity getPhotoById(int id) {
        return prepo.findById(id).orElse(null);
    }

    public void deletePhoto(int id) {
        PhotoEntity photo = prepo.findById(id).orElse(null);
        if (photo != null) {
            // Log file path
            Path filePath = Paths.get(photo.getFilePath());
            logger.info("Attempting to delete file: " + filePath.toString()); 
            
            try {
                // Check if file exists and delete it
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    logger.info("File deleted: " + photo.getFilename());
                } else {
                    logger.warn("File not found, could not delete: " + photo.getFilename());
                }
    
                // Detach photo from the course entity before deleting
                if (photo.getCourse() != null) {
                    CourseEntity course = photo.getCourse();
                    course.getPhoto().remove(photo);  // Remove photo from the course's photo list
                    photo.setCourse(null);  // Remove the reference to the course entity
                    
                    // Save the course entity to reflect changes in the database
                    courseRepo.save(course);  // Assuming courseRepository is used to manage CourseEntity
                }
    
                // Now delete the photo entity from the database
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
}