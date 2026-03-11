package com.minjae.blog.aiservice.domain;

/**
 * 블로그 생성 작업의 현재 상태.
 */
public enum GenerationJobStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED
}

