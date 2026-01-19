export const stripMarkdown = (markdown: string) => {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 ![alt](url)
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1') // 링크 [text](url)
    .replace(/(```[\s\S]*?```)/g, '') // 코드 블럭 ```code```
    .replace(/`([^`]+)`/g, '$1') // 인라인 코드 `code`
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold, italic 등
    .replace(/^>\s+/gm, '') // blockquote
    .replace(/#+\s+/g, '') // heading
    .replace(/[-+*]\s+/g, '') // unordered list
    .replace(/\d+\.\s+/g, '') // ordered list
    .replace(/---/g, '') // horizontal rule
    .replace(/\r?\n|\r/g, ' ') // 줄바꿈 제거
    .replace(/\s+/g, ' ') // 연속 공백 제거
    .replace(/<[^>]*>/g, '')
    .trim()
}

export const formatKoreanDate = (iso: string) => {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}년 ${mm}월 ${dd}일 ${hh}:${min}`
}
