# Blog Back Office

관리자 전용 콘텐츠 관리 애플리케이션입니다.  
React + TanStack Router 기반으로 설계되었으며,  
URL 기반 상태 관리와 Runtime Guard 구조를 중심으로 구현되었습니다.

## 1. Project Overview

Back Office는 단순한 CRUD 관리자 화면이 아니라,  
콘텐츠 관리 과정에서 발생하는 상태 관리, URL 동기화, 이탈 방지, 캐시 트리거까지 고려한 운영용 애플리케이션입니다.

Web(공개 서비스)과는 물리적으로 분리된 배포 단위로 구성되어 있으며,  
Write 중심 런타임을 담당합니다.

### 🎯 설계 목표

- URL 기반 검색 상태 관리 (Single Source of Truth)
- TanStack Router 기반 타입 안전 라우팅
- 공통 Guard를 통한 이탈 방지 정책 중앙화
- Contract 기반 요청/응답 타입 공유
- Web 캐시 무효화 트리거 역할 수행

## 2. Core Features

- 게시글 작성 / 수정 / 삭제
- 게시글 고정(Pin) / 해제
- 게시글 보관(Archive) / 복원
- 카테고리 / 태그 기반 필터 검색
- URL 기반 페이지네이션
- 관리자 프로필 조회 / 수정
- 대시보드 (추후 기능)

## 3. URL-Driven State Management

BO는 검색 상태를 `useState` 내부에만 두지 않고,  
URL을 상태의 Single Source of Truth로 재정의했습니다.

이를 위해 `useSearchParams` 커스텀 훅을 설계했습니다.

### 📌 설계 포인트

- search 값은 URL 직렬화 가능한 타입만 허용
- 객체/Date/Map 등은 타입 단계에서 차단
- undefined는 무시, null/''는 제거 의도로 처리
- 부분 업데이트(`applySearch`)와 전체 리셋(`resetSearch`) 분리

```ts
const { search, applySearch, resetSearch } = useSearchParams<UiPostListQuery>({
  defaultSearch,
  Route,
})
```

### 왜 URL 기반으로 설계했는가?

- 새로고침 시 상태 유지
- 뒤로가기 / 링크 공유 가능
- 필터 상태의 예측 가능성 확보
- 페이지별 search 로직 중복 제거

👉 결과적으로 검색 상태 관리 로직을 중앙화하고,
페이지 단 중복 코드를 구조적으로 제거했습니다.

## 4. Type-Safe Search Constraint

SearchLike<T> 제네릭을 통해
URL에 들어갈 값은 반드시 직렬화 가능한 Primitive 타입만 허용하도록 제한했습니다.

### 제약

- string | number | boolean | null | undefined
- 또는 해당 타입의 배열
- 객체/함수/Date는 타입 단계에서 차단

```ts
export type SearchLike<T> = {
  [K in keyof T]: PrimitiveOrArray
}
```

👉 URL 직렬화 안전성을 타입 레벨에서 강제했습니다.

## 5. Contract-Driven API Integration

BO는 @blog/contracts 패키지를 통해
API 요청/응답 타입과 path 정의를 공유합니다.

- API path 공유
- Request / Response 타입 공유
- 런타임 validation은 API에서 수행
- 컴파일 타임 안정성은 BO에서 확보

👉 타입 중복 선언 없이 Web / BO / API 간 계약 일관성 유지

## 6. Runtime Boundary Role

BO는 Write 요청 발생 시
API 서버를 통해 Web 캐시 무효화 파이프라인을 트리거합니다.

### 역할 정리

- Web: 캐시 소유
- API: 데이터 변경 + 무효화 트리거
- BO: Write 요청 발생 지점

👉 런타임 책임이 명확히 분리된 구조

## Repository Navigation

- 🗂️ **Root**: [Blog Platform ↗](https://github.com/Blog-Archive-Ian/blog-platform)
- 🗂️ **Web**: [apps/web ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/web)
- 🗂️ **Back Office**: [apps/bo ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/bo)
- 🗂️ **API Server**: [apps/api ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/apps/api)
- 🗂️ **Contracts**: [packages/contracts ↗](https://github.com/Blog-Archive-Ian/blog-platform/tree/dev/packages/contracts)
