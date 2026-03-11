package com.minjae.blog.aiservice.service;

import com.minjae.blog.aiservice.api.dto.GenerateRequest;
import com.minjae.blog.aiservice.api.dto.GenerateResponse;
import com.minjae.blog.aiservice.domain.GenerationJob;
import com.minjae.blog.aiservice.repository.GenerationJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 블로그 초안 생성 파이프라인을 오케스트레이션하는 서비스.
 * 현재는 최소 스켈레톤으로, 이후 AI 파이프라인/에이전트 호출 로직이 여기에 추가된다.
 */
@Service
public class GeneratePostService {

    private final GenerationJobRepository generationJobRepository;

    public GeneratePostService(GenerationJobRepository generationJobRepository) {
        this.generationJobRepository = generationJobRepository;
    }

    @Transactional
    public GenerateResponse generate(GenerateRequest request) {
        // 1) Job 생성 및 저장
        GenerationJob job = new GenerationJob(
                request.getGithubUrl(),
                request.getCursorLogPath(),
                request.getAdditionalContext()
        );
        generationJobRepository.save(job);

        // TODO: 2) GitHub 데이터 수집 + Cursor 로그 파싱 + AI 파이프라인 호출 로직 추가
        // 지금은 최소 동작을 위해 더미 응답을 반환한다.

        String dummyTitle = "Draft: " + request.getGithubUrl();
        String dummySummary = "This is a placeholder summary. AI pipeline is not implemented yet.";
        String dummyContent = """
                # Problem Situation
                
                (자동 생성 파이프라인 구현 전까지는 더미 콘텐츠를 사용합니다.)
                """;
        String[] dummyTags = new String[] {"ai", "troubleshooting", "draft"};

        // Job 결과 내용 임시 저장
        job.markCompleted(dummyContent);

        return new GenerateResponse(dummyTitle, dummySummary, dummyContent, dummyTags);
    }
}

