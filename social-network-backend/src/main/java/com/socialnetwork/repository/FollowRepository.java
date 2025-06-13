package com.socialnetwork.repository;

import com.socialnetwork.model.relationship.Follow;
import com.socialnetwork.model.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, String> {

    @Query("SELECT f FROM Follow f WHERE f.following = ?1 AND f.follower = ?2")
    Follow findByFollowingAndFollower(User following, User follower);

    @Query("SELECT f FROM Follow f WHERE f.following = ?1 AND f.follower = ?2")
    Optional<Follow> isFollow(User following, User follower);

    @Query("SELECT f.following FROM Follow f WHERE f.follower = ?1")
    List<User> findAllFollowing(User follower);

    @Query("SELECT u FROM User u WHERE u NOT IN (SELECT f.following FROM Follow f WHERE f.follower = :follower) AND u <> :follower")
    List<User> findAllNotFollowing(@Param("follower") User follower);


    @Modifying
    @Transactional
    @Query("DELETE FROM Follow f WHERE f.following.UUID = :followingUuid AND f.follower.UUID = :followerUuid")
    void deleteFollow(@Param("followingUuid") String followingUuid, @Param("followerUuid") String followerUuid);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower = ?1")
    Integer countFollowing(User user);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.following = ?1")
    Integer countFollowers(User user);
}
