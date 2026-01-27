import { router } from '@/router'
import { type ToOptions } from '@tanstack/react-router'
import { Archive, FileText, LayoutDashboard, Pin, SquarePen, UserCog } from 'lucide-react'
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
    icon: LayoutDashboard,
  },
  {
    title: 'User',
    url: '/user/info',
    icon: UserCog,
  },
  {
    title: 'Posts',
    icon: FileText,
    children: [
      {
        title: 'All Posts',
        url: '/posts/list',
        icon: FileText,
      },
      {
        title: 'Archived',
        url: '/posts/archived/list',
        icon: Archive,
      },
      {
        title: 'Pinned',
        url: '/posts/pinned/list',
        icon: Pin,
      },
      {
        title: 'Create',
        url: '/posts/new',
        icon: SquarePen,
      },
    ],
  },
]
