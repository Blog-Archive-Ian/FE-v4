# Blog Web

**🌐 Live Service** [Visit the Blog](https://blog.minjae-dev.com)

Next.js App Router 기반 SEO 중심 블로그 애플리케이션입니다.  
SSR + Tag 기반 캐시 전략 + Contract 공유 구조를 중심으로 설계되었습니다.

## 1. Project Overview

이 애플리케이션은 단순한 블로그 UI 구현이 아니라,  
SEO 중심의 SSR 기반 웹 아키텍처를 설계하고 운영 전략까지 고려한 프로젝트입니다.

Web은 사용자 트래픽을 처리하는 공개 서비스이며,  
Back Office와 API와는 물리적으로 분리된 배포 단위로 운영됩니다.

### 🎯 설계 목표

- SEO 중심 SSR 전략 적용 (모든 페이지 Server Rendering)
- 관리자 시스템과 사용자 서비스의 런타임 분리
- Tag 기반 선택적 캐시 무효화 설계
- Contract 기반 타입 일관성 유지
- 서버 비용을 고려한 Next.js Cache 전략 설계

## 2. Core Features

- 최신 글 목록
- 인기 글 목록
- 고정(Pinned) 글
- 카테고리 / 태그 기반 필터 조회
- 월별 게시글 아카이브 조회
- 게시글 상세 조회
- 댓글 시스템 (Utterances 기반 GitHub 연동)

모든 페이지는 **Server Component 기반 SSR 구조**로 구현되었습니다.

## 3. Performance & SEO

초기 진입 페이지 Lighthouse 기준

- **Performance: 100**
- **Accessibility: 96**
- **Best Practices: 100**
- **SEO: 100**

### 🚀 SEO 전략

- App Router 기반 SSR 적용
- 정적 메타데이터 생성
- 검색엔진 친화적 URL 구조
- no-store 대신 Tag 기반 Cache 전략 사용

## 4. Rendering & Cache Strategy

Next.js App Router의 `fetch cache` 기능을 활용하여

- `revalidate` + `tags` 기반 캐싱
- 도메인 단위 + ID 단위 Tag 설계
- 전체 no-store 전략 대신 선택적 무효화 적용

```ts
next: {
  revalidate: 5 * 60,
  tags: [CacheTags.Post.detail, CacheTags.Post.byId(params.postSeq)],
}
```

### 💡 왜 no-store를 쓰지 않았는가?

- 모든 요청을 서버에서 처리하면 비용 증가
- 캐시를 유지하면서 최신성만 부분 갱신하는 전략이 필요
- SEO 성능과 서버 비용을 동시에 고려

👉 결과적으로 서버 부하를 줄이면서도 콘텐츠 수정 시 즉시 반영되는 구조를 설계했습니다.

## 4.1 Cache Invalidation Pipeline

BO에서 데이터 수정이 발생하면  
API 서버가 Web의 `/api/revalidate` 엔드포인트를 호출합니다.

Web 런타임 내부에서만 `revalidateTag` / `revalidatePath`가 유효하므로,  
캐시 소유권은 Web이 명확히 보유합니다.

```ts
for (const tag of tags) revalidateTag(tag, 'max')
for (const path of paths) revalidatePath(path)
```

### 설계 포인트

- 캐시 소유권을 Web 런타임으로 한정
- 전체 no-store 전략 대신 선택적 갱신
- Tag 규칙은 contracts 계층에서 공유

👉 런타임 경계를 유지하면서 최신성과 성능을 동시에 확보했습니다.

## 5. Contract-Driven Data Layer

Web은 `@blog/contracts` 패키지를 통해  
API 요청/응답 타입과 경로 정의를 공유합니다.

이는 단순한 타입 재사용이 아니라,  
Web / BO / API 간 **Single Source of Truth 기반 계약 구조**를 의미합니다.

### 📦 Contract 공유 구조

- API path 정의 공유
- Request / Response 타입 공유
- Cache Tag 규칙 공유
- z.infer 기반 컴파일 타임 타입 안정성 확보

예시:

```ts
import {
  GetPostDetail,
  type GetPostDetailParams,
  type GetPostDetailResponse,
} from '@blog/contracts'

export async function getPostDetail(params: GetPostDetailParams) {
  const res = await API.get<GetPostDetailResponse>(GetPostDetail.path(params.postSeq), {
    next: {
      revalidate: 5 * 60,
      tags: [CacheTags.Post.detail, CacheTags.Post.byId(params.postSeq)],
    },
  })

  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
```

### 🎯 왜 중요한가?

- Web에서 타입을 별도로 선언하지 않음
- API 스키마 변경 시 컴파일 단계에서 즉시 감지
- 런타임과 컴파일 타임 안정성을 동시에 확보
- Cache Tag 규칙 또한 계약 계층에서 공유

👉 결과적으로 데이터 계층의 일관성과 유지보수성을 구조적으로 확보했습니다.

## Repository Navigation

- 🗂️ **Root**: [Blog Platform](https://github.com/Blog-Archive-Ian/blog-platform)
- 🗂️ **Web**: [apps/web](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/web)
- 🗂️ **Back Office**: [apps/bo](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/bo)
- 🗂️ **API Server**: [apps/api](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/api)
- 🗂️ **Contracts**: [packages/contracts](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/packages/contracts)
