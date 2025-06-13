package com.socialnetwork.service;

import com.socialnetwork.dtos.Requests.ReactionPost;
import com.socialnetwork.model.enums.EReaction;
import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.news.Reaction;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.PostRepository;
import com.socialnetwork.repository.ReactionRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ReactionService {

    @Resource
    private ReactionRepository reactionRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private PostRepository postRepository;

    public void createReaction(String createdBy, ReactionPost reactionPost) {
        Optional<Post> postOptional = postRepository.findByUUID(reactionPost.getPostUUID());
        Optional<User> userOptional = userRepository.findByUsername(createdBy);

        if (postOptional.isPresent() && userOptional.isPresent()) {
            Post post = postOptional.get();
            User user = userOptional.get();
            String reactionType = reactionPost.getReactionType();
            EReaction eReaction = EReaction.valueOf(reactionType);

            // Check if the user has already reacted to this post
            Optional<Reaction> existingReactionOptional = reactionRepository.findByPostAndCreatedBy(post, user);

            if (existingReactionOptional.isPresent()) {
                // Update the existing reaction
                Reaction existingReaction = existingReactionOptional.get();
                existingReaction.setReactionType(eReaction);
                existingReaction.setLastModifiedDate(LocalDateTime.now());
                existingReaction.setCreatedBy(user);
                existingReaction.setLastModifiedBy(user.getUsername());
                reactionRepository.save(existingReaction);
            } else {
                // Create a new reaction
                Reaction reaction = new Reaction();
                reaction.setPost(post);
                reaction.setReactionType(eReaction);
                reaction.setCreatedAt(LocalDateTime.now());
                reaction.setCreatedBy(user);
                reaction.setLastModifiedBy(user.getUsername());
                reaction.setLastModifiedDate(LocalDateTime.now());
                reactionRepository.save(reaction);

                // Update the post with the new reaction
                post.getReactions().add(reaction);
                postRepository.save(post);
            }
            // Push notification

        } else {
            throw new IllegalArgumentException("Post or user not found");
        }
    }

    public void removeReactionPost(String createdBy, ReactionPost reactionPost) {
        Optional<Post> postOptional = postRepository.findByUUID(reactionPost.getPostUUID());
        Optional<User> userOptional = userRepository.findByUsername(createdBy);

        if (postOptional.isPresent() && userOptional.isPresent()) {
            Post post = postOptional.get();
            User user = userOptional.get();

            // Check if the user has already reacted to this post
            Optional<Reaction> existingReactionOptional = reactionRepository.findByPostAndCreatedBy(post, user);
            if (existingReactionOptional.isPresent()) {
                Reaction existingReaction = existingReactionOptional.get();
                reactionRepository.delete(existingReaction);
                post.getReactions().remove(existingReaction);
                postRepository.save(post);
            }
        }
    }

    public Map<String, Integer> getReactionCount(String postUUID){
        Optional<Post> currentPost = postRepository.findByUUID(postUUID);
        HashMap<String, Integer> reactionCount = new HashMap<>();
        if (currentPost.isPresent()){
            Post post = currentPost.get();
            reactionCount.put("countLike", reactionRepository.countLikeByPost(post));
            reactionCount.put("countLove", reactionRepository.countDislikeByPost(post));
            reactionCount.put("countHaha", reactionRepository.countHahaByPost(post));
            reactionCount.put("countWow", reactionRepository.countWowByPost(post));
            reactionCount.put("countSad", reactionRepository.countSadByPost(post));
            reactionCount.put("countAngry", reactionRepository.countAngryByPost(post));
        }
        return reactionCount;
    }

    public Map<String, String> checkUserReaction(String username, String postUUID){
        Optional<Post> currentPost = postRepository.findByUUID(postUUID);
        Optional<User> currentUser = userRepository.findByUsername(username);
        Map<String, String> result = new HashMap<>();
        if (currentPost.isPresent() && currentUser.isPresent()){
            Post post = currentPost.get();
            User user = currentUser.get();
            Optional<User> userReaction = reactionRepository.checkUserReaction(post, user);
            String reactionType = reactionRepository.getReactionByUserAndPost(user, post);
            result.put("isReact", String.valueOf(userReaction.isPresent()));
            result.put("reactionType", reactionType == null ? "default" : reactionType);
        }
        return result;
    }

}
