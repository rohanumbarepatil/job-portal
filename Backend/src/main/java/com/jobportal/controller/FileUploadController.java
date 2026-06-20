package com.jobportal.controller;

import com.jobportal.response.GlobalResponse;
import com.jobportal.service.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<GlobalResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }
            
            // Allow only certain folders for security
            if (!folder.equals("resumes") && !folder.equals("logos") && !folder.equals("profiles")) {
                folder = "general";
            }

            String url = fileUploadService.uploadFile(file, "job-portal/" + folder);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            
            return ResponseEntity.ok(GlobalResponse.success("File uploaded successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
