# Blog Platform

**🌐 Live Service** [Visit the Blog](https://blog.minjae-dev.com)

Monorepo-based Web / BO / API Architecture  
with Contract-First Design and Runtime Boundary Separation

## 1. Project Overview

이 프로젝트는 단순한 블로그 애플리케이션이 아니라,  
**Web / Back Office / API를 분리한 Monorepo 기반 아키텍처 설계 프로젝트**입니다.

주요 설계 목표는 다음과 같습니다:

- SEO 중심 Web 애플리케이션과 관리자 시스템의 물리적 분리
- API 요청/응답 계약의 단일 기준(Single Source of Truth) 확립
- 런타임 경계를 유지한 선택적 캐시 무효화 전략 설계
- URL 기반 상태 관리 구조 재설계

## 2. Architecture Overview

### 📦 Monorepo Structure

```bash
apps/
  web/        # SEO 중심 사용자 블로그
  bo/         # 관리자 Back Office
  api/        # NestJS 기반 API 서버
packages/
  contracts/  # Zod 기반 API Contract (SSOT)
  ui/         # shadcn-ui 기반 ui 공통 컴포넌트
```

### 📁 apps/web

SEO 중심 사용자 블로그 애플리케이션 (Next.js App Router 기반)  
→ [📑 apps/web README](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/web)

- SSR + Tag 기반 캐시 전략
- 선택적 캐시 무효화 구조 적용
- SEO 성능을 유지하는 데이터 패칭 전략 설계

### 📁 apps/bo

관리자 전용 Back Office 애플리케이션  
→ [📑 apps/bo README](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/bo)

- 게시글 작성/수정 관리
- Write 요청 후 Web 캐시 무효화 트리거 역할 수행
- 사용자 트래픽과 물리적으로 분리된 배포 단위

### 📁 apps/api

NestJS 기반 API 서버  
→ [📑 apps/api README](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/api)

- REST API 제공
- contracts 패키지 기반 런타임 validation 수행
- 데이터 변경 후 Web 무효화 파이프라인 트리거

### 📁 packages/contracts

Zod 기반 API Contract **Single Source of Truth**  
→ [📑 packages/contracts README](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/packages/contracts)

- 요청/응답 Schema 중앙 관리
- z.infer 기반 컴파일 타임 타입 공유
- schema.parse() 기반 런타임 검증
- CJS / ESM dual build 구조

## 3. Why This Architecture?

### ① Web / BO / API 분리 이유

- SEO 트래픽과 관리자 트래픽의 책임 분리
- 배포 단위 및 런타임 경계 분리
- 관리자 기능 외부 노출 최소화

### ② Monorepo 유지 이유

- 애플리케이션은 물리적으로 분리하되,
- 데이터 계약은 단일 기준으로 유지 필요

👉 물리적 분리와 논리적 일관성을 동시에 확보

## 4. Core Design Decisions

### ① Contract Centralization (Schema Layer)

- Zod 기반 Schema Layer를 계약 계층으로 정의
- Web / BO / API가 동일한 Contract를 공유
- 타입 정의 지점 3 → 1로 수렴

### ② Cache Invalidation Pipeline

- Web 런타임이 캐시 소유권을 명확히 가짐
- Tag 기반 선택적 무효화 전략 설계
- API 변경 → Web /api/revalidate 호출 파이프라인 구성
- no-store 없이 최신성과 성능 동시 확보

### ③ Routing Boundary Redesign

- Search 상태를 URL 기반 Single Source로 재정의
- TanStack Router + validateSearch 기반 검증 파이프라인
- 공통 훅 추상화를 통한 중복 코드 제거

## 5. Architecture Trouble Shooting

**🚨 BO 수정 후 Web에 즉시 반영되지 않는 문제**

#### 문제

- BO에서 게시글 수정 후 DB에는 반영되지만 Web에는 즉시 반영되지 않음
- Next.js App Router 기본 force-cache 전략으로 캐시 유지

#### 제약

- revalidateTag / revalidatePath는 Web 서버 내부에서만 유효
- 전체 no-store 전략은 비용 및 성능 문제 발생

#### 해결

- 캐시 소유권을 Web으로 명확히 정의
- Tag 기반 선택적 무효화 파이프라인 설계
- API → Web revalidate 엔드포인트 호출 구조 구성

## 6. Tech Stack

### 🧩 Core Architecture

- TypeScript
- pnpm Monorepo
- Turborepo (Build Orchestration)
- Zod (Contract / Schema Layer)

### 🌐 apps/web

- Next.js (App Router)
- SSR + Tag-based Cache Strategy

### 🛠 apps/bo

- React
- TanStack Router
- TanStack Query

### 🔌 apps/api

- NestJS
- Prisma (ORM)
- MariaDB (MySQL-compatible)

## Repository Navigation

- 🗂️ **Root**: [Blog Platform ↗](https://github.com/Blog-Archive-Ian/blog-platform)
- 🗂️ **Web**: [apps/web ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/web)
- 🗂️ **Back Office**: [apps/bo ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/bo)
- 🗂️ **API Server**: [apps/api ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/api)
- 🗂️ **Contracts**: [packages/contracts ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/packages/contracts)
