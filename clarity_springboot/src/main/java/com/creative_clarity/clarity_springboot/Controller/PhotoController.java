package com.creative_clarity.clarity_springboot.Controller;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    // Upload a photo
    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file,
                                              @RequestParam("caption") String caption) {
        try {
            PhotoEntity photo = photoService.uploadPhoto(file, caption);
            return new ResponseEntity<>("File uploaded successfully: " + photo.getFilename(), HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload file.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all photos
    @GetMapping
    public ResponseEntity<List<PhotoEntity>> getAllPhotos() {
        List<PhotoEntity> photos = photoService.getAllPhotos();
        return new ResponseEntity<>(photos, HttpStatus.OK);
    }

    // Get a photo by ID
    @GetMapping("/{id}")
    public ResponseEntity<PhotoEntity> getPhotoById(@PathVariable Long id) {
        Optional<PhotoEntity> photo = photoService.getPhotoById(id);
        return photo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete a photo
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long id) {
        try {
            photoService.deletePhoto(id);
            return new ResponseEntity<>("Photo deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete photo.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Download the photo (based on file path)
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadPhoto(@PathVariable Long id) throws IOException {
        Optional<PhotoEntity> photoOptional = photoService.getPhotoById(id);
        if (photoOptional.isPresent()) {
            PhotoEntity photo = photoOptional.get();
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
