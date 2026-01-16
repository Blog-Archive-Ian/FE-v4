import '../shared/styles/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { QueryProvider } from '../shared/providers/query-provider'
import { ThemeProvider } from '../shared/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog',
  description: 'My Next.js Blog with TanStack Query & shadcn',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
