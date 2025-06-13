package com.socialnetwork.repository;

import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.news.Reaction;
import com.socialnetwork.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, String> {

    @Query("SELECT r FROM Reaction r WHERE r.post = ?1 AND r.createdBy = ?2")
    Optional<Reaction> findByPostAndCreatedBy(Post post, User user);

    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post = ?1 AND r.reactionType = 'LIKE'")
    Integer countLikeByPost(Post post);

    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post = ?1 AND r.reactionType = 'LOVE'")
    Integer countDislikeByPost(Post post);

    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post = ?1 AND r.reactionType = 'HAHA'")
    Integer countHahaByPost(Post post);

    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post = ?1 AND r.reactionType = 'WOW'")
    Integer countWowByPost(Post post);

    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post = ?1 AND r.reactionType = 'SAD'")
    Integer countSadByPost(Post post);

    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post = ?1 AND r.reactionType = 'ANGRY'")
    Integer countAngryByPost(Post post);

    @Query("SELECT r.createdBy FROM Reaction r WHERE r.post = ?1 AND r.createdBy = ?2")
    Optional<User> checkUserReaction(Post post, User user);

    @Query("SELECT r.reactionType FROM Reaction r WHERE r.createdBy = ?1 AND r.post = ?2")
    String getReactionByUserAndPost(User user, Post post);

}
