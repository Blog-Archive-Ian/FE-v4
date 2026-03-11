package com.minjae.blog.aiservice.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/**
 * 블로그 초안 생성에 사용된 원본 근거를 저장하는 엔티티.
 */
@Entity
@Table(name = "source_evidence")
public class SourceEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "generation_job_id")
    private GenerationJob generationJob;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 32)
    private SourceEvidenceType type;

    @Column(name = "source_ref", length = 1_000)
    private String sourceRef;

    @Column(name = "raw_content", columnDefinition = "text")
    private String rawContent;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    protected SourceEvidence() {
        // JPA 기본 생성자
    }

    public SourceEvidence(
            GenerationJob generationJob,
            SourceEvidenceType type,
            String sourceRef,
            String rawContent
    ) {
        this.generationJob = generationJob;
        this.type = type;
        this.sourceRef = sourceRef;
        this.rawContent = rawContent;
        this.createdAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public GenerationJob getGenerationJob() {
        return generationJob;
    }

    public SourceEvidenceType getType() {
        return type;
    }

    public String getSourceRef() {
        return sourceRef;
    }

    public String getRawContent() {
        return rawContent;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}

