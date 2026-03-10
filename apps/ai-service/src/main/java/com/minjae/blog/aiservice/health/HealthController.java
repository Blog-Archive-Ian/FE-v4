package com.minjae.blog.aiservice.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 간단한 헬스 체크용 엔드포인트.
 * 추후 AI 파이프라인/Job 상태 등을 노출하는 API로 확장할 수 있다.
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ai-service ok");
    }
}

