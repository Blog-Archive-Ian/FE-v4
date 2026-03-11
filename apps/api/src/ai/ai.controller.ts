import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateTroubleshootDraft, type GenerateTroubleshootDraftResponse } from '@blog/contracts';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import type { Request } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { AiService } from './ai.service';

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * AI 트러블슈팅 초안 생성
   * - 로그인(JWT) 필요
   * - multipart/form-data로 md 파일을 업로드 받을 수 있음
   * - githubUrl/additionalContext를 함께 전달
   */
  @UseGuards(JwtAuthGuard)
  @Post(GenerateTroubleshootDraft.path)
  @UseInterceptors(
    FileInterceptor('cursorChatLog', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = path.join(process.cwd(), 'storage', 'cursor-logs');
          ensureDir(dir);
          cb(null, dir);
        },
        filename: (req: Request, file, cb) => {
          const safeExt = path.extname(file.originalname || '') || '.md';
          const name = `cursor-log-${Date.now()}${safeExt}`;
          cb(null, name);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        if (ext && ext !== '.md') {
          cb(new BadRequestException('cursorChatLog는 .md 파일만 업로드 가능합니다.'), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    }),
  )
  async generateTroubleshootDraft(
    @Body() rawBody: Record<string, unknown>,
    @UploadedFile() cursorChatLog: Express.Multer.File | undefined,
  ): Promise<GenerateTroubleshootDraftResponse> {
    const parsed = GenerateTroubleshootDraft.Body.safeParse({
      githubUrl: rawBody.githubUrl,
      additionalContext: rawBody.additionalContext,
    });

    if (!parsed.success) {
      throw new BadRequestException({
        status: 400,
        message: '요청 파라미터가 올바르지 않습니다.',
        data: null,
      });
    }

    const cursorLogPath = cursorChatLog?.path;

    const data = await this.aiService.generateTroubleshootDraft({
      githubUrl: parsed.data.githubUrl,
      additionalContext: parsed.data.additionalContext,
      cursorLogPath,
    });

    return {
      status: 200,
      message: 'AI 초안 생성이 성공적으로 완료되었습니다.',
      data,
    };
  }
}

