package com.socialnetwork.repository;

import com.socialnetwork.model.PostFolder.PostFolder;
import com.socialnetwork.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostFolderRepository extends JpaRepository<PostFolder,String> {

    @Query("SELECT pf FROM PostFolder pf WHERE pf.createdBy = ?1")
    List<PostFolder> findByCreatedBy(User user);

    @Query("SELECT pf FROM PostFolder pf WHERE pf.name = ?1 AND pf.createdBy = ?2")
    Optional<PostFolder> findByNameAndCreatedBy(String name, User user);
}
