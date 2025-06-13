package com.socialnetwork.repository;

import com.socialnetwork.model.PostFolder.PostFolder;
import com.socialnetwork.model.news.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findByUUIDContainingIgnoreCase(String UUID, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.UUID = :UUID AND p.status <> 'HIDDEN'")
    Optional<Post> findByUUID(String UUID);

    @Query(value = "SELECT TO_CHAR(created_date_at, 'Day') as day_name, COUNT(*) as post_count " +
            "FROM post " +
            "WHERE status <> 'HIDDEN'" +
            "GROUP BY TO_CHAR(created_date_at, 'Day'), EXTRACT(DOW FROM created_date_at) " +
            "ORDER BY EXTRACT(DOW FROM created_date_at)",
            nativeQuery = true)
    List<Object[]> countPostsByDayOfWeek();

    @Query(value = """
    SELECT TO_CHAR(created_date_at, 'Day') as day_name, COUNT(*) as post_count 
    FROM post 
    WHERE created_date_at >= date_trunc('week', CURRENT_DATE)
      AND created_date_at < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
      AND status <> 'HIDDEN'
    GROUP BY TO_CHAR(created_date_at, 'Day'), EXTRACT(DOW FROM created_date_at)
    ORDER BY EXTRACT(DOW FROM created_date_at)
    """, nativeQuery = true)
    List<Object[]> countPostsByCurrentWeek();

    @Query("SELECT p.folder FROM Post p WHERE p = :post")
    PostFolder findFolderNameByPost(Post post);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.UUID = :uuid AND p.status <> 'HIDDEN'")
    Integer countPostByUser(String uuid);
}
