import { useState } from 'react';
import { 
  Home, 
  Heart, 
  Baby, 
  Briefcase, 
  Truck, 
  HandHeart,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { LifeEventType } from '@/types/lifeEvent';

const eventItems = [
  { title: '結婚', id: 'marriage' as LifeEventType, icon: Heart, color: 'text-pink-500' },
  { title: '出産', id: 'birth' as LifeEventType, icon: Baby, color: 'text-orange-500' },
  { title: '転職', id: 'job' as LifeEventType, icon: Briefcase, color: 'text-blue-500' },
  { title: '引越し', id: 'moving' as LifeEventType, icon: Truck, color: 'text-emerald-500' },
  { title: '介護', id: 'care' as LifeEventType, icon: HandHeart, color: 'text-violet-500' },
];

const settingsItems = [
  { title: '設定', url: '/settings', icon: Settings },
  { title: 'ヘルプ', url: '/help', icon: HelpCircle },
];

interface AppSidebarProps {
  activeEvent: LifeEventType | null;
  onSelectEvent: (eventId: LifeEventType | null) => void;
}

export function AppSidebar({ activeEvent, onSelectEvent }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🌉</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold font-display">LifeBridge</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            メイン
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onSelectEvent(null)}
                  isActive={activeEvent === null}
                  tooltip="ホーム"
                >
                  <Home className="h-4 w-4" />
                  <span>ホーム</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            ライフイベント
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {eventItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectEvent(item.id)}
                    isActive={activeEvent === item.id}
                    tooltip={item.title}
                  >
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    <span>{item.title}</span>
                    {!isCollapsed && activeEvent === item.id && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            その他
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="ログアウト" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
