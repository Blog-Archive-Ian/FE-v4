import type {
  ArchivePostResponse,
  CreatePostResponse,
  DeletePostResponse,
  GetFilteredPostListResponse,
  GetMonthPostListResponse,
  GetPopularPostListResponse,
  GetPostDetailResponse,
  IncreasePostViewResponse,
  PinPostResponse,
  UnArchivePostResponse,
  UnPinPostResponse,
  UpdatePostResponse,
} from '@blog/contracts';
import {
  ArchivePost,
  CreatePost,
  DeletePost,
  GetFilteredPostList,
  GetMonthPostList,
  GetPopularPostList,
  GetPostDetail,
  IncreasePostView,
  PinPost,
  UnArchivePost,
  UnPinPost,
  UpdatePost,
} from '@blog/contracts';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';

import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 글 목록 조회
  @Get(GetFilteredPostList.path)
  async getFilteredPostList(
    @Query() rawQuery: Record<string, unknown>,
  ): Promise<GetFilteredPostListResponse> {
    const parsed = GetFilteredPostList.Query.safeParse(rawQuery);

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 조회에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    const data = await this.postService.getPostList(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 조회되었습니다.',
      data,
    };
  }

  // 인기 글 목록 조회
  @Get(GetPopularPostList.path)
  async getPopularPostList(): Promise<GetPopularPostListResponse> {
    const data = await this.postService.getPopularPostList();

    return {
      status: 200,
      message: '인기 게시글이 성공적으로 조회되었습니다.',
      data,
    };
  }

  // 월별 게시글 작성 day 목록 조회
  @Get(GetMonthPostList.path)
  async getMonthPostList(
    @Query() rawQuery: Record<string, unknown>,
  ): Promise<GetMonthPostListResponse> {
    const parsed = GetMonthPostList.Query.safeParse({
      year: Number(rawQuery.year),
      month: Number(rawQuery.month),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        status: 400,
        message: '월별 게시글 목록 조회에 실패했습니다.',
        data: null,
      });
    }

    const data = await this.postService.getMonthPostList(parsed.data);

    return {
      status: 200,
      message: '월별 게시글 목록이 성공적으로 조회되었습니다.',
      data,
    };
  }

  // 글 상세 조회
  @Get(GetPostDetail.path(':postSeq'))
  async getPostDetail(
    @Param() rawParams: Record<string, unknown>,
  ): Promise<GetPostDetailResponse> {
    const parsed = GetPostDetail.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 상세 조회에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    const data = await this.postService.getPostDetail(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 조회되었습니다.',
      data,
    };
  }

  // 조회수 증가 (쿠키 기반 1시간 중복 방지)
  @Post(IncreasePostView.path(':postSeq'))
  async increasePostView(
    @Param() rawParams: Record<string, unknown>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IncreasePostViewResponse> {
    const parsed = IncreasePostView.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '조회수 증가에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    const postSeq = parsed.data.postSeq;
    const cookieKey = `post_view_${postSeq}`;
    const hasViewCookie = Boolean(
      (req as Request & { cookies?: Record<string, string> }).cookies?.[
        cookieKey
      ],
    );

    // 이미 1시간 이내에 조회한 경우: DB 조회수는 증가시키지 않고 현재 값만 반환
    const views = hasViewCookie
      ? await this.postService.getPostViews(parsed.data)
      : await this.postService.increasePostView(parsed.data);

    if (!hasViewCookie) {
      res.cookie(cookieKey, '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60, // 1시간
      });
    }

    return {
      status: 200,
      message: '조회수가 성공적으로 처리되었습니다.',
      data: { views },
    };
  }

  // 글 보관
  @UseGuards(JwtAuthGuard)
  @Post(ArchivePost.path(':postSeq'))
  async archivePost(
    @Param() rawParams: Record<string, unknown>,
  ): Promise<ArchivePostResponse> {
    const parsed = ArchivePost.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 보관에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    await this.postService.archivePost(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 보관되었습니다.',
      data: null,
    };
  }

  // 글 보관 해제
  @UseGuards(JwtAuthGuard)
  @Post(UnArchivePost.path(':postSeq'))
  async unarchivePost(
    @Param() rawParams: Record<string, unknown>,
  ): Promise<UnArchivePostResponse> {
    const parsed = UnArchivePost.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 보관 해제에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    await this.postService.unarchivePost(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 보관 해제되었습니다.',
      data: null,
    };
  }

  // 글 고정
  @UseGuards(JwtAuthGuard)
  @Post(PinPost.path(':postSeq'))
  async pinPost(
    @Param() rawParams: Record<string, unknown>,
  ): Promise<PinPostResponse> {
    const parsed = PinPost.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 고정에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    await this.postService.pinPost(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 고정되었습니다.',
      data: null,
    };
  }

  // 글 고정 해제
  @UseGuards(JwtAuthGuard)
  @Post(UnPinPost.path(':postSeq'))
  async unpinPost(
    @Param() rawParams: Record<string, unknown>,
  ): Promise<UnPinPostResponse> {
    const parsed = UnPinPost.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 고정 해제에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    await this.postService.unpinPost(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 고정 해제되었습니다.',
      data: null,
    };
  }

  // 글 작성
  @UseGuards(JwtAuthGuard)
  @Post(CreatePost.path)
  async createPost(
    @User('userId') userId: string,
    @Body() rawBody: unknown,
  ): Promise<CreatePostResponse> {
    const parsed = CreatePost.Body.safeParse(rawBody);

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 생성에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    const data = await this.postService.createPost(parsed.data, userId);

    return {
      status: 200,
      message: '게시글이 성공적으로 생성되었습니다.',
      data,
    };
  }

  // 글 수정
  @UseGuards(JwtAuthGuard)
  @Put(UpdatePost.path(':postSeq'))
  async updatePost(
    @User('userId') userId: string,
    @Param() rawParams: Record<string, unknown>,
    @Body() rawBody: unknown,
  ): Promise<UpdatePostResponse> {
    const parsedParams = UpdatePost.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });
    const parsedBody = UpdatePost.Body.safeParse(rawBody);

    if (!parsedParams.success || !parsedBody.success) {
      throw new BadRequestException({
        message: '게시글 수정에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    await this.postService.updatePost(
      parsedParams.data,
      parsedBody.data,
      userId,
    );

    return {
      status: 200,
      message: '게시글이 성공적으로 수정되었습니다.',
      data: null,
    };
  }

  // 글 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(DeletePost.path(':postSeq'))
  async deletePost(
    @Param() rawParams: Record<string, unknown>,
  ): Promise<DeletePostResponse> {
    const parsed = DeletePost.Params.safeParse({
      postSeq: Number(rawParams.postSeq),
    });

    if (!parsed.success) {
      throw new BadRequestException({
        message: '게시글 삭제에 실패했습니다.',
        status: 500,
        data: null,
      });
    }

    await this.postService.deletePost(parsed.data);

    return {
      status: 200,
      message: '게시글이 성공적으로 삭제되었습니다.',
      data: null,
    };
  }
}
