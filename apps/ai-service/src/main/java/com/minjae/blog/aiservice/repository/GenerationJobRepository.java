package com.minjae.blog.aiservice.repository;

import com.minjae.blog.aiservice.domain.GenerationJob;
import com.minjae.blog.aiservice.domain.GenerationJobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GenerationJobRepository extends JpaRepository<GenerationJob, Long> {

    List<GenerationJob> findTop10ByStatusOrderByCreatedAtAsc(GenerationJobStatus status);
}

