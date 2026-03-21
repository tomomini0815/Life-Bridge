import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
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
import { Separator } from '@/components/ui/separator';
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
  HeartCrack,
  GraduationCap,
  PiggyBank,
  Building2,
  Calendar,
  Scale,
  Key,
  LayoutDashboard,
} from 'lucide-react';
import { LifeEventType } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { LifeBridgeLogo } from './ui/LifeBridgeLogo';
import { profileService } from '@/services/ProfileService';

interface AppSidebarProps {
  activeEvent: LifeEventType | null;
  onSelectEvent: (eventId: LifeEventType | null) => void;
  onSelectPage?: (page: string) => void;
  activePage?: string;
}

export function AppSidebar({ activeEvent, onSelectEvent, onSelectPage, activePage }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('ログアウトしました');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('ログアウトに失敗しました');
    }
  };


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, always show expanded state
  const isCollapsed = !isMobile && state === 'collapsed';

  // Initialize state from ProfileService to avoid flash of incorrect content
  const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>(() => {
    const profile = profileService.getProfile();
    return profile.settings || {};
  });

  // Listen for profile updates (which include settings and theme)
  useEffect(() => {
    const loadSettings = () => {
      const profile = profileService.getProfile();
      setMenuVisibility(profile.settings || {});
    };

    loadSettings();

    // Subscribe to ProfileService instead of custom events or storage events
    const unsubscribe = profileService.subscribe((profile) => {
      if (profile.settings) {
        setMenuVisibility(profile.settings);
      }
    });

    return unsubscribe;
  }, [user]);

  const menuItems = [
    { title: 'ホーム', icon: LayoutDashboard, id: null, type: 'event' as const },
    { title: '結婚', icon: Heart, id: 'marriage', color: 'text-pink-100', type: 'event' as const },
    { title: '出産', icon: Baby, id: 'birth', color: 'text-orange-100', type: 'event' as const },
    { title: '離婚', icon: HeartCrack, id: 'divorce', color: 'text-rose-100', type: 'event' as const },
    { title: '受験', icon: GraduationCap, id: 'exam', color: 'text-indigo-100', type: 'event' as const },
    { title: '転職', icon: Briefcase, id: 'job', color: 'text-sky-100', type: 'event' as const },
    { title: '起業', icon: Rocket, id: 'startup', color: 'text-purple-100', type: 'event' as const },
    { title: '引越し', icon: Truck, id: 'moving', color: 'text-emerald-100', type: 'event' as const },
    { title: 'マイホーム売買', icon: Home, id: 'homePurchase', color: 'text-cyan-100', type: 'event' as const },
    { title: '財務', icon: PiggyBank, id: 'finance', color: 'text-amber-100', type: 'event' as const },
    { title: '介護', icon: HandHeart, id: 'care', color: 'text-violet-100', type: 'event' as const },
    { title: '相続', icon: Building2, id: 'inheritance', color: 'text-stone-100', type: 'event' as const },
  ].filter(item => item.id === null || menuVisibility[item.id] !== false); // Explicitly check for false to default to true

  const toolItems = [
    { title: '目標の逆算プラン', icon: Calendar, id: 'scheduler', color: 'text-teal-100', type: 'page' as const },
    { title: '迷った時のA/B比較分析', icon: Scale, id: 'decision', color: 'text-amber-100', type: 'page' as const },
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
    { title: 'お問い合わせ', icon: HelpCircle },
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
      <SidebarHeader className="p-4 pb-2">
        <button
          onClick={() => {
            onSelectEvent(null);
            // Also close mobile sidebar if open
            if (window.innerWidth < 768) {
              setOpenMobile(false);
            }
          }}
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center hover:opacity-80 transition-opacity w-full text-left"
        >
          <LifeBridgeLogo className="w-10 h-10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 transition-all duration-300" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-opacity duration-200">
            <span className="font-bold text-lg tracking-tight text-white">LifeBridge</span>
            <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">AI Partner</span>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4 scrollbar-none group-data-[collapsible=icon]:!overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu className="relative gap-0">
              {/* Sliding Active Indicator */}
              {activeIndex !== -1 && (
                <div
                  className={cn(
                    "absolute left-0 z-10 bg-white dark:bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left pointer-events-none",
                    isCollapsed ? "h-12" : "h-12"
                  )}
                  style={{
                    top: `${activeIndex * (isCollapsed ? 3 : 3)}rem`,
                    width: isCollapsed ? 'calc(100% + 2rem + 2px)' : 'calc(100% + 1.5rem + 2px)',
                    borderRadius: isCollapsed ? "24px 0 0 24px" : "40px 0 0 40px",
                    marginRight: '-1.5rem',
                    paddingRight: '1.5rem',
                    left: isCollapsed ? "-0.5rem" : "0",
                  }}
                >
                  {/* Top Curve */}
                  <div className={cn("absolute right-[2px] bg-transparent", isCollapsed ? "-top-[15px] w-4 h-4" : "-top-[23px] w-6 h-6")}>
                    <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isCollapsed ? (
                        <path d="M16 16H0C9.3 16 16 9.3 16 0V16Z" className="fill-white dark:fill-background" />
                      ) : (
                        <path d="M24 24H0C14 24 24 14 24 0V24Z" className="fill-white dark:fill-background" />
                      )}
                    </svg>
                  </div>
                  {/* Bottom Curve */}
                  <div className={cn("absolute right-[2px] bg-transparent", isCollapsed ? "-bottom-[15px] w-4 h-4" : "-bottom-[23px] w-6 h-6")}>
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
                        isCollapsed ? "justify-center pl-0 gap-0" : "justify-start pl-4",
                        isActive
                          ? "text-primary hover:text-primary bg-transparent hover:bg-transparent data-[active=true]:bg-transparent"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      style={{
                        borderRadius: isActive && !isCollapsed ? "40px 0 0 40px" : "16px"
                      }}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform duration-300 flex-shrink-0",
                          isCollapsed ? "!w-7 !h-7" : "!w-5 !h-5",
                          isCollapsed ? "mr-0" : "mr-2",
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

        <Separator className="my-1 bg-white/10" />

        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu className="relative gap-0">
              {/* Sliding Active Indicator for Tools */}
              {activeToolIndex !== -1 && (
                <div
                  className={cn(
                    "absolute left-0 z-10 bg-white dark:bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left pointer-events-none",
                    isCollapsed ? "h-12" : "h-12"
                  )}
                  style={{
                    top: `${activeToolIndex * (isCollapsed ? 3 : 3)}rem`,
                    width: isCollapsed ? 'calc(100% + 2rem + 2px)' : 'calc(100% + 1.5rem + 2px)',
                    borderRadius: isCollapsed ? "24px 0 0 24px" : "40px 0 0 40px",
                    marginRight: '-1.5rem',
                    paddingRight: '1.5rem',
                    left: isCollapsed ? "-0.5rem" : "0",
                  }}
                >
                  {/* Top Curve */}
                  <div className={cn("absolute right-[2px] bg-transparent", isCollapsed ? "-top-[15px] w-4 h-4" : "-top-[23px] w-6 h-6")}>
                    <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isCollapsed ? (
                        <path d="M16 16H0C9.3 16 16 9.3 16 0V16Z" className="fill-white dark:fill-background" />
                      ) : (
                        <path d="M24 24H0C14 24 24 14 24 0V24Z" className="fill-white dark:fill-background" />
                      )}
                    </svg>
                  </div>
                  {/* Bottom Curve */}
                  <div className={cn("absolute right-[2px] bg-transparent", isCollapsed ? "-bottom-[15px] w-4 h-4" : "-bottom-[23px] w-6 h-6")}>
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
                        isCollapsed ? "justify-center pl-0 gap-0" : "justify-start pl-4",
                        isActive
                          ? "text-primary hover:text-primary bg-transparent hover:bg-transparent data-[active=true]:bg-transparent"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      style={{
                        borderRadius: isActive && !isCollapsed ? "40px 0 0 40px" : "16px"
                      }}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform duration-300 flex-shrink-0",
                          isCollapsed ? "!w-7 !h-7" : "!w-5 !h-5",
                          isCollapsed ? "mr-0" : "mr-2",
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

        <Separator className="my-1 bg-white/10" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="relative gap-0">
              {/* Sliding Active Indicator for Settings */}
              {(() => {
                const settingsActiveIndex = settingsItems.findIndex((item) => {
                  const isSettingsPage = item.title === '設定';
                  const isHelpPage = item.title === 'お問い合わせ';
                  return (activePage === 'settings' && isSettingsPage) || (activePage === 'help' && isHelpPage);
                });

                return settingsActiveIndex !== -1 ? (
                  <div
                    className={cn(
                      "absolute left-0 z-10 bg-white dark:bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left pointer-events-none",
                      isCollapsed ? "h-12" : "h-12"
                    )}
                    style={{
                      top: `${settingsActiveIndex * (isCollapsed ? 3 : 3)}rem`,
                      width: isCollapsed ? 'calc(100% + 2rem + 2px)' : 'calc(100% + 1.5rem + 2px)',
                      borderRadius: isCollapsed ? "24px 0 0 24px" : "40px 0 0 40px",
                      marginRight: '-1.5rem',
                      paddingRight: '1.5rem',
                      left: isCollapsed ? "-0.5rem" : "0",
                    }}
                  >
                    {/* Top Curve */}
                    <div className={cn("absolute right-[2px] bg-transparent", isCollapsed ? "-top-[15px] w-4 h-4" : "-top-[23px] w-6 h-6")}>
                      <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                        {isCollapsed ? (
                          <path d="M16 16H0C9.3 16 16 9.3 16 0V16Z" className="fill-white dark:fill-background" />
                        ) : (
                          <path d="M24 24H0C14 24 24 14 24 0V24Z" className="fill-white dark:fill-background" />
                        )}
                      </svg>
                    </div>
                    {/* Bottom Curve */}
                    <div className={cn("absolute right-[2px] bg-transparent", isCollapsed ? "-bottom-[15px] w-4 h-4" : "-bottom-[23px] w-6 h-6")}>
                      <svg width="100%" height="100%" viewBox={isCollapsed ? "0 0 16 16" : "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
                        {isCollapsed ? (
                          <path d="M16 0H0C9.3 0 16 6.7 16 16V0Z" className="fill-white dark:fill-background" />
                        ) : (
                          <path d="M24 0H0C14 0 24 10 24 24V0Z" className="fill-white dark:fill-background" />
                        )}
                      </svg>
                    </div>
                  </div>
                ) : null;
              })()}

              {settingsItems.map((item) => {
                const isSettingsPage = item.title === '設定';
                const isHelpPage = item.title === 'お問い合わせ';
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
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        "w-full h-12 text-base font-medium transition-[color,transform] duration-300 relative group z-20",
                        isCollapsed ? "justify-center pl-0 gap-0" : "justify-start pl-4",
                        isActive
                          ? "text-primary hover:text-primary bg-transparent hover:bg-transparent data-[active=true]:bg-transparent"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      style={{
                        borderRadius: isActive && !isCollapsed ? "40px 0 0 40px" : "16px"
                      }}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform duration-300 flex-shrink-0",
                          isCollapsed ? "!w-7 !h-7" : "!w-5 !h-5",
                          isCollapsed ? "mr-0" : "mr-2",
                          isActive ? "scale-110" : "group-hover:scale-110"
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
      </SidebarContent>

      <SidebarFooter className={cn("transition-all duration-300", isCollapsed ? "p-2" : "p-6")}>
        {!isCollapsed ? (
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name || "User"}
                  className="w-8 h-8 rounded-full shadow-lg flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Guest User"}
                </p>
                <p className="text-xs text-white/60 truncate">{user?.email || "Sign in required"}</p>
              </div>
            </div>
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-start text-white/80 hover:bg-white/20 hover:text-white px-2"
                onClick={handleLogout}
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs">ログアウト</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-white/10 rounded-2xl p-1.5 backdrop-blur-sm border border-white/10 flex-shrink-0">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name || "User"}
                  className="w-8 h-8 rounded-full shadow-lg cursor-pointer object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

