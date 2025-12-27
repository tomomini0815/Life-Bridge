import { useState, useCallback } from 'react';
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
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';
import { Search, Bell, User, ScanLine, Sparkles, UserCog } from 'lucide-react';
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

export function DashboardLayout() {
  const [activeEvent, setActiveEvent] = useState<LifeEventType | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({
    marriage: [],
    birth: ['birth-2'], // Example: Some tasks already completed
    job: [],
    startup: [],
    moving: ['moving-3'],
    care: [],
  });
  const [showGlobalScanner, setShowGlobalScanner] = useState(false);
  const [isScannerMinimized, setIsScannerMinimized] = useState(false);

  // Search State
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    if (selectedEvent) {
      // Use BusinessStartup component for startup event
      if (selectedEvent.id === 'startup') {
        return (
          <BusinessStartup
            event={selectedEvent}
            completedTaskIds={completedTasks[selectedEvent.id] || []}
            onToggleTask={(taskId) => handleToggleTask(selectedEvent.id, taskId)}
          />
        );
      }
      // Use regular EventDashboard for other events
      return (
        <EventDashboard
          event={selectedEvent}
          completedTaskIds={completedTasks[selectedEvent.id] || []}
          onToggleTask={(taskId) => handleToggleTask(selectedEvent.id, taskId)}
        />
      );
    }
    return (
      <DashboardHome
        onSelectEvent={handleSelectEvent}
        onNavigate={handleSelectPage}
        completedTasks={completedTasks}
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
              {/* Left: Site Name (Mobile) / Sidebar Trigger + Search (Desktop) */}
              <div className="flex items-center gap-2 flex-1">
                {/* Mobile: Site Name */}
                <div className="md:hidden flex items-center gap-2">
                  <LifeBridgeLogo className="w-8 h-8" />
                  <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
                    LifeBridge
                  </span>
                </div>

                {/* Desktop: Sidebar Trigger + Search */}
                <div className="hidden md:flex items-center gap-2 flex-1">
                  <SidebarTrigger className="-ml-4 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm w-9 h-9 [&_svg]:w-7 [&_svg]:h-7" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="relative w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="知りたいこと、やりたいことは何ですか..."
                      className="pl-10 h-10 w-full rounded-full bg-background border-input focus:border-primary focus:ring-primary/20 shadow-sm transition-all duration-300"
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
                      <div className="absolute top-12 left-0 w-full bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-[60vh] overflow-y-auto py-2">
                          {searchResults.map((result) => (
                            <button
                              key={`${result.type}-${result.id}`}
                              className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start gap-3 group/item"
                              onClick={() => {
                                if (result.type === 'page' && result.path) {
                                  handleSelectPage(result.path);
                                } else if (result.type === 'event' && result.eventId) {
                                  handleSelectEvent(result.eventId);
                                } else if (result.type === 'task' && result.eventId) {
                                  handleSelectEvent(result.eventId);
                                  // Optional: Scroll to task or highlight it
                                }
                                setIsSearchOpen(false);
                              }}
                            >
                              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                {result.icon || (result.type === 'page' ? '📄' : '🔍')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors truncate">
                                  {result.title}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {result.description}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium border",
                                    result.type === 'event' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                      result.type === 'task' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        "bg-slate-50 text-slate-600 border-slate-100"
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
                </div>
              </div>

              {/* Right: Hamburger Menu + Icons (Mobile) / Action Buttons (Desktop) */}
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

                {/* Desktop: Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
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
          <main className="p-6 pt-20 md:pt-6">
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

