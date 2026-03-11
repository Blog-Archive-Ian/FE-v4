package com.minjae.blog.aiservice.repository;

import com.minjae.blog.aiservice.domain.GenerationJob;
import com.minjae.blog.aiservice.domain.SourceEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SourceEvidenceRepository extends JpaRepository<SourceEvidence, Long> {

    List<SourceEvidence> findByGenerationJob(GenerationJob generationJob);
}

