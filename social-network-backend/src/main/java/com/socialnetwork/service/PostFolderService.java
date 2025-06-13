package com.socialnetwork.service;

import com.socialnetwork.model.PostFolder.PostFolder;
import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.PostFolderRepository;
import com.socialnetwork.repository.PostRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostFolderService {
    @Resource
    private PostFolderRepository postFolderRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private PostRepository postRepository;

    // Tạo thư mục mới nếu chưa tồn tại
    public PostFolder createNewPostFolder(String username, String folderName) {
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            if (loginUser.isPresent()) {
                User user = loginUser.get();
                Optional<PostFolder> existingFolder = postFolderRepository.findByNameAndCreatedBy(folderName, user);
                if (existingFolder.isEmpty()) {
                    PostFolder newFolder = new PostFolder();
                    newFolder.setName(folderName);
                    newFolder.setCreatedBy(user);
                    newFolder.setCreatedAt(LocalDateTime.now());
                    return postFolderRepository.save(newFolder);
                }
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public PostFolder getPostFolder(String folderName, String username) {
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            return loginUser.flatMap(user -> postFolderRepository.findByNameAndCreatedBy(folderName, user))
                    .orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public PostFolder addPostToFolder(String folderName, String postUUID, String username) {
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            if (loginUser.isPresent()) {
                User user = loginUser.get();
                Optional<PostFolder> postFolder = postFolderRepository.findByNameAndCreatedBy(folderName, user);
                Optional<Post> post = postRepository.findByUUID(postUUID);
                if (postFolder.isPresent() && post.isPresent()) {
                    PostFolder folder = postFolder.get();
                    Post postEntity = post.get();
                    folder.getPosts().add(postEntity);
                    postEntity.setFolder(folder);
                    postRepository.save(postEntity);
                    return postFolderRepository.save(folder);
                }
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public PostFolder removePostFromFolder(String postUUID, String username) {
        // find folder containing post
        Optional<Post> currentPost = postRepository.findByUUID(postUUID);
        PostFolder folderName = postRepository.findFolderNameByPost(currentPost.get());
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            if (loginUser.isPresent()) {
                User user = loginUser.get();
                Optional<PostFolder> postFolder = postFolderRepository.findByNameAndCreatedBy(folderName.getName(), user);
                Optional<Post> post = postRepository.findByUUID(postUUID);
                if (postFolder.isPresent() && post.isPresent()) {
                    PostFolder folder = postFolder.get();
                    Post postEntity = post.get();
                    folder.getPosts().remove(postEntity);
                    postEntity.setFolder(null);
                    postRepository.save(postEntity);
                    return postFolderRepository.save(folder);
                }
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<PostFolder> getPostFolders(String username) {
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            return loginUser.map(postFolderRepository::findByCreatedBy).orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public PostFolder createDefaultFolder(String username) {
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            if (loginUser.isPresent()) {
                User user = loginUser.get();
                Optional<PostFolder> defaultFolder =
                        postFolderRepository.findByNameAndCreatedBy("Default", user);
                if (defaultFolder.isEmpty()) {
                    PostFolder newDefaultFolder = new PostFolder();
                    newDefaultFolder.setName("Default");
                    newDefaultFolder.setCreatedBy(user);
                    newDefaultFolder.setCreatedAt(LocalDateTime.now());
                    return postFolderRepository.save(newDefaultFolder);
                }
                return defaultFolder.get();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Xóa thư mục đã tồn tại
    public Boolean deletePostFolder(String username, String folderName) {
        try {
            Optional<User> loginUser = userRepository.findByUsername(username);
            if (loginUser.isPresent()) {
                User user = loginUser.get();
                Optional<PostFolder> existingFolder = postFolderRepository.findByNameAndCreatedBy(folderName, user);
                if (!existingFolder.isEmpty()) {
                    postFolderRepository.delete(existingFolder.get());
                    return postFolderRepository.findByNameAndCreatedBy(folderName, user).isEmpty();
                }
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
