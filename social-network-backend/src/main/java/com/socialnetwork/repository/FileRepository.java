package com.socialnetwork.repository;

import com.socialnetwork.model.resource.MediaResources;
import com.socialnetwork.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FileRepository extends JpaRepository<MediaResources, String> {
    @Query("SELECT f FROM MediaResources f WHERE f.UUID = ?1")
    MediaResources findFileByUUID(String uuid);

    @Query("SELECT f FROM MediaResources f WHERE f.createdBy = ?1")
    List<MediaResources> findAllByCreatedBy(User user);

    @Query("SELECT f.UUID FROM MediaResources f WHERE f.fileName = ?1")
    String getFileUUIDByFileName(String fileName);
}
