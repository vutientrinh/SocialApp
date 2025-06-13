package com.socialnetwork.repository;

import com.socialnetwork.model.relationship.Friend;
import com.socialnetwork.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, String> {

    @Query("SELECT f FROM Friend f " +
            "WHERE (f.user.UUID = ?1 AND f.friend.UUID = ?2) " +
            "OR (f.user.UUID = ?2 AND f.friend.UUID = ?1)")
    List<Friend> findFriendships(String userUUID1, String userUUID2);


    @Query("SELECT f FROM Friend f WHERE f.user = ?1")
    List<Friend> getAllRelationshipOfUser(User user);

    @Query("SELECT f.friend FROM Friend f WHERE f.user = ?1")
    List<User> getAllFriendOfUser(User user);
}
