import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  GenerateTroubleshootDraft,
  type GenerateTroubleshootDraftResponse,
} from '@blog/contracts';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
          void req;
          void file;
          const dir = path.join(process.cwd(), 'storage', 'cursor-logs');
          ensureDir(dir);
          cb(null, dir);
        },
        filename: (req: Request, file, cb) => {
          void req;
          const safeExt = path.extname(file.originalname || '') || '.md';
          const name = `cursor-log-${Date.now()}${safeExt}`;
          cb(null, name);
        },
      }),
      fileFilter: (req, file, cb) => {
        void req;
        const ext = path.extname(file.originalname || '').toLowerCase();
        if (ext && ext !== '.md') {
          cb(
            new BadRequestException(
              'cursorChatLog는 .md 파일만 업로드 가능합니다.',
            ),
            false,
          );
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

  @UseGuards(JwtAuthGuard)
  @Get('/ai/drafts/:draftId')
  async getDraft(
    @Param('draftId') draftId: string,
  ): Promise<{
    status: number;
    message: string;
    data: {
      draftId: string;
      title: string;
      summary: string;
      tags: string[];
      content: string;
    } | null;
  }> {
    if (!draftId) {
      throw new BadRequestException({
        status: 400,
        message: 'draftId가 필요합니다.',
        data: null,
      });
    }

    // NOTE: 아직 DB/AI 서비스가 붙지 않았으므로
    // 넘어온 draftId를 그대로 사용해서 목 데이터를 구성해 반환한다.
    const draft = this.aiService.buildMockDraft(draftId);

    return {
      status: 200,
      message: '초안이 성공적으로 조회되었습니다.',
      data: draft,
    };
  }
}
