import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  BookmarkCheck,
  LayoutTemplate,
  Settings as SettingsIcon,
  Info,
  Rocket,
  GraduationCap,
} from "lucide-react";
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
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Generate Startup", url: "/generate", icon: Sparkles },
  { title: "Assignments", url: "/assignments", icon: GraduationCap },
  { title: "Saved Reports", url: "/saved", icon: BookmarkCheck },
  { title: "Templates", url: "/templates", icon: LayoutTemplate },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
  { title: "About", url: "/about", icon: Info },
] as const;

/** Sidebar navigation. Keep each item as a real TanStack Router link. */
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (router) => router.location.pathname });

  return (
    <Sidebar collapsible="icon" className="no-print">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" aria-label="AI Startup Idea Generator home" className="flex items-center gap-2.5">
          <span className="gradient-brand grid size-9 shrink-0 place-items-center rounded-xl shadow-lg">
            <Rocket className="size-4 text-primary-foreground" />
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold">AI Startup</span>
              <span className="text-xs text-muted-foreground">Idea Generator</span>
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url} preload="intent" aria-label={item.title}>
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
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
