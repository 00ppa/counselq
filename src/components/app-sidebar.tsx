import { Link, useRouterState } from "@tanstack/react-router";
import { Scale, CalendarClock, FolderLock, Sparkles, FileSignature, BookOpen } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Cause List", url: "/causelist", icon: CalendarClock },
  { title: "Registry", url: "/registry", icon: FileSignature },
  { title: "Research", url: "/research", icon: Sparkles },
  { title: "Case Desk", url: "/casedesk", icon: FolderLock },
] as const;

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md overflow-hidden">
            <img src="/logo.jpg" alt="CounselQ" className="h-full w-full object-cover" />
          </span>
          {!collapsed && (
            <Link to="/" className="leading-tight hover:opacity-80 transition-opacity">
              <img src="/logo.jpg" alt="CounselQ" className="h-8 object-contain" />
            </Link>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
