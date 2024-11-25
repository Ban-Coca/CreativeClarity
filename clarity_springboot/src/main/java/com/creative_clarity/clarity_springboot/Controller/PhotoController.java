package com.creative_clarity.clarity_springboot.Controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Service.CourseService;
import com.creative_clarity.clarity_springboot.Service.PhotoService;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private static final Logger logger = LoggerFactory.getLogger(PhotoController.class);

    @Autowired
    private PhotoService photoService;

    @Autowired
    private CourseService courseService;

    // Upload a photo
    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("file") MultipartFile file, 
            @RequestParam("caption") String caption, 
            @RequestParam("courseId") int courseId) {
        try {
            PhotoEntity uploadedPhoto = photoService.uploadPhoto(file, caption, courseId);
            return ResponseEntity.ok("File uploaded successfully: " + uploadedPhoto.getFilename());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}")
    public List<PhotoEntity> getPhotosByCourse(@PathVariable int courseId) {
        CourseEntity course = courseService.getCourseById(courseId).orElse(null);
        if (course == null) {
            // Handle the case when the course is not found
            return new ArrayList<>(); // Return an empty list or handle it as needed
        }
        return photoService.getPhotosByCourse(course);
    }
    
    // Get all photos
    @GetMapping
    public ResponseEntity<List<PhotoEntity>> getAllPhotos() {
        List<PhotoEntity> photos = photoService.getAllPhotos();
        return new ResponseEntity<>(photos, HttpStatus.OK);
    }

    // Get a photo by ID
    @GetMapping("/{id}")
    public ResponseEntity<PhotoEntity> getPhotoById(@PathVariable int id) {
        PhotoEntity photo = photoService.getPhotoById(id);
        if (photo != null) {
            return new ResponseEntity<>(photo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a photo
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePhoto(@PathVariable int id) {
        try {
            photoService.deletePhoto(id);
            return new ResponseEntity<>("Photo deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting photo with ID " + id, e);
            return new ResponseEntity<>("Failed to delete photo.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Download the photo (based on file path)
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadPhoto(@PathVariable int id) throws IOException {
        PhotoEntity photo = photoService.getPhotoById(id);
        if (photo != null) {
            Path path = Paths.get(photo.getFilePath());
            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(photo.getType()))
                    .body(resource);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
