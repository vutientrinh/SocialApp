package com.socialnetwork.service;

import com.socialnetwork.dtos.ImageModel;
import com.socialnetwork.model.news.Image;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.ImageRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ImageService {

    @Resource
    private CloudinaryService cloudinaryService;
    @Resource
    private ImageRepository imageRepository;
    @Resource
    private UserRepository userRepository;

    public ResponseEntity<Map> uploadImage(Authentication authentication, ImageModel imageModel) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (imageModel.getName().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (imageModel.getFile().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Optional<User> authUser = Optional.of(userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new Exception("User is not found")));

            // Image object
            Image image = new Image();
            image.setName(imageModel.getName());
            image.setUrl(cloudinaryService.uploadFile(imageModel.getFile(), null));
            image.setCreatedAt(LocalDateTime.now());
            image.setCreatedBy(authUser.get());
            if(image.getUrl() == null) {
                return ResponseEntity.badRequest().build();
            }
            Image getImage = imageRepository.save(image);
            result.put("uuid", getImage.getUUID());
            result.put("url", image.getUrl());
            result.put("name", image.getName());
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ResponseEntity<Map> deleteImage(Authentication authentication, String imageUUID) {
        try {
            Optional<User> authUser = Optional.of(userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new Exception("User is not found")));
            Optional<Image> image = Optional.of(imageRepository.fileByUUID(imageUUID)
                    .orElseThrow(() -> new Exception("Image is not found")));
            if (!image.get().getCreatedBy().equals(authUser.get())) {
                return ResponseEntity.badRequest().build();
            }
            cloudinaryService.deleteFile(image.get().getUrl());
            imageRepository.delete(image.get());
            return ResponseEntity.ok().body(Map.of("message", "Image deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ResponseEntity<Map> getImageByUUID(String uuid) {
        try {
            if (uuid.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Optional<Image> image = Optional.of(imageRepository.fileByUUID(uuid)
                    .orElseThrow(() -> new Exception("Image is not found")));
            return ResponseEntity.ok().body(Map.of("url", image.get().getUrl()));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ResponseEntity<Map> getAllImageByUser(Authentication authentication) {
        try {
            Optional<User> authUser = Optional.of(userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new Exception("User is not found")));
            return ResponseEntity.ok()
                    .body(Map.of("images", imageRepository.findAllByCreatedBy(authUser.get())));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ResponseEntity<Map> getAllImageByUUID(String uuid) {
        try {
            if (uuid.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Optional<User> user = Optional.of(userRepository.findByUUID(uuid)
                    .orElseThrow(() -> new Exception("User is not found")));
            return ResponseEntity.ok()
                    .body(Map.of("images", imageRepository.findAllByCreatedBy(user.get())));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
