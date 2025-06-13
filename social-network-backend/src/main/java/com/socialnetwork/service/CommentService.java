package com.socialnetwork.service;

import com.socialnetwork.Mapper.ContentMapper;
import com.socialnetwork.Mapper.ImageMapper;
import com.socialnetwork.Mapper.MediaResourceMapper;
import com.socialnetwork.dtos.Requests.CommentRequest;
import com.socialnetwork.dtos.Requests.ImageRequest;
import com.socialnetwork.dtos.Requests.MediaResourceRequest;
import com.socialnetwork.model.news.Comment;
import com.socialnetwork.model.news.Content;
import com.socialnetwork.model.news.Image;
import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.resource.MediaResources;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.*;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Resource
    private PostRepository postRepository;
    @Resource
    private CommentRepository commentRepository;
    @Resource
    private ContentRepository contentRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private MediaResourceRepository mediaResourceRepository;
    @Resource
    private ImageRepository imageRepository;
    @Resource
    private MediaResourceMapper mediaResourceMapper;
    @Resource
    private ImageMapper imageMapper;
    @Resource
    private ContentMapper contentMapper;

    public Comment createComment(String username, CommentRequest commentRequest) {
        Optional<Post> postOptional = postRepository.findByUUID(commentRequest.getPostUUID());
        Optional<User> userOptional = userRepository.findByUsername(username);
        Comment comment = new Comment();

        if (postOptional.isPresent() && userOptional.isPresent()) {
            Post post = postOptional.get();
            User user = userOptional.get();

            // Mapping MediaResourceRequest to MediaResources
            MediaResourceRequest mediaResourceRequest = commentRequest.getContent().getFileUUID();
            MediaResources mediaResources = null;
            if (mediaResourceRequest != null) {
                mediaResources = mediaResourceMapper.toMediaResources(mediaResourceRequest);
                mediaResourceRepository.save(mediaResources);
            }

            //Mapping ImageRequest to Image
            List<ImageRequest> imageRequests = commentRequest.getContent().getImageURLs();
            List<Image> images = new ArrayList<>();
            if (imageRequests != null && !imageRequests.isEmpty()) {
                images = imageMapper.toImages(imageRequests);
                imageRepository.saveAll(images);
            }
            Content content = contentMapper.toContent(commentRequest.getContent().getMessage(), mediaResources, images);
            content.setCreatedBy(user);
            contentRepository.save(content);

            // Update the post with the new comment
            post.getComments().add(comment);
            postRepository.save(post);

            // save comment
            comment.setPost(post);
            comment.setContent(content);
            comment.setCreatedBy(user);
            comment.setLastModifiedBy(username);
            comment.setLastModifiedDate(LocalDateTime.now());
            comment.setCreatedAt(LocalDateTime.now());
            Comment getComment = commentRepository.save(comment);
            return getComment;
        }
        return null;
        // Push notification
    }

}
