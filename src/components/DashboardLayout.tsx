import { useState, useCallback, useEffect } from 'react';
import { LifeEventType } from '@/types/lifeEvent';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHome } from '@/components/DashboardHome';
import { EventDashboard } from '@/components/EventDashboard';
import { BusinessStartup } from '@/components/BusinessStartup';
import { MemoManager } from '@/components/MemoManager';
import { BenefitSimulator } from '@/components/BenefitSimulator';
import { ReminderSettings } from '@/components/ReminderSettings';
import { Settings } from '@/components/Settings';
import { HelpPage } from '@/components/HelpPage';
import { ReverseScheduler } from '@/components/ReverseScheduler';
import { DecisionBoard } from '@/components/DecisionBoard';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';
import { Search, Bell, User, ScanLine, Sparkles, UserCog, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lifeEvents } from '@/data/lifeEvents';
import { DocumentScanner } from '@/components/DocumentScanner';
import { ChatWidget } from '@/components/ChatWidget';
import { UserContext } from '@/services/AiConciergeService';
import { toast } from 'sonner';
import { SearchService, SearchResult } from '@/services/SearchService';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/ProfileService';

export function DashboardLayout() {
  const { user } = useAuth();
  const [activeEvent, setActiveEvent] = useState<LifeEventType | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [userName, setUserName] = useState('ゲスト');
  const [profile, setProfile] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({
    marriage: [],
    birth: [],
    job: [],
    startup: [],
    moving: [],
    care: [],
  });
  const [userUrgentTasks, setUserUrgentTasks] = useState<Record<string, string[]>>({
    marriage: [],
    birth: [],
    job: [],
    startup: [],
    moving: [],
    care: [],
  });
  const [priorityEvents, setPriorityEvents] = useState<string[]>([]);
  const [showGlobalScanner, setShowGlobalScanner] = useState(false);
  const [isScannerMinimized, setIsScannerMinimized] = useState(false);

  // Search State
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync user ID with ProfileService and load completed tasks
  useEffect(() => {
    profileService.setUserId(user?.id || null);

    const initialProfile = profileService.getProfile();
    setUserName(initialProfile.name || 'ゲスト');
    setProfile(initialProfile);

    const unsubscribeProfile = profileService.subscribe((updatedProfile) => {
      setUserName(updatedProfile.name || 'ゲスト');
      setProfile(updatedProfile);
    });

    // Load completed tasks and urgent tasks from localStorage
    if (user?.id) {
      const completedKey = `lifebridge_completed_tasks_${user.id}`;
      const urgentKey = `lifebridge_urgent_tasks_${user.id}`;
      const priorityEvtsKey = `lifebridge_priority_events_${user.id}`;
      
      const storedCompleted = localStorage.getItem(completedKey);
      const storedUrgent = localStorage.getItem(urgentKey);
      const storedPriorityEvts = localStorage.getItem(priorityEvtsKey);

      if (storedCompleted) {
        try { setCompletedTasks(JSON.parse(storedCompleted)); } catch (e) { console.error(e); }
      } else {
        setCompletedTasks({ marriage: [], birth: [], job: [], startup: [], moving: [], care: [] });
      }

      if (storedUrgent) {
        try { setUserUrgentTasks(JSON.parse(storedUrgent)); } catch (e) { console.error(e); }
      } else {
        setUserUrgentTasks({ marriage: [], birth: [], job: [], startup: [], moving: [], care: [] });
      }

      if (storedPriorityEvts) {
        try { setPriorityEvents(JSON.parse(storedPriorityEvts)); } catch (e) { console.error(e); }
      } else {
        setPriorityEvents([]);
      }
    }

    return () => {
      unsubscribeProfile();
    };
  }, [user]);

  // Persist completed tasks and urgent tasks when they change
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`lifebridge_completed_tasks_${user.id}`, JSON.stringify(completedTasks));
      localStorage.setItem(`lifebridge_urgent_tasks_${user.id}`, JSON.stringify(userUrgentTasks));
      localStorage.setItem(`lifebridge_priority_events_${user.id}`, JSON.stringify(priorityEvents));
    }
  }, [completedTasks, userUrgentTasks, priorityEvents, user]);

  // Scroll to top when navigating between events or pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeEvent, activePage]);

  const handleSelectEvent = useCallback((eventId: LifeEventType | null) => {
    setActiveEvent(eventId);
    setActivePage(null); // Clear page when selecting event
  }, []);

  const handleSelectPage = useCallback((page: string) => {
    setActivePage(page);
    setActiveEvent(null); // Clear event when selecting page
  }, []);

  const handleToggleTask = useCallback((eventId: LifeEventType, taskId: string) => {
    setCompletedTasks(prev => {
      const eventTasks = prev[eventId] || [];
      const isCompleted = eventTasks.includes(taskId);

      return {
        ...prev,
        [eventId]: isCompleted
          ? eventTasks.filter(id => id !== taskId)
          : [...eventTasks, taskId]
      };
    });
  }, []);

  const handleToggleUrgentTask = useCallback((eventId: LifeEventType, taskId: string) => {
    setUserUrgentTasks(prev => {
      const eventTasks = prev[eventId] || [];
      const isUrgent = eventTasks.includes(taskId);

      return {
        ...prev,
        [eventId]: isUrgent
          ? eventTasks.filter(id => id !== taskId)
          : [...eventTasks, taskId]
      };
    });
  }, []);

  const handleTogglePriorityEvent = useCallback((eventId: string) => {
    setPriorityEvents(prev => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  }, []);

  const handleGlobalScanComplete = (data: any) => {
    toast.success("スキャン完了！", {
      description: "新しいドキュメントをマイボックスに保存しました",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    });
  };

  const selectedEvent = activeEvent ? lifeEvents.find(e => e.id === activeEvent) : null;

  // Render current page content
  const renderContent = () => {
    if (activePage === 'memo') {
      return <MemoManager />;
    }
    if (activePage === 'simulator') {
      return <BenefitSimulator />;
    }
    if (activePage === 'reminders') {
      return <ReminderSettings />;
    }
    if (activePage === 'settings') {
      return <Settings />;
    }
    if (activePage === 'help') {
      return <HelpPage />;
    }
    if (activePage === 'scheduler') {
      return <ReverseScheduler />;
    }
    if (activePage === 'decision') {
      return <DecisionBoard />;
    }
    if (selectedEvent) {
      // Use BusinessStartup component for startup event
      if (selectedEvent.id === 'startup') {
        return (
          <BusinessStartup
            event={selectedEvent}
            completedTaskIds={completedTasks[selectedEvent.id] || []}
            userUrgentTaskIds={userUrgentTasks[selectedEvent.id] || []}
            isPriorityEvent={priorityEvents.includes(selectedEvent.id)}
            onToggleTask={(taskId) => handleToggleTask(selectedEvent.id, taskId)}
            onToggleUrgentTask={(taskId) => handleToggleUrgentTask(selectedEvent.id, taskId)}
            onTogglePriorityEvent={() => handleTogglePriorityEvent(selectedEvent.id)}
          />
        );
      }
      // Use regular EventDashboard for other events
      return (
        <EventDashboard
          event={selectedEvent}
          completedTaskIds={completedTasks[selectedEvent.id] || []}
          userUrgentTaskIds={userUrgentTasks[selectedEvent.id] || []}
          isPriorityEvent={priorityEvents.includes(selectedEvent.id)}
          onToggleTask={(taskId) => handleToggleTask(selectedEvent.id, taskId)}
          onToggleUrgentTask={(taskId) => handleToggleUrgentTask(selectedEvent.id, taskId)}
          onTogglePriorityEvent={() => handleTogglePriorityEvent(selectedEvent.id)}
        />
      );
    }
    return (
      <DashboardHome
        onSelectEvent={handleSelectEvent}
        onNavigate={handleSelectPage}
        completedTasks={completedTasks}
        userUrgentTasks={userUrgentTasks}
        priorityEvents={priorityEvents}
      />
    );
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300"> {/* Dynamic background */}
        <AppSidebar
          activeEvent={activeEvent}
          onSelectEvent={handleSelectEvent}
          onSelectPage={handleSelectPage}
          activePage={activePage || undefined}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-transparent"> {/* Allow parent bg to show through */}
          {/* Top Header - Fixed on scroll */}
          <header className="fixed md:sticky top-0 left-0 right-0 z-50 h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">
            <div className="h-full px-4 flex items-center justify-between gap-2">
              {/* Left: Site Name (Mobile) / Sidebar Trigger + Greeting (Desktop) */}
              <div className="flex items-center gap-2 flex-1">
                {/* Mobile: Site Name */}
                <button
                  className="md:hidden flex items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={() => handleSelectEvent(null)}
                >
                  <LifeBridgeLogo className="w-8 h-8" />
                  <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
                    LifeBridge
                  </span>
                </button>

                {/* Desktop: Sidebar Trigger + Greeting */}
                <div className="hidden md:flex items-center gap-2 flex-1">
                  <SidebarTrigger className="-ml-4 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 shadow-sm w-9 h-9 [&_svg]:w-7 [&_svg]:h-7 [&_svg]:text-slate-600 dark:[&_svg]:text-slate-300" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  {activeEvent === null && activePage === null && (
                    <div className="flex items-center gap-3 animate-fade-in select-none">
                      <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-foreground leading-tight">こんにちは、{userName}さん</h1>
                        <p className="text-[10px] text-muted-foreground hidden lg:block leading-none mt-0.5">
                          人生の転機は、新しい物語の始まりです。複雑な手続きのナビゲートのお手伝いいたします。
                        </p>
                      </div>
                      {(!profile || !profile.name || profile.name === 'ゲスト') && (
                        <button
                          onClick={() => handleSelectPage('settings')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors shadow-sm shrink-0 cursor-pointer border-none"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          プロフィールを完成させましょう
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Hamburger Menu + Icons (Mobile) / Action Buttons + Search (Desktop) */}
              <div className="flex items-center gap-2">
                {/* Mobile: Notification + Account + Hamburger Menu */}
                <div className="md:hidden flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-primary/10 hover:text-primary transition-colors rounded-full w-11 h-11 [&_svg]:w-6 [&_svg]:h-6 text-slate-500"
                    onClick={() => handleSelectPage('reminders')}
                  >
                    <Bell />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive border border-background" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full w-11 h-11 [&_svg]:w-7 [&_svg]:h-7 text-slate-500"
                    onClick={() => handleSelectPage('settings')}
                  >
                    <UserCog />
                  </Button>
                  <SidebarTrigger className="w-11 h-11 p-0 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors [&_svg]:w-7 [&_svg]:h-7" />
                </div>

                {/* Desktop: Action Buttons & Search */}
                <div className="hidden md:flex items-center gap-3">
                  {/* Search Bar (Moved from Left, compacted to w-72) */}
                  <div className="relative w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="検索..."
                      className="pl-10 h-9 w-full rounded-full bg-background border-input focus:border-primary focus:ring-primary/20 shadow-sm transition-all duration-300 text-xs"
                      onChange={(e) => {
                        const query = e.target.value;
                        if (query.length > 0) {
                          const results = SearchService.getInstance().search(query);
                          setSearchResults(results);
                          setIsSearchOpen(true);
                        } else {
                          setSearchResults([]);
                          setIsSearchOpen(false);
                        }
                      }}
                      onFocus={() => {
                        if (searchResults.length > 0) setIsSearchOpen(true);
                      }}
                      onBlur={() => {
                        // Delay closing to allow clicking on results
                        setTimeout(() => setIsSearchOpen(false), 200);
                      }}
                    />

                    {/* Search Results Dropdown */}
                    {isSearchOpen && searchResults.length > 0 && (
                      <div className="absolute top-11 right-0 w-80 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-[60vh] overflow-y-auto py-2">
                          {searchResults.map((result) => (
                            <button
                              key={`${result.type}-${result.id}`}
                              className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-start gap-3 group/item"
                              onMouseDown={(e) => {
                                // Prevent input blur from closing the dropdown before select triggers
                                e.preventDefault();
                                
                                if (result.type === 'page' && result.path) {
                                  handleSelectPage(result.path);
                                } else if (result.type === 'event' && result.eventId) {
                                  handleSelectEvent(result.eventId);
                                } else if (result.type === 'task' && result.eventId) {
                                  handleSelectEvent(result.eventId);
                                }
                                setIsSearchOpen(false);
                              }}
                            >
                              <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                                {result.icon || (result.type === 'page' ? '📄' : '🔍')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-foreground group-hover/item:text-primary transition-colors truncate">
                                  {result.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate">
                                  {result.description}
                                </div>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-full font-medium border",
                                    result.type === 'event' ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30" :
                                      result.type === 'task' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" :
                                        "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-850 dark:text-slate-400 dark:border-slate-800"
                                  )}>
                                    {result.type === 'event' ? 'ライフイベント' :
                                      result.type === 'task' ? 'タスク' : 'ページ'}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-primary/10 hover:text-primary transition-colors rounded-full w-10 h-10 [&_svg]:w-6 [&_svg]:h-6"
                    onClick={() => handleSelectPage('reminders')}
                  >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-background animate-glow-pulse" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full w-10 h-10 [&_svg]:w-7 [&_svg]:h-7"
                    onClick={() => handleSelectPage('settings')}
                  >
                    <UserCog className="w-7 h-7" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 pt-16 md:p-3 md:pt-3 max-w-[1440px] mx-auto w-full">
            {renderContent()}
          </main>

          {/* Global Magic Scan FAB - Temporarily Disabled */}
          {false && (
            <div className={cn(
              "fixed z-40 animate-fade-in transition-all duration-300",
              isScannerMinimized ? "bottom-24 right-4 md:right-6" : "bottom-24 right-4 md:right-6"
            )}>
              <div className="relative">
                {!isScannerMinimized && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsScannerMinimized(true);
                    }}
                    size="icon"
                    className="absolute -top-1 -left-1 z-50 h-6 w-6 rounded-full bg-slate-500 hover:bg-slate-600 text-white shadow-md border border-white"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                )}

                <Button
                  onClick={() => setShowGlobalScanner(true)}
                  className={cn(
                    "rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border border-white/10",
                    isScannerMinimized
                      ? "h-10 w-10 hover:scale-110"
                      : "h-14 w-14 hover:scale-105"
                  )}
                >
                  <ScanLine className={cn("transition-all", isScannerMinimized ? "w-5 h-5" : "w-6 h-6")} />
                  {!isScannerMinimized && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded-md shadow-sm pointer-events-none border border-border/50">
                      Magic Scan
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {false && (
            <DocumentScanner
              isOpen={showGlobalScanner}
              onClose={() => setShowGlobalScanner(false)}
              onScanComplete={handleGlobalScanComplete}
            />
          )}
        </div>
      </div>

      <ChatWidget
        currentContext={
          activeEvent ||
          (activePage === 'memo' ? 'memo' :
            activePage === 'reminders' ? 'subscription' :
              activePage === 'simulator' ? 'simulator' :
                activePage === 'settings' ? 'settings' :
                  'general') as UserContext
        }
        onSelectEvent={handleSelectEvent}
      />
    </SidebarProvider>
  );
}

