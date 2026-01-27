export function shortUrl(url?: string) {
  if (!url) return ''
  const normalized = url.startsWith('http') ? url : `https://${url}`
  try {
    return new URL(normalized).host
  } catch {
    return url
  }
}

export function isValidUrlOrEmpty(v: string) {
  if (!v) return false
  try {
    new URL(v)
    return true
  } catch {
    return false
  }
}
