package com.minjae.blog.aiservice.api;

import com.minjae.blog.aiservice.api.dto.GenerateRequest;
import com.minjae.blog.aiservice.api.dto.GenerateResponse;
import com.minjae.blog.aiservice.service.GeneratePostService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 블로그 트러블슈팅 초안 생성을 위한 HTTP 엔드포인트.
 */
@RestController
@RequestMapping("/api/generate")
public class GenerateController {

    private final GeneratePostService generatePostService;

    public GenerateController(GeneratePostService generatePostService) {
        this.generatePostService = generatePostService;
    }

    @PostMapping
    public ResponseEntity<GenerateResponse> generate(@Valid @RequestBody GenerateRequest request) {
        GenerateResponse response = generatePostService.generate(request);
        return ResponseEntity.ok(response);
    }
}

