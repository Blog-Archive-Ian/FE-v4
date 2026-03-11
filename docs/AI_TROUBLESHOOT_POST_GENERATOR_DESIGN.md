# 1. 개요

이 서비스는 GitHub Issue, Pull Request, Commit 기록과 Cursor 대화 로그를 분석해 **기술 트러블슈팅 블로그 초안**을 자동으로 생성한다.  
목표는 기술 블로그를 쓸 때 **디버깅/문제 해결 과정과 사고 흐름을 문서화하는 데 드는 시간을 줄이는 것**이다.

시스템은 개발 히스토리와 대화 기반 사고 흔적을 함께 분석해서 다음과 같은 구조의 글을 재구성한다.

- 문제 상황
- 가설 및 초기 추론
- 근본 원인(Root Cause)
- 문제 해결 과정
- 최종 해결책
- 회고 / 배운 점

이 시스템은 우선 **개인 개발자의 생산성 향상 도구**를 목표로 하지만, 이후 **멀티 유저 확장**을 고려해 구조를 설계한다.

---

# 2. 시스템 아키텍처

이 시스템은 **모노레포 기반 블로그 플랫폼**의 일부로 동작한다.

아키텍처 흐름:  
사용자 → BO(Admin UI) → API → AI Service → GitHub API / OpenAI API

```code
┌─────────────┐
│   BO (UI)   │
│ GitHub URL  │
│ Cursor Log  │
│ Input Form  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Nest API  │
│ Request Orchestrator
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ AI Service  │
│ Spring Boot │
│ Agent Pipeline
└──────┬──────┘
       │
 ┌─────┴──────────────┐
 ▼                    ▼
┌─────────────┐   ┌─────────────┐
│ GitHub API  │   │ OpenAI API  │
└─────────────┘   └─────────────┘
```

---

# 3. 모노레포 구조

```code
apps/
  web           # 공개 블로그 (Next.js)
  bo            # 관리자/백오피스
  api           # NestJS API
  ai-service    # Spring Boot 기반 AI 서비스

packages/
  contracts     # 공유 zod 스키마
```

ai-service는 모노레포 내부의 독립 애플리케이션으로 존재한다.

---

# 4. 기능 범위 (MVP)

## Input

사용자가 입력하는 값:

- GitHub URL (필수)
- Cursor 대화 로그 파일 (.md) (선택)
- 추가 메모 (선택)

지원하는 URL 타입:

- Pull Request
- Issue
- Commit

예시: https://github.com/user/repo/pull/123

## Output

AI가 생성하는 결과:

- 블로그 제목 (Title)
- 요약 (Summary)
- 태그 (Tags)
- 블로그 본문 초안 (Draft)

예상 구조:

```code
Title
Summary
Problem Situation
Hypothesis & Investigation
Root Cause Analysis
Troubleshooting Process
Solution
Lessons Learned
```

---

# 5. 처리 플로우

## Step 1 — URL 파싱

입력된 GitHub URL에서 타입을 판별한다.

- /issues/{number} → Issue
- /pull/{number} → Pull Request
- /commit/{hash} → Commit

이 타입 정보를 기반으로 GitHub API를 어떻게 호출할지 결정한다.

## Step 2 — GitHub 데이터 수집

각 타입별로 수집하는 정보:

Pull Request

- PR 제목
- PR 설명(본문)
- 포함된 커밋 리스트
- 변경된 파일 목록

Commit

- 커밋 메시지
- diff
  Issue

- 이슈 제목
- 이슈 본문
- 댓글(코멘트) 목록

이 데이터들은 이후 AI 에이전트들이 참고하는 사실 데이터 소스가 된다.

---

## Step 3 — Cursor 대화 로그 수집 및 파싱

선택적으로 업로드된 Cursor 대화 로그(.md)를 파싱한다.

수집하는 정보:

- 문제를 처음 인식한 시점
- 사용자가 세운 가설
- AI와의 질의응답 과정
- 시도한 해결 방법
- 중간에 버린 접근
- 최종적으로 채택한 해결 방향

이 데이터는 GitHub 기록만으로는 복원하기 어려운 **사고 과정(Thinking Evidence)** 을 보강하는 역할을 한다.

---

## Step 4 — AI 에이전트 파이프라인

AI Service 내부에서 여러 단계의 에이전트를 통과시키며 글을 만든다.

### Agent 1 — Problem Analyzer (문제 분석)

역할:

- 문제 상황 요약
- 실행/운영 환경
- 에러 메시지
- 관측된 증상들

을 추출해 “문제 상황” 섹션의 재료를 만든다.

---

### Agent 2 — Evidence Merger (근거 통합)

역할:

GitHub에서 수집한 코드 변경 기록과 Cursor 대화 로그를 결합해,
하나의 트러블슈팅 타임라인으로 정리한다.

구체적으로는:

- GitHub 기록 → 실제 변경 및 결과 중심 근거
- Cursor 대화 로그 → 사고 과정 및 가설 중심 근거

를 합쳐서 “문제 인식 → 추론 → 시도 → 해결” 흐름을 복원한다.

---

### Agent 3 — Troubleshooting Timeline Analyzer (문제 해결 흐름 분석)

역할:

GitHub 커밋 히스토리와 Cursor 대화 로그를 분석해서:

- 디버깅용 시도
- 실험/검증 단계
- 최종 해결 커밋
- 중간에 폐기된 접근

을 구분하고, 시간 순서대로 트러블슈팅 타임라인을 복원한다.

---

### Agent 4 — Root Cause Detector (근본 원인 탐지)

역할:

가장 가능성 높은 근본 원인 후보들을 정리하고, 최종 Root Cause를 도출한다.
이때:

- 어떤 컴포넌트/모듈이 문제였는지
- 어떤 입력/상태 조합에서 문제가 발생했는지
- 어떤 설계/사용 상의 오해가 있었는지

같은 기술적 맥락을 함께 묶어서 정리한다.

---

### Agent 5 — Blog Writer (블로그 작성)

역할:

- 위에서 뽑아낸 정보(문제/타임라인/원인 등)를 이용해,
- 정해진 섹션 구조에 맞춰 마크다운 블로그 초안을 생성한다.

기본 섹션 구조:

```md
# Problem Situation

# Root Cause

# Troubleshooting Process

# Solution

# Lessons Learned
```

---

### Agent 6 — SEO Generator (SEO 정보 생성)

역할:

- 블로그 제목 (title)
- 태그 (tags)
- 짧은 요약 (summary/description)

을 생성하여, 검색/블로그 리스트 노출에 적합한 메타 정보를 만든다.

---

# 6. API 설계

엔드포인트:
POST /generate

Request

- githubUrl: string
- additionalContext: string (optional)
- cursorChatLogFile: file (.md, optional)

설명:

- githubUrl: Issue/PR/Commit 중 하나의 GitHub 링크
- additionalContext: 글에 꼭 들어갔으면 하는 추가 설명, 배경 맥락 등
- cursorChatLogFile: file (.md, optional)

Response

```json
{
  "title": "string",
  "summary": "string",
  "tags": ["string"],
  "content": "markdown"
}
```

- content는 전체 블로그 초안 (마크다운)

---

# 7. 도메인 모델

## GenerationJob

하나의 블로그 생성 요청을 나타내는 엔티티.

필드:

```code
id
githubUrl
cursorLogPath
additionalContext
status
createdAt
resultContent
```

Status:

```code
PENDING
PROCESSING
COMPLETED
FAILED
```

- PENDING : 큐에 쌓인 상태
- PROCESSING : AI 파이프라인 동작 중
- COMPLETED : 초안 생성 성공
- FAILED : 생성 중 에러 발생

---

## GeneratedPost

생성된 블로그 초안을 저장하는 엔티티.

필드:

```code
id
title
summary
content
tags
createdAt
```

- 별도의 게시 시스템으로 넘기기 전, 초안 상태를 보관하는 용도

## SourceEvidence

블로그 초안 생성에 사용된 원본 근거를 나타내는 엔티티.

필드:

```code
id
generationJobId
type        # GITHUB_PR / GITHUB_ISSUE / GITHUB_COMMIT / CURSOR_LOG
sourceRef
rawContent
createdAt
```

- 여러 소스의 근거를 통합 관리하기 위한 용도

---

# 8. 기술 스택

AI Service
- Spring Boot
- Spring Web
- Spring Validation
- Spring Data JPA
- WebClient
- PostgreSQL

AI
- OpenAI API

GitHub
- GitHub REST API

---

# 9. Future Extensions

Possible improvements:

GitHub Webhook Integration

Automatically generate blog drafts when:
- Pull Request merged
- Issue closed

---

Multi-user Support

Add:
- user authentication
- repo access management
- generation history

---

Knowledge Memory

Store:
- past troubleshooting cases
- reuse patterns for similar issues

---

# 10. 설계 원칙

이 시스템은 다음과 같은 설계 원칙을 따른다.

1. AI 로직과 블로그 애플리케이션의 분리
   - 블로그 앱은 단순히 “생성 요청/결과 표시” 역할
   - AI Service는 “분석/생성” 책임에 집중
2. 명확한 워크플로우 파이프라인
   - URL 파싱 → 데이터 수집 → 에이전트 체인 → 결과 생성
3. GitHub와 대화 로그를 핵심 지식 소스로 사용
   - GitHub는 실제 변경과 결과의 근거
   - Cursor 대화 로그는 문제 해결 과정과 사고 흐름의 근거
   - 두 소스를 결합해 더 자연스러운 기술 서사를 복원한다
4. 단순 요약이 아닌, 개발 서사(Narrative) 재구성
   - “무슨 버그였고 어떻게 고쳤는지”뿐 아니라
   - “왜 그런 가설을 세웠고 어떤 과정을 거쳐 해결했는지”의 흐름까지 복원하는 것에 집중
5. 확장성(Extensibility)을 고려한 구조
   - 새로운 에이전트 추가, 다른 LLM/벡터스토어 연동 등의 변화를 쉽게 적용 가능하도록 설계

---

# 11. 최종 목표

이 시스템의 최종 목표는:

단순히 GitHub 활동을 **요약(summarize)** 하는 것이 아니라,  
GitHub 기록과 AI 도구와의 대화 로그를 함께 활용해  
디버깅과 문제 해결의 공학적 서사(Engineering Narrative)를 복원하는 것이다.

이를 통해 개발자는:

- 과거 Issue/PR/Commit 기록과 대화 로그를 기반으로
- 사고 과정이 살아 있는 기술 블로그 초안을 자동으로 얻게 되고,
- 문서화에 쓰이던 시간을 실제 개발/학습에 더 쓸 수 있게 된다.