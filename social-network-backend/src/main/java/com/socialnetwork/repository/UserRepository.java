package com.socialnetwork.repository;

import com.socialnetwork.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    @Query("SELECT u FROM User u WHERE u.UUID = ?1")
    Optional<User> findByUUID(String uuid);

    @Query("SELECT u FROM User u WHERE u.username = ?1")
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> existsByEmail(String email);

    Page<User> findByUsernameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findUsersByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = ?1 AND u.isActive = true")
    Optional<User> getActiveUserByUserName(String username);

    @Query("SELECT u FROM User u WHERE u.isActive = true")
    Optional<List<User>> getActiveUser();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    Integer getActiveUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = false ")
    Integer getInActiveUsers();
}
