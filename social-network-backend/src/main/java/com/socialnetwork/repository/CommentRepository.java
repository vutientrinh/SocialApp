package com.socialnetwork.repository;

import com.socialnetwork.model.news.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, String> {
}
