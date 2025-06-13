package com.socialnetwork.controller;

import com.socialnetwork.dtos.Requests.ContentRequest;
import com.socialnetwork.dtos.Requests.NewPostRequest;
import com.socialnetwork.model.enums.EStatusPost;
import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.PostService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/post")
public class PostController {
    @Resource
    private PostService postService;

    @GetMapping("/get-all-post")
    public ResponseObject getAllPost(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "100") Integer size,
            @RequestParam(defaultValue = "UUID") String orderedBy,
            @RequestParam(defaultValue = "true") String isAscending,
            @RequestParam(defaultValue = "") String keyword) {
        Map<String, Object> result = new HashMap<>();
        Boolean isAsc = Boolean.parseBoolean(isAscending);
        Page<Post> posts = postService.getAllPost(page, size, orderedBy, isAsc, keyword);

        // Convert response to map
        result.put("posts", posts.getContent());
        result.put("totalPage", posts.getTotalPages());
        result.put("totalElement", posts.getTotalElements());
        result.put("size", posts.getSize());
        result.put("pageNumber", posts.getNumber());
        result.put("numberOfElement", posts.getNumberOfElements());
        return new ResponseObject(HttpStatus.OK.value(), "Get posts successfully", result);
    }


    @GetMapping("/get-all-post-by-user")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseObject getAllPostByUser(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "100") Integer size,
            @RequestParam(defaultValue = "UUID") String orderedBy,
            @RequestParam(defaultValue = "true") Boolean isAscending,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam String uuid) {

        Page<Post> posts = postService.getAllPostByUser(page, size, orderedBy, isAscending, keyword, uuid);
        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts.getContent());
        result.put("totalPage", posts.getTotalPages());
        result.put("totalElement", posts.getTotalElements());
        result.put("size", posts.getSize());
        result.put("pageNumber", posts.getNumber());
        result.put("numberOfElement", posts.getNumberOfElements());

        return new ResponseObject(HttpStatus.OK.value(), "Get posts successfully", result);
    }

    @GetMapping("/get-all-post-by-friend")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseObject getAllPostByFriendFollow(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "100") Integer size,
            @RequestParam(defaultValue = "UUID") String orderedBy,
            @RequestParam(defaultValue = "true") Boolean isAscending,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam String uuid) {

        Page<Post> posts = postService.getAllPostByFriend(page, size, orderedBy, isAscending, keyword, uuid);
        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts.getContent());
        result.put("totalPage", posts.getTotalPages());
        result.put("totalElement", posts.getTotalElements());
        result.put("size", posts.getSize());
        result.put("pageNumber", posts.getNumber());
        result.put("numberOfElement", posts.getNumberOfElements());

        return new ResponseObject(HttpStatus.OK.value(), "Get posts successfully", result);
    }

    @GetMapping("/get-all-post-by-follow")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseObject getAllPostByFollow(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "100") Integer size,
            @RequestParam(defaultValue = "UUID") String orderedBy,
            @RequestParam(defaultValue = "true") Boolean isAscending,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam String uuid) {

        Page<Post> posts = postService.getAllPostByFollow(page, size, orderedBy, isAscending, keyword, uuid);
        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts.getContent());
        result.put("totalPage", posts.getTotalPages());
        result.put("totalElement", posts.getTotalElements());
        result.put("size", posts.getSize());
        result.put("pageNumber", posts.getNumber());
        result.put("numberOfElement", posts.getNumberOfElements());

        return new ResponseObject(HttpStatus.OK.value(), "Get posts successfully", result);
    }

    @GetMapping("/{uuid}")
    public ResponseObject getPostByUUID(@PathVariable String uuid) {
        Optional<Post> post = Optional.ofNullable(
                postService.getPostByUUID(uuid).orElseThrow(() -> new RuntimeException("Post not found")));
        return new ResponseObject(HttpStatus.OK.value(), "Get post successfully", post);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseObject createNewPost(@Valid @RequestBody NewPostRequest newPostRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Post post = postService.createNewPost(username, newPostRequest);
        return new ResponseObject(HttpStatus.OK.value(), "Create new post successfully", post);
    }

    @PostMapping("/update-resource/{uuid}")
    public ResponseObject updatePostResource(@PathVariable String uuid,
                                             @RequestBody ContentRequest contentRequest) {
        postService.updatePostMediaResources(contentRequest, uuid);
        return new ResponseObject(HttpStatus.OK.value(),
                "Update post's content successfully", null);
    }

    @PostMapping("/update-images/{uuid}")
    public ResponseObject updatePostImages(@PathVariable String uuid,
                                           @RequestBody ContentRequest contentRequest) {
        postService.updatePostImages(contentRequest, uuid);
        return new ResponseObject(HttpStatus.OK.value(),
                "Update post's content successfully", null);
    }

    @PostMapping("/{uuid}")
    public ResponseObject updatePostStatus(@PathVariable String uuid, EStatusPost status) {
        Post post = postService.updatePostStatus(uuid, status);
        return new ResponseObject(HttpStatus.OK.value(), "Update post's status successfully", post);
    }

    @GetMapping("/get-owner")
    public ResponseObject getOwnerOfPost(@RequestParam String uuid) {
        Optional<Profile> ownerProfile = postService.getOwnerOfPost(uuid);
        return new ResponseObject(HttpStatus.OK.value(),
                "Get owner of post successfully", ownerProfile);
    }

    @GetMapping("/count-posts-user")
    public ResponseObject countPostsByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Integer count = postService.countPost(username);
        return new ResponseObject(HttpStatus.OK.value(),
                "Count posts by user successfully", count);
    }
}
