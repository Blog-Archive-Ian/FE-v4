export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Primitive = string | number | boolean | null | undefined

type RequestOptions<TBody> = {
  params?: Record<string, Primitive>
  body?: TBody
  headers?: HeadersInit
  next?: NextFetchRequestConfig
}

export class API {
  private static baseURL = process.env.NEXT_PUBLIC_API!
  private static blogId = process.env.NEXT_PUBLIC_BLOG_ID!

  private static buildURL(url: string, params?: Record<string, Primitive>) {
    if (!params) return `${API.baseURL}${url}`
    const qs = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        qs.append(key, String(value))
      }
    }

    return `${API.baseURL}${url}?${qs.toString()}`
  }

  private static async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    url: string,
    options: RequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const fullUrl = API.buildURL(url, options.params)

    const fetchOptions: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        blogId: API.blogId,
        ...(options.headers ?? {}),
      },
      next: options.next,
    }

    if (options.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body)
    }

    const res = await fetch(fullUrl, fetchOptions)

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`API Error: ${res.status} ${res.statusText}\n${errorText}`)
    }

    const json = (await res.json()) as TResponse
    return json
  }

  static get<TResponse>(url: string, options?: RequestOptions<never>) {
    return API.request<TResponse>('GET', url, options)
  }

  static post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions<TBody>,
  ) {
    return API.request<TResponse, TBody>('POST', url, { ...options, body })
  }

  static put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions<TBody>,
  ) {
    return API.request<TResponse, TBody>('PUT', url, { ...options, body })
  }

  static patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions<TBody>,
  ) {
    return API.request<TResponse, TBody>('PATCH', url, { ...options, body })
  }

  static delete<TResponse>(url: string, options?: RequestOptions<never>) {
    return API.request<TResponse>('DELETE', url, options)
  }
}
