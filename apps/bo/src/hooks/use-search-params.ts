/**
 * URL querystring으로 안전하게 직렬화 가능한 원시 타입.
 *
 * - `''`(빈 문자열)은 "값 없음"으로 취급하기 위해 별도로 처리한다.
 */
type Primitive = string | number | boolean | null | undefined

/**
 * 쿼리스트링 값으로 허용되는 타입.
 *
 * - 단일 원시값 또는 원시값 배열(리스트)을 허용한다.
 * - 배열은 가변배열/불변배열 둘 다 허용한다. (as const)
 */
type PrimitiveOrArray = Primitive | readonly Primitive[]

/**
 * SearchLike<T>
 *
 * `validateSearch`로 다루는 search 객체의 값 제약을 강제한다.
 *
 * ## 목적
 * - `search`에 들어갈 값은 **URL로 직렬화 가능한 값만** 허용한다.
 * - 리스트(배열) 파라미터도 지원한다.
 *
 * ## 제약
 * - 각 key의 값은 `PrimitiveOrArray`만 가능하다.
 * - 객체/함수/Date/Map 등 URL 직렬화에 부적절한 값은 타입 단계에서 차단한다.
 *
 * - Date는 string/number로 변환
 * - 객체는 id만 넣거나 JSON.stringify(비추)
 * - Map/Set은 배열이나 레코드 문자열로 변환
 *
 * @typeParam T - search 객체의 shape
 */
export type SearchLike<T> = {
  [K in keyof T]: PrimitiveOrArray
}

/**
 * Updater<T>
 *
 * TanStack Router의 `navigate({ search })`가 받는 형태를 따르는 업데이트 타입.
 *
 * - 값 자체로 교체하거나
 * - 이전 값(prev)을 받아 다음 값을 계산하는 함수를 전달할 수 있다.
 *
 * @typeParam T - 업데이트 대상 타입
 */
type Updater<T> = T | ((prev: T) => T)

/**
 * patch 객체를 search에 적용 가능한 형태로 정규화한다.
 *
 * ## 동작
 * - `undefined`는 무시한다(해당 key를 건드리지 않음).
 * - 그외의 값: 그대로 반영
 *
 * @typeParam T - search object shape
 * @param patch - 부분 업데이트용 patch
 * @returns 빈 값/빈 배열이 제거된 정규화 patch
 */
const normalizePatch = <T extends Record<string, PrimitiveOrArray>>(
  patch: Partial<T>,
): Partial<T> => {
  const entries = Object.entries(patch) as Array<[keyof T, T[keyof T]]>

  const cleaned: Array<[keyof T, PrimitiveOrArray]> = []

  for (const [key, value] of entries) {
    if (value === undefined) continue

    cleaned.push([key, value])
  }

  return Object.fromEntries(cleaned) as Partial<T>
}

/**
 * useSearchParams 옵션
 *
 * @typeParam T - 페이지에서 사용하는 search의 shape
 */
interface UseSearchParamsOptions<T extends SearchLike<T>> {
  /**
   * search 초기값(리셋 시 사용할 기본값).
   *
   * - `resetSearch()` 호출 시 그대로 적용된다.
   * - 가능하면 이 값도 `validateSearch`의 기본값과 일치시키는 것을 권장한다.
   */
  defaultSearch: T

  /**
   * 이 페이지가 사용하는 TanStack Router의 Route 객체.
   *
   * ## 왜 필요한가?
   * - `Route.useSearch()`는 `validateSearch` 결과(정규화된 search)를 반환해야 한다.
   * - `Route.useNavigate()`를 사용해서 `navigate({ search })`로 이동해야
   *   `validateSearch` 파이프라인을 타고 안전하게 업데이트된다.
   *
   * ## 요구사항
   * - `useSearch()`는 정규화된 search를 반환해야 한다.
   * - `useNavigate()`는 `{ search }`를 받아 navigate를 수행해야 한다.
   */
  Route: {
    useSearch: () => T
    useNavigate: () => (opts: { search?: Updater<Partial<T> | T> }) => void
  }
}

/**
 * useSearchParams
 *
 * `validateSearch`를 반드시 거쳐 search를 다루기 위한 유틸 훅.
 *
 * ## 제공 기능
 * - `search`: 현재 라우트의 정규화된 search
 * - `applySearch(patch)`: 부분 업데이트 (빈 값은 제거 의도로 처리)
 * - `resetSearch()`: defaultSearch로 완전 리셋
 *
 * ## patch 적용 규칙 (`applySearch`)
 * - `undefined` → 무시(해당 key 유지)
 * - `null` / `''` → 제거 의도(정규화 과정에서 key 제외)
 * - 배열 → 빈 요소 제거 후, 배열이 비면 제거 의도
 *
 * ## 예시
 * ```ts
 * const { search, applySearch, resetSearch } = useSearchParams({
 *   defaultSearch: { page: 1, keyword: '' },
 *   Route,
 * })
 *
 * applySearch({ keyword: 'abc', page: 1 })
 * applySearch({ keyword: '' }) // keyword 제거 의도
 * applySearch({ tags: ['a', '', 'b'] }) // tags -> ['a','b']
 * applySearch({ tags: [] }) // tags 제거 의도
 * resetSearch()
 * ```
 *
 * @typeParam T - search의 shape (각 값은 URL 직렬화 가능한 타입이어야 함)
 * @param options - 훅 옵션
 * @returns search와 updater 함수들
 */
export const useSearchParams = <T extends SearchLike<T>>({
  defaultSearch,
  Route,
}: UseSearchParamsOptions<T>) => {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  /**
   * search를 부분 업데이트한다.
   *
   * @param patch - 변경할 key들의 부분 객체
   */
  const applySearch = (patch: Partial<T>) => {
    const normalized = normalizePatch<T>(patch)

    navigate({
      search: (prev) => {
        return {
          ...prev,
          ...normalized,
        }
      },
    })
  }

  /**
   * search를 `defaultSearch`로 리셋한다.
   */
  const resetSearch = () => {
    navigate({
      search: defaultSearch,
    })
  }

  return { search, applySearch, resetSearch }
}
