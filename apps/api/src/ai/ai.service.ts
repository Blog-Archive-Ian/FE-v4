import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  constructor(private readonly config: ConfigService) {}

  async generateTroubleshootDraft(
    payload: AiServiceGeneratePayload,
  ): Promise<AiServiceGenerateResponse> {
    const baseUrl = this.config.get<string>('AI_SERVICE_URL');
    if (!baseUrl) {
      throw new ServiceUnavailableException('AI_SERVICE_URL이 설정되어 있지 않습니다.');
    }

    const url = `${baseUrl.replace(/\/$/, '')}/api/generate`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      throw new ServiceUnavailableException(
        `AI 서비스 호출에 실패했습니다: ${String(err)}`,
      );
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new ServiceUnavailableException(
        `AI 서비스 응답이 실패했습니다: status=${res.status} body=${body}`,
      );
    }

    const json = (await res.json().catch(() => null)) as
      | AiServiceGenerateResponse
      | null;

    if (!json) {
      throw new ServiceUnavailableException('AI 서비스 응답 파싱에 실패했습니다.');
    }

    return json;
  }
}

