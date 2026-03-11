# AI Troubleshooting Draft Generator – Screen Design

## 1. 페이지 개요

이 페이지는 GitHub 활동과 Cursor 대화 로그를 기반으로 **기술 블로그 초안을 생성하는 내부 생산성 도구**이다.

핵심 목적:

- GitHub PR / Issue / Commit 기록을 분석
- Cursor 대화 로그와 결합
- 기술 블로그 초안을 자동 생성

이 페이지는 **입력 화면이 아니라 작업 대시보드**로 설계한다.

주요 기능:

- 새로운 초안 생성
- 생성 진행 상태 확인
- 이전 생성 결과 확인
- 생성된 초안 열기

---

# 3. 전체 레이아웃

```


┌────────────────────────────────────┐
│ Section 1: Create Draft            │
│ GitHub URL Input                   │
│ Cursor Chat Log Upload             │
│ Additional Context                 │
│ Generate Button                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Section 2: Active Jobs             │
│ 현재 생성 중인 작업 상태                 │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Section 3: Recent Drafts           │
│ 최근 생성된 초안 목록                   │
└────────────────────────────────────┘
```

---

# 4. Section 1 – Draft Generation Form

## 목적

사용자가 GitHub 데이터를 기반으로 **새로운 블로그 초안 생성 요청**을 한다.

## UI 구성

### GitHub URL

지원 URL

- Pull Request
- Issue
- Commit

예시

```
https://github.com/user/repo/pull/123
```

Input Type

```
text input
```

Required: Yes

---

### Cursor Chat Log

Cursor에서 export한 대화 로그 (.md 파일)

Optional

Input Type

```
file upload
```

---

### Additional Context

AI에게 추가로 전달할 설명

예:

- 버그 발생 배경
- 환경 설명
- 글에 꼭 들어갔으면 하는 설명

Input Type

```
textarea
```

Optional: Yes

---

### Generate Button

버튼

```
Generate Draft
```

클릭 시

1. POST /generate 호출
2. GenerationJob 생성
3. Active Jobs 영역에 표시

---

# 5. Section 2 – Active Jobs

현재 진행 중인 생성 작업 표시

목적:

- 사용자에게 생성 상태 피드백 제공
- AI 작업 진행 상황 확인

## 표시 항목

각 Job 카드

```
Job ID
GitHub URL
Status
Started At
Progress
```

Status:

```
PENDING
PROCESSING
COMPLETED
FAILED
```

---

## Progress 표시 예

```
Collecting GitHub Data
Analyzing Commits
Running AI Pipeline
Generating Draft
Saving Result
```

---

# 6. Section 3 – Recent Drafts

최근 생성된 블로그 초안 목록

목적:

- 생성 결과 재확인
- 초안 열기
- 재생성

---

## Draft List UI

각 Draft 카드

```
Title
Summary
Created At
Tags
Status
```

Actions

```
Open Draft
Regenerate
Delete
```

---

# 7. Draft Preview (Optional Modal)

초안을 미리보기로 확인

구성

```
Title
Summary
Tags
Markdown Content
```

Actions

```
Open in Editor
Copy Markdown
Close
```

---

# 8. 상태 흐름

생성 작업 상태

```
User Input
↓
GenerationJob Created
↓
GitHub Data Collection
↓
AI Pipeline
↓
Draft Generated
↓
Saved
```

---

# 9. UX 원칙

이 페이지는 **관리형 작업 대시보드**로 설계한다.

핵심 UX 원칙:

1. 페이지 진입 즉시 생성 가능
2. 작업 상태를 실시간 확인
3. 생성된 결과 바로 확인
4. 반복 작업을 빠르게 수행

---

# 10. 확장 계획

추후 추가 가능한 기능

### GitHub Webhook

PR Merge 시 자동 초안 생성

---

### Multi User

- 사용자 인증
- Repo 권한 관리

---

### Knowledge Memory

과거 트러블슈팅 데이터를 저장하고
유사 문제 발생 시 참고

---
