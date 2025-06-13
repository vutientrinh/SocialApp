package com.socialnetwork.repository;

import com.socialnetwork.model.news.Image;
import com.socialnetwork.model.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, String> {

    @Query("SELECT i FROM Image i WHERE i.UUID = ?1")
    Optional<Image> fileByUUID(String uuid);

    @Query("SELECT i FROM Image i WHERE i.createdBy = ?1")
    List<Image> findAllByCreatedBy(User user);

    @Transactional
    @Modifying
    @Query("DELETE FROM Image i WHERE i.content.UUID = :contentUUID")
    void deleteAllImagesByContentUUID(String contentUUID);
}
