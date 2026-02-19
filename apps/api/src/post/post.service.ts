import {
  ArchivePost,
  type ArchivePostParams,
  CacheTags,
  CreatePost,
  type CreatePostBody,
  DeletePost,
  type DeletePostParams,
  type GetFilteredPostListData,
  type GetFilteredPostListQuery,
  type GetMonthPostListQuery,
  type GetPopularPostListData,
  type GetPostDetailData,
  type GetPostDetailParams,
  PinPost,
  type PinPostParams,
  UnArchivePost,
  type UnArchivePostParams,
  UnPinPost,
  type UnPinPostParams,
  UpdatePost,
  type UpdatePostBody,
  type UpdatePostParams,
} from '@blog/contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RevalidateService } from 'src/common/revalidate.service';

import { PrismaService } from '../prisma/prisma.service';
import { PostMapper } from './post.mapper';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PostMapper,
    private readonly revalidate: RevalidateService,
  ) {}

  // 글 목록 조회
  async getPostList(
    query: GetFilteredPostListQuery,
  ): Promise<GetFilteredPostListData> {
    const page = query.page ?? 1;
    const size = query.size ?? 10;
    const skip = (page - 1) * size;
    const take = size;

    const where = {
      ...(query.archived !== undefined ? { is_archived: query.archived } : {}),
      ...(query.pinned !== undefined ? { is_pinned: query.pinned } : {}),
      ...(query.category ? { category: { name: query.category } } : {}),
      ...(query.tag
        ? { post_tag: { some: { tag: { name: query.tag } } } }
        : {}),
    } as const;

    const [totalCount, rows] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take,
        include: {
          category: true,
          user: true,
        },
      }),
    ]);

    // tags 별도 조회
    const postSeqs = rows.map((r) => r.post_seq);

    const postTags = await this.prisma.post_tag.findMany({
      where: {
        post_seq: { in: postSeqs },
      },
      include: {
        tag: true,
      },
    });

    // post_seq(string) -> tags[]
    const tagMap = new Map<string, string[]>();
    for (const pt of postTags) {
      const key = pt.post_seq.toString();
      const arr = tagMap.get(key) ?? [];
      if (pt.tag?.name) arr.push(pt.tag.name);
      tagMap.set(key, arr);
    }

    const posts = rows.map((row) =>
      this.mapper.toContract(row, tagMap.get(row.post_seq.toString()) ?? []),
    );

    return {
      posts,
      totalCount,
    };
  }

  // 글 보관
  async archivePost(params: ArchivePostParams) {
    const updated = await this.prisma.post.updateMany({
      where: { post_seq: BigInt(params.postSeq) },
      data: { is_archived: true },
    });

    if (updated.count === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    await this.revalidate.revalidateTags(
      ArchivePost.revalidate(params.postSeq),
    );
  }

  // 글 보관 해제
  async unarchivePost(params: UnArchivePostParams) {
    const updated = await this.prisma.post.updateMany({
      where: { post_seq: BigInt(params.postSeq) },
      data: { is_archived: false },
    });

    if (updated.count === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    await this.revalidate.revalidateTags(
      UnArchivePost.revalidate(params.postSeq),
    );
  }

  // 글 고정
  async pinPost(params: PinPostParams) {
    const updated = await this.prisma.post.updateMany({
      where: { post_seq: BigInt(params.postSeq) },
      data: { is_pinned: true },
    });

    if (updated.count === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    await this.revalidate.revalidateTags(PinPost.revalidate(params.postSeq));
  }

  // 글 고정 해제
  async unpinPost(params: UnPinPostParams) {
    const updated = await this.prisma.post.updateMany({
      where: { post_seq: BigInt(params.postSeq) },
      data: { is_pinned: false },
    });

    if (updated.count === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    await this.revalidate.revalidateTags(UnPinPost.revalidate(params.postSeq));
  }

  async createPost(
    body: CreatePostBody,
    userId: string,
  ): Promise<{ postSeq: number }> {
    const categoryId = await this.resolveCategoryId(body.category, userId);

    const created = await this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        category_id: categoryId,
        user_id: userId,
        views: 0,
        created_at: new Date(),
        is_pinned: false,
        is_archived: false,
      },
      select: { post_seq: true },
    });

    await this.replacePostTags(created.post_seq, body.tags, userId);

    const postSeq = Number(created.post_seq);
    await this.revalidate.revalidateTags([
      ...CreatePost.revalidate(),
      CacheTags.Post.byId(postSeq),
    ]);

    return { postSeq: Number(created.post_seq) };
  }

  async updatePost(
    params: UpdatePostParams,
    body: UpdatePostBody,
    userId: string,
  ): Promise<void> {
    const postSeq = BigInt(params.postSeq);

    const exists = await this.prisma.post.findUnique({
      where: { post_seq: postSeq },
      select: { post_seq: true },
    });
    if (!exists) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    const categoryId = await this.resolveCategoryId(body.category, userId);

    await this.prisma.post.update({
      where: { post_seq: postSeq },
      data: {
        title: body.title,
        content: body.content,
        category_id: categoryId,
      },
    });

    await this.replacePostTags(postSeq, body.tags, userId);
    await this.revalidate.revalidateTags(UpdatePost.revalidate(params.postSeq));
  }

  // 글 삭제
  async deletePost(params: DeletePostParams) {
    const deleted = await this.prisma.post.deleteMany({
      where: { post_seq: BigInt(params.postSeq) },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    await this.revalidate.revalidateTags(DeletePost.revalidate(params.postSeq));
  }

  // 글 상세 조회
  async getPostDetail(params: GetPostDetailParams): Promise<GetPostDetailData> {
    const postSeq = BigInt(params.postSeq);

    const row = await this.prisma.post.findUnique({
      where: { post_seq: postSeq },
      include: {
        category: true,
        user: true,
      },
    });

    if (!row) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const postTags = await this.prisma.post_tag.findMany({
      where: { post_seq: postSeq },
      include: { tag: true },
    });

    const tags = postTags.map((pt) => pt.tag?.name).filter(Boolean) as string[];

    return this.mapper.toContract(row, tags);
  }

  private async resolveCategoryId(
    categoryName: string,
    userId: string | null,
  ): Promise<bigint> {
    const found = await this.prisma.category.findFirst({
      where: {
        name: categoryName,
        ...(userId ? { user_id: userId } : {}),
      },
      select: { category_id: true },
    });
    if (found) return found.category_id;

    const created = await this.prisma.category.create({
      data: { name: categoryName, user_id: userId },
      select: { category_id: true },
    });
    return created.category_id;
  }

  private async replacePostTags(
    postSeq: bigint,
    tagNames: string[],
    userId: string | null,
  ) {
    await this.prisma.post_tag.deleteMany({ where: { post_seq: postSeq } });

    if (!tagNames?.length) return;

    const tags = await Promise.all(
      tagNames.map((name) =>
        this.prisma.tag.upsert({
          where: {
            user_id_name: { user_id: userId!, name },
          },
          update: {},
          create: { name, user_id: userId },
          select: { id: true },
        }),
      ),
    );

    await this.prisma.post_tag.createMany({
      data: tags.map((t) => ({
        post_seq: postSeq,
        tag_id: t.id,
      })),
      skipDuplicates: true,
    });
  }

  // 인기 글 목록 조회
  async getPopularPostList(): Promise<GetPopularPostListData> {
    const rows = await this.prisma.post.findMany({
      orderBy: [{ views: 'desc' }, { created_at: 'desc' }],
      take: 10,
      include: {
        category: true,
        user: true,
      },
    });

    const postSeqs = rows.map((r) => r.post_seq);

    const postTags = await this.prisma.post_tag.findMany({
      where: { post_seq: { in: postSeqs } },
      include: { tag: true },
    });

    const tagMap = new Map<string, string[]>();
    for (const pt of postTags) {
      const key = pt.post_seq.toString();
      const arr = tagMap.get(key) ?? [];
      if (pt.tag?.name) arr.push(pt.tag.name);
      tagMap.set(key, arr);
    }

    return rows.map((row) =>
      this.mapper.toContract(row, tagMap.get(row.post_seq.toString()) ?? []),
    );
  }

  // 월별 게시글 작성 day 목록 조회
  async getMonthPostList(query: GetMonthPostListQuery): Promise<number[]> {
    const start = new Date(query.year, query.month - 1, 1); // inclusive
    const end = new Date(query.year, query.month, 1); // exclusive

    const rows = await this.prisma.post.findMany({
      where: {
        created_at: {
          gte: start,
          lt: end,
        },
      },
      select: {
        created_at: true,
      },
    });

    const daySet = new Set<number>();
    for (const r of rows) {
      daySet.add(r.created_at!.getDate());
    }

    return Array.from(daySet).sort((a, b) => a - b);
  }
}
