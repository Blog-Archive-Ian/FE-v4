import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RevalidateService {
  private readonly logger = new Logger(RevalidateService.name);

  private readonly webUrl = process.env.WEB_URL;
  private readonly secret = process.env.REVALIDATE_SECRET;

  async revalidateTags(tags: string[]) {
    if (!this.webUrl || !this.secret) {
      this.logger.warn(
        'Revalidate skipped: WEB_URL or REVALIDATE_SECRET missing',
      );
      return;
    }

    try {
      const res = await fetch(`${this.webUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-revalidate-secret': this.secret,
        },
        body: JSON.stringify({ tags }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        this.logger.warn(`Revalidate failed: ${res.status} ${text}`);
      }

      this.logger.log(`Revalidated tags: ${tags.join(', ')}`);
    } catch (err) {
      // revalidate 실패해도 글 수정은 성공해야 함
      this.logger.error('Revalidate failed', err);
    }
  }
}
