import { Injectable } from '@nestjs/common';

type AiServiceGeneratePayload = {
  githubUrl: string;
  additionalContext?: string;
  cursorLogPath?: string;
};

type AiServiceGenerateResponse = {
  title: string;
  summary: string;
  tags: string[];
  content: string;
};

@Injectable()
export class AiService {
  constructor() {}

  async generateTroubleshootDraft(
    payload: AiServiceGeneratePayload,
  ): Promise<AiServiceGenerateResponse> {
    // NOTE: 아직 배포 환경에서 ai-service가 붙지 않았으므로 목 응답으로 처리
    // 나중에 실제 연동을 붙일 때 AI_SERVICE_URL을 다시 추가하고 fetch 호출을 활성화하면 됨.
    void payload;

    return {
      title: 'Draft: (mock)',
      summary: 'AI 서비스 연동 전까지는 mock 응답을 반환합니다.',
      tags: ['ai', 'troubleshooting', 'mock'],
      content: [
        '# Problem Situation',
        '',
        '(AI 서비스 연동 전까지는 mock 콘텐츠를 사용합니다.)',
        '',
      ].join('\n'),
    };
  }
}

