export const CacheTags = {
  Post: {
    list: 'post:list',
    pinned: 'post:pinned',
    popular: 'post:popular',
    detail: 'post:detail',
    byId: (postSeq: number | string) => `post:${postSeq}`,
    calendar: (year: number, month: number) => `post:calendar:${year}-${month}`,
    all: 'post:all',
  },
  User: {
    account: 'user:account',
    categories: 'user:categories',
    tags: 'user:tags',
    all: 'user:all',
  },
} as const
