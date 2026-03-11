package com.minjae.blog.aiservice.api.dto;

/**
 * 블로그 초안 생성 결과 DTO.
 */
public class GenerateResponse {

    private String title;
    private String summary;
    private String content;
    private String[] tags;

    public GenerateResponse(String title, String summary, String content, String[] tags) {
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.tags = tags;
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

    public String[] getTags() {
        return tags;
    }
}

