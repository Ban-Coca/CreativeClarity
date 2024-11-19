package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Service.PhotoService;

@RestController
@RequestMapping("/api/media")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caption") String caption,
            @RequestParam("userId") int userId) {
        try {
            PhotoEntity uploadedPhoto = photoService.uploadFile(file, caption, userId);
            return ResponseEntity.ok("File uploaded successfully. ID: " + uploadedPhoto.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<PhotoEntity>> getAllMedia() {
        try {
            List<PhotoEntity> photos = photoService.getAllPhotos();
            return ResponseEntity.ok(photos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PhotoEntity>> getMediaByUser(@PathVariable int userId) {
        try {
            List<PhotoEntity> userPhotos = photoService.getPhotosByUser(userId);
            return ResponseEntity.ok(userPhotos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
