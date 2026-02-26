# Blog API

NestJS 기반 REST API 서버입니다.  
DB 접근, Contract 기반 응답 변환, Web 캐시 무효화 트리거 역할을 담당합니다.

## 1. Role in Architecture

API는 다음 책임을 가집니다:

- 데이터 영속성 처리 (Prisma + MariaDB)
- Contract 기반 응답 구조 보장
- Write 요청 후 Web 캐시 무효화 트리거

Web과 BO 사이에서 데이터 경계를 명확히 분리하는 역할을 수행합니다.

## 2. Database Layer

- Prisma ORM 사용
- MariaDB 연결 (PrismaMariaDb adapter)
- NestJS lifecycle 기반 연결 관리

```ts
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
```

- onModuleInit → $connect()
- onModuleDestroy → $disconnect()

👉 DB 연결 생명주기를 NestJS 모듈과 정렬했습니다.

## 3. Contract-Based Response Mapping

DB 모델을 직접 반환하지 않고,
`@blog/contracts`에 정의된 타입과 스키마를 기준으로 응답을 구성합니다.

```ts
import type { PostType } from '@blog/contracts';
```

```ts
toContract(row: any, tags: string[]): PostType
```

### 설계 의도

- DB 구조와 API 응답 구조 분리
- snake_case → camelCase 정규화
- null / boolean / Date 정규화 처리
- 외부 계약(Contract)과 내부 모델 분리
- zod schema 기반 요청 validation 수행 (contracts 공유)

👉 Contract 계층이 컴파일 타임 타입 공유 + 런타임 검증을 동시에 담당하도록 설계했습니다.

## 4. Cache Invalidation Trigger

게시글 create / update / delete 시
Web의 /api/revalidate 엔드포인트를 호출합니다.

```ts
await fetch(`${FRONT_URL}/api/revalidate`, {
  method: 'POST',
  headers: {
    'x-revalidate-secret': REVALIDATE_SECRET,
  },
  body: JSON.stringify({ tags }),
});
```

### 설계 포인트

- 캐시 소유권은 Web에 있음
- API는 무효화 트리거 역할만 수행
- revalidate 실패해도 Write는 성공해야 함
- 런타임 경계를 침범하지 않는 구조

## 5. Transaction (Planned)

- 게시글 작성/수정 시 다중 테이블 변경
- 향후 Prisma $transaction 적용 예정

## Repository Navigation

- 🗂️ **Root**: [Blog Platform ↗](https://github.com/Blog-Archive-Ian/blog-platform)
- 🗂️ **Web**: [apps/web ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/web)
- 🗂️ **Back Office**: [apps/bo ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/bo)
- 🗂️ **API Server**: [apps/api ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/api)
- 🗂️ **Contracts**: [packages/contracts ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/packages/contracts)
