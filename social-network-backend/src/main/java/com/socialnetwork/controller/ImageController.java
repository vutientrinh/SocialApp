package com.socialnetwork.controller;

import com.socialnetwork.dtos.ImageModel;
import com.socialnetwork.service.ImageService;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class ImageController {
    @Resource
    private ImageService imageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map> upload(ImageModel imageModel, Authentication authentication) {
        try {
            return imageService.uploadImage(authentication, imageModel);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("/delete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map> delete(@RequestParam String imageUUID, Authentication authentication) {
        try {
            return imageService.deleteImage(authentication, imageUUID);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/get-all-image")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map> getAllImage(Authentication authentication) {
        try {
            return imageService.getAllImageByUser(authentication);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/get-all-image-by-user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map> getAllImageByUserUUID(@RequestParam String currentUser) {
        try {
            return imageService.getAllImageByUUID(currentUser);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
