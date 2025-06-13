package com.socialnetwork.controller;

import com.socialnetwork.model.resource.MediaResources;
import com.socialnetwork.repository.FileRepository;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.FileStorageService;
import com.socialnetwork.utils.EnvironmentUtils;
import com.socialnetwork.utils.FileUtils;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/file")
public class FileStorageController {

    @Value("${public-folder}")
    private String publicFolder;
    @Resource
    private FileStorageService fileStorageService;
    @Resource
    private FileRepository fileRepository;

    @PostMapping("/uploadFile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Map<String, Object> uploadFile(@RequestBody MultipartFile file, Authentication authentication) throws Exception {
        String baseFolder = EnvironmentUtils.getEnvironmentValue("public-folder");
        String baseFolderUploaded = EnvironmentUtils.getEnvironmentValue("upload_files.base-folder");
        String targetFolder = EnvironmentUtils.getEnvironmentValue("upload_files.exchange_rate");
        String extensionFile = FileUtils.getFileExtension(file.getOriginalFilename());
        String originNameFile = FileUtils.getFileName(file.getOriginalFilename());
        String fileName = fileStorageService.saveFileUploaded(file, authentication, targetFolder, extensionFile, originNameFile);

        // Information to save into DB
        String filePath = baseFolder + baseFolderUploaded + targetFolder + fileName;
        String fileUUID = fileRepository.getFileUUIDByFileName(originNameFile);
        log.info("File path: " + filePath);
        if (fileUUID != null)
            return Map.of("message", "Upload successfully");

        return Map.of("message", "Upload failed");
    }
    @GetMapping("/downloadFile")
    public ResponseEntity<UrlResource> downloadFile(@RequestParam String filePath) {
        try {
            // Load file as a resource
            Path path = Paths.get(publicFolder + filePath);
            UrlResource resource = new UrlResource(path.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; " +
                                "filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/get-all-file")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseObject getAllFile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            List<MediaResources> files = fileStorageService.getAllFileByUser(username);
            return new ResponseObject(HttpStatus.OK.value(), "Get all files successfully", files);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
