import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Heart,
  Baby,
  Briefcase,
  Rocket,
  Truck,
  HandHeart,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  StickyNote,
  Calculator,
  Bell,
} from 'lucide-react';
import { LifeEventType } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface AppSidebarProps {
  activeEvent: LifeEventType | null;
  onSelectEvent: (eventId: LifeEventType | null) => void;
  onSelectPage?: (page: string) => void;
  activePage?: string;
}

export function AppSidebar({ activeEvent, onSelectEvent, onSelectPage, activePage }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Initialize state from localStorage to avoid flash of incorrect content
  const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lifebridge_menu_visibility');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse menu visibility settings:', e);
        }
      }
    }
    return {}; // Default fallbacks (all visible imply true if not explicitly false)
  });

  // Listen for settings changes from Settings component
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      setMenuVisibility(event.detail);
    };

    window.addEventListener('menuVisibilityChanged', handleSettingsChange as EventListener);

    // Also handle storage events for cross-tab synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lifebridge_menu_visibility' && event.newValue) {
        try {
          setMenuVisibility(JSON.parse(event.newValue));
        } catch (e) {
          console.error('Storage sync error:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('menuVisibilityChanged', handleSettingsChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const menuItems = [
    { title: 'ホーム', icon: Home, id: null, type: 'event' as const },
    { title: '結婚', icon: Heart, id: 'marriage', color: 'text-pink-100', type: 'event' as const },
    { title: '出産', icon: Baby, id: 'birth', color: 'text-orange-100', type: 'event' as const },
    { title: '転職', icon: Briefcase, id: 'job', color: 'text-sky-100', type: 'event' as const },
    { title: '起業', icon: Rocket, id: 'startup', color: 'text-purple-100', type: 'event' as const },
    { title: '引越し', icon: Truck, id: 'moving', color: 'text-emerald-100', type: 'event' as const },
    { title: '介護', icon: HandHeart, id: 'care', color: 'text-violet-100', type: 'event' as const },
  ].filter(item => item.id === null || menuVisibility[item.id] !== false); // Explicitly check for false to default to true

  const toolItems = [
    { title: 'メモ帳', icon: StickyNote, id: 'memo', color: 'text-amber-100', type: 'page' as const },
    { title: 'サブスク管理', icon: Bell, id: 'reminders', color: 'text-blue-100', type: 'page' as const },
    { title: '給付金試算', icon: Calculator, id: 'simulator', color: 'text-green-100', type: 'page' as const },
  ].filter(item => {
    // Map tool IDs to settings keys if they differ (currently 'memo' maps to 'memos' in settings)
    const settingsKey = item.id === 'memo' ? 'memos' : (item.id === 'simulator' ? 'benefits' : item.id);
    return menuVisibility[settingsKey] !== false;
  });

  const activeIndex = menuItems.findIndex((item) => item.id === activeEvent && !activePage);
  const activeToolIndex = toolItems.findIndex((item) => item.id === activePage);

  const settingsItems = [
    { title: '設定', icon: Settings },
    { title: 'ヘルプ', icon: HelpCircle },
  ];

  const { setOpenMobile } = useSidebar();

  const handleMenuClick = (callback: () => void) => {
    callback();
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="!border-r-0 border-none transition-all duration-300 z-30" style={{ background: 'var(--sidebar-gradient)' }}>
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-md flex items-center justify-center border border-primary/20 shadow-inner-glow flex-shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5 transition-all duration-300">
              <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 12L12 9L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            </svg>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-opacity duration-200">
            <span className="font-bold text-lg tracking-tight text-white">LifeBridge</span>
            <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">AI Partner</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4 scrollbar-none">
        <SidebarGroup>
          <SidebarGroupLabel className={cn("px-4 text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider mb-2", isCollapsed && "sr-only")}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="relative gap-0">
              {/* Sliding Active Indicator */}
              {activeIndex !== -1 && (
                <div
                  className={cn(
                    "absolute left-0 z-10 bg-white dark:bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left pointer-events-none",
                    isCollapsed ? "h-8" : "h-12"
                  )}
                  style={{
                    top: `${activeIndex * (isCollapsed ? 2 : 3)}rem`,
                    width: 'calc(100% + 1.5rem)',
                    borderRadius: isCollapsed ? "16px 0 0 16px" : "30px 0 0 30px",
                    marginRight: '-1.5rem',
                    paddingRight: '1.5rem',
                  }}
                >
                  {/* Top Curve */}
                  <div className={cn("absolute right-0 bg-transparent", isCollapsed ? "-top-[15px] w-4 h-4" : "-top-[23px] w-6 h-6")}>
                    <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isCollapsed ? (
                        <path d="M16 16H0C9.3 16 16 9.3 16 0V16Z" className="fill-white dark:fill-background" />
                      ) : (
                        <path d="M24 24H0C14 24 24 14 24 0V24Z" className="fill-white dark:fill-background" />
                      )}
                    </svg>
                  </div>
                  {/* Bottom Curve */}
                  <div className={cn("absolute right-0 bg-transparent", isCollapsed ? "-bottom-[15px] w-4 h-4" : "-bottom-[23px] w-6 h-6")}>
                    <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isCollapsed ? (
                        <path d="M16 0H0C9.3 0 16 6.7 16 16V0Z" className="fill-white dark:fill-background" />
                      ) : (
                        <path d="M24 0H0C14 0 24 10 24 24V0Z" className="fill-white dark:fill-background" />
                      )}
                    </svg>
                  </div>
                </div>
              )}

              {menuItems.map((item) => {
                const isActive = activeEvent === item.id && !activePage;
                const handleSelect = () => handleMenuClick(() => onSelectEvent(item.id as LifeEventType | null));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={handleSelect}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        "w-full h-12 text-base font-medium transition-[color,transform] duration-300 relative group z-20",
                        isCollapsed ? "justify-center pl-0" : "justify-start pl-4",
                        isActive
                          ? "text-primary hover:text-primary bg-transparent hover:bg-transparent data-[active=true]:bg-transparent"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      style={{
                        borderRadius: isActive && !isCollapsed ? "30px 0 0 30px" : "16px"
                      }}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform duration-300 flex-shrink-0",
                          isCollapsed ? "w-4 h-4" : "w-5 h-5",
                          !isCollapsed && "mr-2",
                          isActive ? "scale-110" : "group-hover:scale-110",
                          item.color && !isActive && "opacity-90"
                        )}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="relative z-10">{item.title}</span>
                          {isActive && <ChevronRight className="ml-auto w-5 h-5 opacity-50" />}
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn("px-4 text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider mb-2", isCollapsed && "sr-only")}>
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="relative gap-0">
              {/* Sliding Active Indicator for Tools */}
              {activeToolIndex !== -1 && (
                <div
                  className={cn(
                    "absolute left-0 z-10 bg-white dark:bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left pointer-events-none",
                    isCollapsed ? "h-8" : "h-12"
                  )}
                  style={{
                    top: `${activeToolIndex * (isCollapsed ? 2 : 3)}rem`,
                    width: 'calc(100% + 1.5rem)',
                    borderRadius: isCollapsed ? "16px 0 0 16px" : "30px 0 0 30px",
                    marginRight: '-1.5rem',
                    paddingRight: '1.5rem',
                  }}
                >
                  {/* Top Curve */}
                  <div className={cn("absolute right-0 bg-transparent", isCollapsed ? "-top-[15px] w-4 h-4" : "-top-[23px] w-6 h-6")}>
                    <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isCollapsed ? (
                        <path d="M16 16H0C9.3 16 16 9.3 16 0V16Z" className="fill-white dark:fill-background" />
                      ) : (
                        <path d="M24 24H0C14 24 24 14 24 0V24Z" className="fill-white dark:fill-background" />
                      )}
                    </svg>
                  </div>
                  {/* Bottom Curve */}
                  <div className={cn("absolute right-0 bg-transparent", isCollapsed ? "-bottom-[15px] w-4 h-4" : "-bottom-[23px] w-6 h-6")}>
                    <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isCollapsed ? (
                        <path d="M16 0H0C9.3 0 16 6.7 16 16V0Z" className="fill-white dark:fill-background" />
                      ) : (
                        <path d="M24 0H0C14 0 24 10 24 24V0Z" className="fill-white dark:fill-background" />
                      )}
                    </svg>
                  </div>
                </div>
              )}

              {toolItems.map((item) => {
                const isActive = activePage === item.id;
                const handleSelect = () => {
                  handleMenuClick(() => {
                    if (onSelectPage) {
                      onSelectPage(item.id);
                    }
                  });
                };

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={handleSelect}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        "w-full h-12 text-base font-medium transition-[color,transform] duration-300 relative group z-20",
                        isCollapsed ? "justify-center pl-0" : "justify-start pl-4",
                        isActive
                          ? "text-primary hover:text-primary bg-transparent hover:bg-transparent data-[active=true]:bg-transparent"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      style={{
                        borderRadius: isActive && !isCollapsed ? "30px 0 0 30px" : "16px"
                      }}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform duration-300 flex-shrink-0",
                          isCollapsed ? "w-4 h-4" : "w-5 h-5",
                          !isCollapsed && "mr-2",
                          isActive ? "scale-110" : "group-hover:scale-110",
                          item.color && !isActive && "opacity-90"
                        )}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="relative z-10">{item.title}</span>
                          {isActive && <ChevronRight className="ml-auto w-5 h-5 opacity-50" />}
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={cn("px-4 text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider mb-2", isCollapsed && "sr-only")}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => {
                const isSettingsPage = item.title === '設定';
                const isHelpPage = item.title === 'ヘルプ';
                const isActive = (activePage === 'settings' && isSettingsPage) || (activePage === 'help' && isHelpPage);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => {
                        if (onSelectPage) {
                          if (isSettingsPage) {
                            handleMenuClick(() => onSelectPage('settings'));
                          } else if (isHelpPage) {
                            handleMenuClick(() => onSelectPage('help'));
                          }
                        }
                      }}
                      className={cn(
                        "text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-colors duration-200 rounded-2xl h-11 pl-4 text-base font-medium",
                        isCollapsed && "justify-center pl-0",
                        isActive && "bg-white/10 text-white"
                      )}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        {!isCollapsed ? (
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0">
                T
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Tomomi</p>
                <p className="text-xs text-white/60 truncate">Premium</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="ghost" size="sm" className="h-8 w-full justify-start text-white/80 hover:bg-white/20 hover:text-white px-2">
                <Settings className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs">設定</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-full justify-start text-white/80 hover:bg-white/20 hover:text-white px-2">
                <LogOut className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs">ログアウト</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer">
              T
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
