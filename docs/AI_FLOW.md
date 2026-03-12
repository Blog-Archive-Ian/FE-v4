## AI Troubleshoot Draft 흐름 개요

이 문서는 **BO → Nest API → (Spring ai-service) → Nest DB → BO 에디터** 로 이어지는
AI 트러블슈팅 초안 생성/조회 플로우를 정리한 것이다.

현재 단계에서는 **실제 AI 파이프라인/LLM 호출은 아직 미구현**이며,
목 데이터 + UUID + DB 저장 구조만 구성하는 것을 목표로 한다.

---

## 전체 시퀀스 (요약)

1. BO AI 대시보드에서 **초안 생성 요청**
2. Nest API가 요청을 검증하고, (필요 시) Cursor 로그 파일을 저장
3. Nest API가 Spring `ai-service`에 **초안 생성을 위임** (지금은 목 데이터 생성)
4. Spring `ai-service`가 **초안 내용(title/summary/content/tags)** 을 만들어 Nest로 응답
5. Nest API가 **UUID(draftId) 생성 + 초안을 DB에 저장**
6. Nest API가 BO에 **`{ draftId }`만 응답**
7. BO 에디터 화면(`/posts/new`)에서 `draftId`를 쿼리스트링으로 받아
   `GET /ai/drafts/:draftId`를 호출
8. Nest API가 DB에서 `draftId`로 초안을 조회하여 **실제 제목/본문/태그를 응답**
9. BO 에디터가 응답 데이터를 받아 **폼에 자동으로 채워 넣음**

---

## 컴포넌트 역할 분리

### 1. BO (Back Office)

- **AI 대시보드 페이지**
  - 입력: `githubUrl`, `additionalContext`, `cursorChatLog(.md)` 파일
  - `POST /ai/generate` (Nest) 호출
  - 응답으로 받은 `draftId`를 이용해 `/posts/new?draftId=...` 로 네비게이트

- **포스트 에디터 페이지(`/posts/new`)**
  - URL 쿼리스트링의 `draftId`를 읽음
  - `GET /ai/drafts/:draftId` 호출
  - 응답으로 받은 `title`, `content`, `tags` 등을 폼 초기값으로 세팅

### 2. Nest API

- **책임**
  - 인증/권한, 입력 검증
  - Cursor 로그 파일 저장 (로컬 디스크 or 스토리지)
  - **AI 초안 식별자(draftId) 발급 및 DB 영속화**
  - **초안 조회 API 제공 (draftId 기반)**
  - Spring `ai-service` 와의 통신 (AI/파이프라인 위임)

- **생성 플로우 (POST /ai/generate)**
  1. JWT 인증 및 요청 바디 검증
  2. Cursor 로그 파일이 있으면, 유효성 검사 후 지정된 디렉터리에 저장
  3. Spring `ai-service` 의 `/api/generate` (예시) 를 호출
     - 전달: `githubUrl`, `additionalContext`, `cursorLogPath`
     - 수신: **AI가 생성한 초안 내용(title/summary/content/tags)**  
       (현재는 목 데이터)
  4. **Nest에서 `draftId = uuid()` 생성**
  5. Prisma를 통해 MariaDB에 **`AiDraft` 레코드 저장**
     - `draftId`
     - `title`, `summary`, `content`
     - `tags` (문자열 배열 or JSON)
     - 생성 시각 등 메타데이터
  6. BO에 **`{ draftId }`만 응답
     (실제 내용은 GET 호출 시 DB에서 다시 읽어서 내려줌)**

- **조회 플로우 (GET /ai/drafts/:draftId)**
  1. `draftId` 파라미터 검증
  2. Prisma로 `AiDraft`를 DB에서 조회
  3. 존재하면 `{ draftId, title, summary, content, tags }` 응답
  4. 없으면 404 또는 `{ data: null }` 응답

### 3. Spring `ai-service`

- **현재 단계의 목표**
  - **DB/식별자를 전혀 모르는 완전한 stateless AI/파이프라인 레이어**
  - 입력을 받고, AI 또는 목 로직으로 초안 내용을 생성해 **Nest에만 돌려주는 역할**

- **책임**
  - GitHub 리포지토리/PR 내용, Cursor 로그, 추가 컨텍스트 등을 바탕으로
    트러블슈팅 포스트 초안 내용 생성
  - (미래) 실제 AI 파이프라인 / LLM 호출 / 로그/메트릭 관리

- **비책임(현재 플로우 기준)**
  - draftId 생성
  - DB 스키마/테이블/마이그레이션
  - draft 영속화/조회

즉, Spring은 다음과 같은 인터페이스만 가진다고 보면 된다.

- 입력: `githubUrl`, `additionalContext`, `cursorChatLogPath` 등
- 출력: `title`, `summary`, `content`, `tags` (＋ 필요 시 추가 필드)

식별자(draftId)와 영속성은 Nest 쪽에서 처리한다.

---

## 아키텍처 선택 이유

1. **관심사 분리**
   - Nest: BO와의 통합, 인증, DB, 비즈니스 규칙
   - Spring(ai-service): AI/파이프라인에만 집중

2. **유연한 확장**
   - 나중에 Spring을 다른 리포지토리/인프라로 분리하거나,
     여러 AI 백엔드를 behind-the-scenes 로 붙이기 쉬움.
   - draft 저장/조회는 Nest와 Prisma 레벨에서 통일되므로,
     기존 포스트/유저 데이터와 함께 안정적으로 관리 가능.

3. **단계적 고도화**
   - 현재는 **목 데이터 + UUID + DB 저장** 단계
   - 이후에는 Spring에 실제 파이프라인/LLM 로직을 채워 넣기만 하면 됨.
   - BO/Nest의 API 계약(`draftId` 기반)은 그대로 유지 가능.

---

## 향후 단계 (파이프라인 도입 시)

1. Spring `GeneratePostService.generate(...)` 에 실제 파이프라인 구현
   - Cursor 로그 파싱
   - GitHub 리포지토리/PR 내용 참조
   - Hypothesis & Investigation 정리
   - 최종 포스트 초안 구성

2. Nest에서 Spring 호출 부분을 mock → 실제 HTTP 호출로 전환

3. Nest DB 스키마에 파이프라인 진행 상태/로그를 위한 필드를 확장
   - 예: `status`, `errorMessage`, `tokensUsed`, `modelName` 등

이 과정을 거치더라도,
**BO ↔ Nest ↔ Spring 간의 기본 데이터 플로우(특히 `draftId` 기반 UX)는 그대로 유지된다.**
