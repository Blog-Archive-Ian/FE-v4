import '@blog/ui/styles/globals.css'

import type { Metadata } from 'next'

import { QueryProvider } from '../shared/providers/query-provider'
import { ThemeProvider } from '../shared/providers/theme-provider'

export const metadata: Metadata = {
  title: 'Archive | 기술블로그',
  description: "Ian's Tech Blog",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const resolved =
                    theme === 'dark' || theme === 'light'
                      ? theme
                      : systemDark
                      ? 'dark'
                      : 'light';

                  document.documentElement.classList.add(resolved);
                  document.documentElement.setAttribute('data-color-mode', resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
