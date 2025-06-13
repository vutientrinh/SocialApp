package com.socialnetwork.controller;

import com.socialnetwork.model.PostFolder.PostFolder;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.PostFolderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folder")
public class PostFolderController {

    private final PostFolderService postFolderService;

    public PostFolderController(PostFolderService postFolderService) {
        this.postFolderService = postFolderService;
    }

    // Tạo thư mục mới
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createNewFolder(@RequestParam String folderName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        PostFolder postFolder = postFolderService.createNewPostFolder(username, folderName);
        if (postFolder != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseObject(200, "Folder created successfully", postFolder));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject(400, "Folder creation failed", null));
        }
    }

    // Lấy thông tin thư mục theo tên
    @GetMapping("/{folderName}")
    public ResponseEntity<ResponseObject> getFolder(@PathVariable String folderName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        PostFolder postFolder = postFolderService.getPostFolder(folderName, username);
        if (postFolder != null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject(200, "Folder retrieved successfully", postFolder));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject(404, "Folder not found", null));
        }
    }

    // Thêm bài viết vào thư mục
    @PostMapping("/{folderName}/addPost")
    public ResponseEntity<ResponseObject> addPostToFolder(
            @PathVariable String folderName,
            @RequestParam String postUUID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        PostFolder postFolder = postFolderService.addPostToFolder(folderName, postUUID, username);
        if (postFolder != null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject(200, "Post added to folder successfully", postFolder));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject(400, "Failed to add post to folder", null));
        }
    }

    // xóa post từ thư mục
    @DeleteMapping("/removePost")
    public ResponseEntity<ResponseObject> removePostFromFolder(@RequestParam String postUUID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        PostFolder postFolder = postFolderService.removePostFromFolder(postUUID, username);
        if (postFolder != null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject(200, "Post removed from folder successfully", postFolder));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject(400, "Failed to remove post from folder", null));
        }
    }

    // Lấy tất cả thư mục của người dùng
    @GetMapping("/userFolders")
    public ResponseEntity<ResponseObject> getUserFolders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<PostFolder> folders = postFolderService.getPostFolders(username);
        if (folders != null && !folders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject(200, "User folders retrieved successfully", folders));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject(404, "No folders found for user", null));
        }
    }

    // Tạo thư mục mặc định nếu chưa tồn tại
    @PostMapping("/createDefault")
    public ResponseEntity<ResponseObject> createDefaultFolder() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        PostFolder defaultFolder = postFolderService.createDefaultFolder(username);
        if (defaultFolder != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseObject(200, "Default folder created successfully", defaultFolder));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject(400, "Failed to create default folder", null));
        }
    }

    // Xóa thư mục
    @DeleteMapping("/delete")
    public ResponseEntity<ResponseObject> deleteFolder(@RequestParam String folderName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean deleted = postFolderService.deletePostFolder(username, folderName);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject(200, "Folder deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject(400, "Failed to delete folder", null));
        }
    }
}
