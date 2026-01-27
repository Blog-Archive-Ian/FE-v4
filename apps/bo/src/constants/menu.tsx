import { router } from '@/router'
import { type ToOptions } from '@tanstack/react-router'
import { Calendar, Home, Inbox, Search } from 'lucide-react'

interface MenuItem {
  title: string
  url?: ToOptions<typeof router>['to']
  icon: React.ComponentType<any>
  children?: MenuItem[]
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'User',
    url: '/user/info',
    icon: Inbox,
  },
  {
    title: 'Posts',
    icon: Calendar,
    children: [
      {
        title: 'All Posts',
        url: '/posts/list',
        icon: Search,
      },
      {
        title: 'Archived',
        url: '/posts/archived/list',
        icon: Search,
      },
      {
        title: 'Pinned',
        url: '/posts/pinned/list',
        icon: Search,
      },
      {
        title: 'Create',
        url: '/posts/new',
        icon: Search,
      },
    ],
  },
]
