package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    // Single file upload
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.storeFile(file);

            Map<String, String> response = new HashMap<>();
            response.put("fileName", file.getOriginalFilename());
            response.put("fileUrl", fileUrl);
            response.put("fileType", file.getContentType());
            response.put("size", String.valueOf(file.getSize()));

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Multiple files upload
    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> fileUrls = fileStorageService.storeMultipleFiles(files);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Files uploaded successfully");
            response.put("totalFiles", files.length);
            response.put("fileUrls", fileUrls);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}