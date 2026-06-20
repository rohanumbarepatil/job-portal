package com.jobportal.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class FileUploadService {

    private final Cloudinary cloudinary;

    public FileUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String publicId = UUID.randomUUID().toString();
        
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folder,
                "public_id", publicId,
                "resource_type", "auto" // Automatically detect image vs raw (pdf, docx)
        ));

        return uploadResult.get("secure_url").toString();
    }
    
    public void deleteFileByUrl(String url) throws IOException {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1570979139/folder/public_id.jpg
        // We need to extract folder/public_id
        if (url == null || url.isEmpty()) return;
        try {
            String[] parts = url.split("/");
            String fileWithExtension = parts[parts.length - 1];
            String folder = parts[parts.length - 2];
            String publicId = fileWithExtension.split("\\.")[0];
            String fullPublicId = folder + "/" + publicId;
            cloudinary.uploader().destroy(fullPublicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("Failed to delete file from Cloudinary: " + e.getMessage());
        }
    }
}
