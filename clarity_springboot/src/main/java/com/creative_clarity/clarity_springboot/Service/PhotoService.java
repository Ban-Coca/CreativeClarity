package com.creative_clarity.clarity_springboot.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Entity.UserEntity;
import com.creative_clarity.clarity_springboot.Repository.PhotoRepository;
import com.creative_clarity.clarity_springboot.Repository.UserRepository;

@Service
public class PhotoService {
    
    @Autowired
    private PhotoRepository prepo;
    private UserRepository urepo;

    // Directory for uploads (loaded from application.properties)
    @Value("${file.upload.directory}")
    private String uploadDirectory;

    // Create of CRUD
    public PhotoEntity postPhotoRecord(PhotoEntity photo) {
        return prepo.save(photo);
    }

    // Read all photos
    public List<PhotoEntity> getAllPhotos() {
        return prepo.findAll();
    }

    // Read photos for a specific user
    public List<PhotoEntity> getPhotosByUser(int userId) {
        return prepo.findByUser_UserId(userId);
    }

    public PhotoEntity uploadFile(MultipartFile file, String caption, int userId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be null or empty.");
        }

        // Get original filename and file type
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        String fileType = file.getContentType();

        // Create the upload directory if it doesn't exist
        File directory = new File(uploadDirectory);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate base filename and extension
        String baseFileName = filename.substring(0, filename.lastIndexOf('.'));
        String extension = filename.substring(filename.lastIndexOf('.'));
        String filePath = uploadDirectory + baseFileName + extension;
        Path path = Paths.get(filePath);

        // Check existing files to find the highest number for this base filename
        int counter = 1;
        while (Files.exists(path)) {
            filePath = uploadDirectory + baseFileName + "(" + counter + ")" + extension;
            path = Paths.get(filePath);
            counter++;
        }

        // Save the file in the file system
        Files.write(path, file.getBytes());

        // Fetch the user entity from the database
        UserEntity user = urepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Create a PhotoEntity and associate it with the user
        PhotoEntity mediaEntity = new PhotoEntity();
        mediaEntity.setFilename(filename);
        mediaEntity.setType(fileType);
        mediaEntity.setFilePath(filePath);
        mediaEntity.setUploadDate(new Date());
        mediaEntity.setCaption(caption);
        mediaEntity.setUser(user);

        return prepo.save(mediaEntity);
    }


    // Delete of CRUD
    public String deletePhoto(int photoId) {
        Optional<PhotoEntity> photoOptional = prepo.findById(photoId);

        if (photoOptional.isPresent()) {
            prepo.deleteById(photoId);
            return "Photo record successfully deleted!";
        } else {
            return "Photo ID " + photoId + " NOT FOUND!";
        }
    }
}
