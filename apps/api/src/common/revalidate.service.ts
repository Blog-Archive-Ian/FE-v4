import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RevalidateService {
  private readonly logger = new Logger(RevalidateService.name);

  private readonly webUrl = process.env.FRONT_URL;
  private readonly secret = process.env.REVALIDATE_SECRET;

  async revalidateTags(tags: string[]) {
    if (!tags.length) return;

    if (!this.webUrl || !this.secret) {
      this.logger.warn(
        'Revalidate skipped: FRONT_URL or REVALIDATE_SECRET missing',
      );
      return;
    }

    const url = `${this.webUrl}/api/revalidate`;

    try {
      this.logger.log(`[revalidate] POST ${url} tags=${JSON.stringify(tags)}`);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-revalidate-secret': this.secret,
        },
        body: JSON.stringify({ tags }),
      });

      const body = await res.text().catch(() => '');

      if (!res.ok) {
        this.logger.warn(
          `[revalidate] FAILED status=${res.status} body=${body}`,
        );
        return;
      }

      this.logger.log(`[revalidate] OK status=${res.status} body=${body}`);
    } catch (err) {
      // revalidate 실패해도 글 수정은 성공해야 함
      this.logger.error('[revalidate] ERROR', err as any);
    }
  }
}
