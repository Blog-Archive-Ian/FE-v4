package com.minjae.blog.aiservice.api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * 블로그 초안 생성을 위한 요청 DTO.
 */
public class GenerateRequest {

    @NotBlank(message = "githubUrl은 필수입니다.")
    private String githubUrl;

    private String additionalContext;

    /**
     * Cursor 대화 로그 파일이 저장된 경로 (선택).
     * 실제 업로드/저장은 상위 시스템(Nest API)에서 처리하고,
     * ai-service에는 경로나 식별자만 내려주는 방식으로 사용한다.
     */
    private String cursorLogPath;

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getAdditionalContext() {
        return additionalContext;
    }

    public void setAdditionalContext(String additionalContext) {
        this.additionalContext = additionalContext;
    }

    public String getCursorLogPath() {
        return cursorLogPath;
    }

    public void setCursorLogPath(String cursorLogPath) {
        this.cursorLogPath = cursorLogPath;
    }
}

