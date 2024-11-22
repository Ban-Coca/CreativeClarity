package com.creative_clarity.clarity_springboot.Service;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {

    @Value("${file.upload-dir}")
    private String uploadDirectory;

    @Autowired
    private PhotoRepository prepo;

    public PhotoEntity uploadPhoto(MultipartFile file, String caption) throws IOException {
        Path path = Paths.get(uploadDirectory);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String filename = file.getOriginalFilename();
        String filePath = uploadDirectory + filename;

        // Convert the file to byte array
        byte[] media = file.getBytes();

        PhotoEntity photoEntity = new PhotoEntity();
        photoEntity.setFilename(filename);
        photoEntity.setCaption(caption);
        photoEntity.setType(file.getContentType());
        photoEntity.setFilePath(filePath);
        photoEntity.setMedia(media);

        return prepo.save(photoEntity);
    }

    public List<PhotoEntity> getAllPhotos() {
        return prepo.findAll();
    }

    public Optional<PhotoEntity> getPhotoById(Long id) {
        return prepo.findById(id);
    }

    public void deletePhoto(Long id) {
        prepo.deleteById(id);
    }
}
