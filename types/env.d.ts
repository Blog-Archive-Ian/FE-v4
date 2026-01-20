declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API: string
    NEXT_PUBLIC_GITHUB_REPO: string
    NEXT_PUBLIC_BLOG_ID: string

    NEXT_PUBLIC_FIREBASE_API_KEY: string
    NEXT_PUBLIC_FIREBASE_APP_ID: string
    NEXT_PUBLIC_AUTH_DOMAIN: string
    NEXT_PUBLIC_PROJECT_ID: string
    NEXT_PUBLIC_STORAGE_BUCKET: string
    NEXT_PUBLIC_MESSAGING_SENDER_ID: string

    NODE_ENV: 'development' | 'production' | 'test'
  }
}
