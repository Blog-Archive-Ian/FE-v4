# @blog/contracts

**Zod 기반 API Contract Single Source of Truth 패키지**입니다.  
Web / BO / API가 공유하는 Schema Layer이자 API Spec Registry 역할을 합니다.

이 패키지는 단순 타입 정의가 아니라,

- API 요청/응답 스키마 정의
- 런타임 validation 기준 제공
- 컴파일 타임 타입 추론
- Cache Tag 규칙 정의
- Revalidate 정책 정의

를 하나의 계층으로 통합 관리합니다.

## 1. Why Contracts Layer?

Web / BO / API는 물리적으로 분리되어 있지만,
데이터 계약은 단일 기준으로 유지되어야 합니다.

이를 위해

- 타입 정의 중복 제거
- 런타임 검증 기준 통일
- 캐시 무효화 규칙 중앙화

를 목표로 설계되었습니다.

👉 물리적 분리와 논리적 일관성을 동시에 확보합니다.

## 2. What This Package Contains

### ① API Spec Definition

각 API는 다음 정보를 모두 포함합니다:

```ts
export const GetPostDetail = {
  method: 'GET',
  path: (postSeq: number | string) => `/post/${postSeq}`,
  Params: z.object({...}),
  Response: ApiResponseStrict(PostSchema),
}
```

포함 요소:

- HTTP method
- path 정의
- Params / Query / Body schema
- Response schema
- (Write API의 경우) revalidate 정책

👉 API 문서, 타입, 검증 기준이 하나의 객체에 통합됩니다.

### ② Zod 기반 Runtime Validation

```ts
export const CreatePostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  tags: z.array(z.string()).max(10),
  category: z.string().min(1),
})
```

- API 서버에서 runtime validation 수행
- Web / BO에서는 타입 추론 기반 컴파일 타임 안전성 확보

👉 하나의 스키마가 런타임과 컴파일 타임을 동시에 관통합니다.

### ③ Type Inference (Single Source of Truth)

```ts
export type CreatePostBody = z.infer<typeof CreatePost.Body>
export type GetPostDetailResponse = z.infer<typeof GetPostDetail.Response>
```

- API와 Web에서 동일 타입 사용
- 스키마 변경 시 컴파일 단계에서 즉시 감지

👉 타입 정의 지점 3 → 1로 수렴

### ④ Cache Tag Registry

```ts
export const CacheTags = {
  Post: {
    list: 'post:list',
    byId: (postSeq) => `post:${postSeq}`,
    calendar: (year, month) => `post:calendar:${year}-${month}`,
  },
}
```

- Tag 문자열 하드코딩 제거
- Web / API에서 동일 규칙 공유
- Tag 정책 변경 시 영향 범위 추적 가능

### ⑤ Revalidation Policy Registry

Write API는 revalidate 규칙을 함께 정의합니다.

```ts
export const UpdatePost = {
  ...
  revalidate: (postSeq) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.list,
    CacheTags.Post.popular,
  ],
}
```

👉 무효화 정책을 API 구현이 아니라 계약 계층에서 관리합니다.

- 캐시 정책이 코드에 분산되지 않음
- 변경 영향 범위가 명확해짐

## 3. Response Wrapper Abstraction

공통 응답 구조도 중앙 정의합니다.

```ts
export const ApiResponseStrict = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    data: schema,
  })
```

- 응답 포맷 일관성 확보
- API 구조 변경 시 중앙 수정 가능

## 4. ESM / CJS Dual Build

이 패키지는 ESM, CJS를 모두 지원합니다.

- ESM (Next.js / modern bundler)
- CJS (NestJS runtime)

```json
"exports": {
  ".": {
    "types": "./dist/esm/index.d.ts",
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js"
  }
}
```

👉 런타임 환경 차이를 흡수하는 공유 패키지 구조

## 5. Architectural Role

이 패키지는 아래와 같은 역할을 수행합니다.

- 📘 API 명세 레지스트리
- 🧠 Schema Layer
- 🔐 Validation 기준
- 🔁 Cache Policy Registry
- 🔗 Web / BO / API 경계 통합 계층

👉 애플리케이션은 분리되어 있지만,
데이터 계약은 이 계층에서 일관되게 유지됩니다.

## Repository Navigation

- 🗂️ **Root**: [Blog Platform ↗](https://github.com/Blog-Archive-Ian/blog-platform)
- 🗂️ **Web**: [apps/web ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/web)
- 🗂️ **Back Office**: [apps/bo ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/bo)
- 🗂️ **API Server**: [apps/api ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/api)
- 🗂️ **Contracts**: [packages/contracts ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/packages/contracts)
