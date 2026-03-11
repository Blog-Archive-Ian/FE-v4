package com.minjae.blog.aiservice.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/**
 * 하나의 블로그 초안 생성 요청을 나타내는 엔티티.
 */
@Entity
@Table(name = "generation_job")
public class GenerationJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "github_url", nullable = false, length = 1_000)
    private String githubUrl;

    @Column(name = "cursor_log_path", length = 2_000)
    private String cursorLogPath;

    @Column(name = "additional_context", columnDefinition = "text")
    private String additionalContext;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private GenerationJobStatus status = GenerationJobStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "result_content", columnDefinition = "text")
    private String resultContent;

    protected GenerationJob() {
        // JPA 기본 생성자
    }

    public GenerationJob(String githubUrl, String cursorLogPath, String additionalContext) {
        this.githubUrl = githubUrl;
        this.cursorLogPath = cursorLogPath;
        this.additionalContext = additionalContext;
        this.status = GenerationJobStatus.PENDING;
        this.createdAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getCursorLogPath() {
        return cursorLogPath;
    }

    public String getAdditionalContext() {
        return additionalContext;
    }

    public GenerationJobStatus getStatus() {
        return status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public String getResultContent() {
        return resultContent;
    }

    public void markProcessing() {
        this.status = GenerationJobStatus.PROCESSING;
    }

    public void markCompleted(String resultContent) {
        this.status = GenerationJobStatus.COMPLETED;
        this.resultContent = resultContent;
    }

    public void markFailed() {
        this.status = GenerationJobStatus.FAILED;
    }
}

