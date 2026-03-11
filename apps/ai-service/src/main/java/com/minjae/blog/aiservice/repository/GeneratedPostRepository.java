package com.minjae.blog.aiservice.repository;

import com.minjae.blog.aiservice.domain.GeneratedPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratedPostRepository extends JpaRepository<GeneratedPost, Long> {
}

