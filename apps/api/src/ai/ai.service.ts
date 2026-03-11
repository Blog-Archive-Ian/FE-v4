import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';

type AiServiceGeneratePayload = {
  githubUrl: string;
  additionalContext?: string;
  cursorLogPath?: string;
};

@Injectable()
export class AiService {
  constructor() {}

  async generateTroubleshootDraft(
    payload: AiServiceGeneratePayload,
  ): Promise<{ draftId: string }> {
    // NOTE: 아직 배포 환경에서 ai-service가 붙지 않았으므로 목 응답으로 처리
    // 나중에 실제 연동을 붙일 때 AI_SERVICE_URL을 다시 추가하고 fetch 호출을 활성화하면 됨.
    void payload;

    const draftId = randomUUID();

    return { draftId };
  }

  buildMockDraft(draftId: string) {
    return {
      draftId,
      title: `Draft: ${draftId}`,
      summary: 'AI 서비스 연동 전까지는 mock 초안 데이터를 반환합니다.',
      tags: ['ai', 'troubleshooting', 'draft'],
      content: [
        '# Problem Situation',
        '',
        '(AI 서비스 연동 전까지는 mock 콘텐츠를 사용합니다.)',
        '',
      ].join('\n'),
    };
  }
}

