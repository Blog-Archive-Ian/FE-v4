import { MENU_ITEMS } from '@/constants/menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@blog/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'

export function AppSidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Archive BO</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item) => {
                const hasChildren = !!item.children?.length

                const isSectionActive =
                  (item.url && pathname.startsWith(item.url)) ||
                  item.children?.some((c) => c.url && pathname.startsWith(c.url)) ||
                  false

                if (!hasChildren) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={!!item.url && pathname === item.url}>
                        <Link to={item.url as any}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={isSectionActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <CollapsibleTrigger className="flex w-full items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                      </SidebarMenuButton>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children!.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={!!child.url && pathname === child.url}
                              >
                                <Link to={child.url as any}>
                                  <child.icon />
                                  <span>{child.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
