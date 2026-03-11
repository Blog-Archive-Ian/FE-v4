package com.minjae.blog.aiservice.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/**
 * 생성된 블로그 초안을 저장하는 엔티티.
 */
@Entity
@Table(name = "generated_post")
public class GeneratedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "summary", length = 2_000)
    private String summary;

    @Column(name = "content", columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "tags", length = 1_000)
    private String tags; // "tag1,tag2,tag3" 형태로 보관

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    protected GeneratedPost() {
        // JPA 기본 생성자
    }

    public GeneratedPost(String title, String summary, String content, String tags) {
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.tags = tags;
        this.createdAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public String getContent() {
        return content;
    }

    public String getTags() {
        return tags;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}

