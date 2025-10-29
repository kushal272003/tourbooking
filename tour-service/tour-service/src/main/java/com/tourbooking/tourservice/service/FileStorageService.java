package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Value("${file.base-url}")
    private String baseUrl;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            // Directory create karna agar exist nahi karti
            Files.createDirectories(this.fileStorageLocation);
            System.out.println("✅ Upload directory created at: " + this.fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    // Single file upload
    public String storeFile(MultipartFile file) {
        // Validate file
        validateFile(file);

        // Original filename
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        // Unique filename generate (UUID + original extension)
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // File save karna
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("✅ File uploaded: " + uniqueFileName);

            // Full URL return karna
            return baseUrl + "/uploads/tour-images/" + uniqueFileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + uniqueFileName, e);
        }
    }

    // Multiple files upload
    public List<String> storeMultipleFiles(MultipartFile[] files) {
        List<String> fileUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileUrl = storeFile(file);
                fileUrls.add(fileUrl);
            }
        }

        return fileUrls;
    }

    // File validation
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty!");
        }

        // File type check (only images allowed)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed!");
        }

        // File size check (already handled by Spring, but additional check)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File size exceeds 5MB limit!");
        }
    }

    // File delete karna (optional - future use)
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
            System.out.println("✅ File deleted: " + fileName);
        } catch (IOException e) {
            System.err.println("❌ Could not delete file: " + fileName);
        }
    }
}