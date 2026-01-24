import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  isAuthenticated: boolean
}

export const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
