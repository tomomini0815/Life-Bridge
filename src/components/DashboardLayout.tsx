import { useState, useCallback } from 'react';
import { LifeEventType } from '@/types/lifeEvent';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHome } from '@/components/DashboardHome';
import { EventDashboard } from '@/components/EventDashboard';
import { Search, Bell, User, ScanLine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lifeEvents } from '@/data/lifeEvents';
import { DocumentScanner } from '@/components/DocumentScanner';
import { ChatWidget } from '@/components/ChatWidget';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function DashboardLayout() {
  const [activeEvent, setActiveEvent] = useState<LifeEventType | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({
    marriage: [],
    birth: ['birth-2'], // Example: Some tasks already completed
    job: [],
    moving: ['moving-3'],
    care: [],
  });
  const [showGlobalScanner, setShowGlobalScanner] = useState(false);

  const handleSelectEvent = useCallback((eventId: LifeEventType | null) => {
    setActiveEvent(eventId);
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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white"> {/* Pure white background */}
        <AppSidebar activeEvent={activeEvent} onSelectEvent={handleSelectEvent} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-transparent"> {/* Allow parent bg to show through */}
          {/* Top Header */}
          <header className="sticky top-0 z-40 h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-black/5 bg-white/80 backdrop-blur-md flex">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-800" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="relative hidden md:block w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="知りたいこと、やりたいことは何ですか..."
                  className="pl-10 h-10 w-full rounded-full bg-white border-slate-200 focus:border-teal-400 focus:ring-teal-400/20 shadow-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors rounded-full w-10 h-10">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-background animate-glow-pulse" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full w-10 h-10">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            {selectedEvent ? (
              <EventDashboard
                event={selectedEvent}
                completedTaskIds={completedTasks[selectedEvent.id] || []}
                onToggleTask={(taskId) => handleToggleTask(selectedEvent.id, taskId)}
              />
            ) : (
              <DashboardHome
                onSelectEvent={handleSelectEvent}
                completedTasks={completedTasks}
              />
            )}
          </main>

          {/* Global Magic Scan FAB */}
          <div className="fixed bottom-24 right-6 z-40 animate-fade-in">
            <Button
              onClick={() => setShowGlobalScanner(true)}
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group border border-white/10"
            >
              <ScanLine className="w-6 h-6" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded-md shadow-sm pointer-events-none border border-border/50">
                Magic Scan
              </span>
            </Button>
          </div>

          <DocumentScanner
            isOpen={showGlobalScanner}
            onClose={() => setShowGlobalScanner(false)}
            onScanComplete={handleGlobalScanComplete}
          />
        </div>
      </div>

      <ChatWidget currentContext={activeEvent as any} />
    </SidebarProvider>
  );
}
