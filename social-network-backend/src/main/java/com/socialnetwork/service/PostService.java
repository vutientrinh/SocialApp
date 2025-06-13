package com.socialnetwork.service;

import com.socialnetwork.Mapper.ImageMapper;
import com.socialnetwork.Mapper.MediaResourceMapper;
import com.socialnetwork.dtos.Requests.ContentRequest;
import com.socialnetwork.dtos.Requests.ImageRequest;
import com.socialnetwork.dtos.Requests.MediaResourceRequest;
import com.socialnetwork.dtos.Requests.NewPostRequest;
import com.socialnetwork.exception.PostNotFoundException;
import com.socialnetwork.model.enums.EStatusPost;
import com.socialnetwork.model.news.Content;
import com.socialnetwork.model.news.Image;
import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.resource.MediaResources;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.*;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    @Resource
    private PostRepository postRepository;
    @Resource
    private ProfileRepository profileRepository;
    @Resource
    private MediaResourceRepository mediaResourceRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private ContentRepository contentRepository;
    @Resource
    private ImageRepository imageRepository;
    @Resource
    private MediaResourceMapper mediaResourceMapper;
    @Resource
    private ImageMapper imageMapper;
    @Resource
    private FriendService friendService;
    @Resource
    private FollowService followService;

    public Page<Post> getAllPost(Integer page, Integer size, String orderedBy,
                                 Boolean isAscending, String keyword) {
        Sort sort = Boolean.TRUE.equals(isAscending)
                ? Sort.by(orderedBy).ascending()
                : Sort.by(orderedBy).descending();

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);
        Page<Post> postPage = postRepository.findByUUIDContainingIgnoreCase(keyword, pageRequest);
        return postPage;
    }

    public Page<Post> getAllPostByUser(Integer page, Integer size,
                                       String orderedBy, Boolean isAscending,
                                       String keyword, String uuid) {
        Optional<User> currentUser = userRepository.findByUUID(uuid);
        Sort sort = Boolean.TRUE.equals(isAscending)
                ? Sort.by(orderedBy).ascending()
                : Sort.by(orderedBy).descending();

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);
        Page<Post> postPage = postRepository.findByUUIDContainingIgnoreCase(keyword, pageRequest);
        // filter posts by user
        List<Post> filteredPosts = new ArrayList<>();
        for (Post post : postPage) {
            if (post.getUser().getUUID().equals(uuid)) {
                filteredPosts.add(post);
            }
        }
        return new PageImpl<>(filteredPosts, pageRequest, filteredPosts.size());
    }

    /**
     * Get all posts by friend follow
     */
    public Page<Post> getAllPostByFriend(Integer page, Integer size,
                                       String orderedBy, Boolean isAscending,
                                       String keyword, String uuid) {
        Optional<User> currentUser = userRepository.findByUUID(uuid);
        Sort sort = Boolean.TRUE.equals(isAscending)
                ? Sort.by(orderedBy).ascending()
                : Sort.by(orderedBy).descending();

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);
        Page<Post> postPage = postRepository.findByUUIDContainingIgnoreCase(keyword, pageRequest);
        // filter posts by friend follow
        List<Post> filteredPosts = new ArrayList<>();
        for (Post post : postPage) {
            User owner = post.getUser();
            if (friendService.isFriend(currentUser.get().getUUID(), owner.getUUID())) {
                filteredPosts.add(post);
            }
        }
        return new PageImpl<>(filteredPosts, pageRequest, filteredPosts.size());
    }

    public Page<Post> getAllPostByFollow(Integer page, Integer size,
                                         String orderedBy, Boolean isAscending,
                                         String keyword, String uuid){
        Optional<User> currentUser = userRepository.findByUUID(uuid);
        Sort sort = Boolean.TRUE.equals(isAscending)
                ? Sort.by(orderedBy).ascending()
                : Sort.by(orderedBy).descending();

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);
        Page<Post> postPage = postRepository.findByUUIDContainingIgnoreCase(keyword, pageRequest);
        // filter posts by friend follow
        List<Post> filteredPosts = new ArrayList<>();
        for (Post post : postPage) {
            User owner = post.getUser();
            if (followService.isFollow(owner.getUUID(), currentUser.get().getUUID())) {
                filteredPosts.add(post);
            }
        }
        return new PageImpl<>(filteredPosts, pageRequest, filteredPosts.size());
    }

    public Optional<Post> getPostByUUID(String UUID) {
        Optional<Post> post = postRepository.findById(UUID);
        return post;
    }

    public Post createNewPost(String username, NewPostRequest newPostRequest) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Post post = new Post();

            // Create content
            Content content = new Content();
            content.setMessage(newPostRequest.getMessage());
            content.setCreatedBy(user.get());
            content.setCreatedAt(LocalDateTime.now());
            Content savedContent = contentRepository.save(content);
            newPostRequest.getImageURLs().forEach(image -> {
                image.setCreatedBy(user.get());
                image.setContent(savedContent);
                imageRepository.save(image);
            });
            savedContent.setImageURLs(newPostRequest.getImageURLs());
            contentRepository.save(savedContent);

            // Create post
            post.setContent(content);
            post.setUser(user.get());
            post.setStatus(EStatusPost.fStatusPost(newPostRequest.getStatus()));
            post.setCreatedDateAt(LocalDateTime.now());
            postRepository.save(post);
            return post;

        }
        return null;
    }

    public Post updatePostStatus(String UUID, EStatusPost status) {
        Post post = postRepository.findById(UUID)
                .orElseThrow(() -> new RuntimeException("Can't find this post"));
        post.setStatus(status);
        postRepository.save(post);
        return post;
    }

    public void updatePostMediaResources(ContentRequest contentRequest, String postUUID) {
        Optional<Post> currentPostOptional = postRepository.findByUUID(postUUID);
        if (currentPostOptional.isPresent()) {
            Post currentPost = currentPostOptional.get();
            Content content = currentPost.getContent();

            // Map and update media resources
            MediaResourceRequest mediaResourceRequest = contentRequest.getFileUUID();
            if (mediaResourceRequest != null) {
                MediaResources mediaResources = mediaResourceMapper.toMediaResources(mediaResourceRequest);
                content.setFileUUID(mediaResources);
                contentRepository.save(content);
            } else content.setFileUUID(null);

            currentPost.setContent(content);
            postRepository.save(currentPost);
        } else {
            throw new PostNotFoundException("Post with UUID " + postUUID + " not found.");
        }
    }

    public void updatePostImages(ContentRequest contentRequest, String postUUID) {
        Optional<Post> currentPostOptional = postRepository.findByUUID(postUUID);
        if (currentPostOptional.isPresent()) {
            Post currentPost = currentPostOptional.get();
            Content content = currentPost.getContent();
            imageRepository.deleteAllImagesByContentUUID(content.getUUID());

            // Map and save new images
            List<ImageRequest> imageRequests = contentRequest.getImageURLs();
            if (imageRequests != null && !imageRequests.isEmpty()) {
                List<Image> newImages = imageMapper.toImages(imageRequests);
                newImages.forEach(image -> image.setContent(content));
                newImages = imageRepository.saveAll(newImages);
                content.setImageURLs(newImages);
            }

            currentPost.setContent(content);
            postRepository.save(currentPost);
        } else {
            throw new PostNotFoundException("Post with UUID " + postUUID + " not found.");
        }
    }

    public Optional<Profile> getOwnerOfPost(String UUID) {
        Post post = postRepository.findById(UUID)
                .orElseThrow(() -> new RuntimeException("Can't find this post"));
        User owner = post.getUser();
        return profileRepository.findProfileByCreatedBy(owner);
    }

    public Integer countPost(String username){
        Optional<User> user = userRepository.findByUsername(username);
        return postRepository.countPostByUser(user.get().getUUID());
    }
}
