package com.socialnetwork.repository;

import com.socialnetwork.model.news.Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository extends JpaRepository<Content, String> {
}
