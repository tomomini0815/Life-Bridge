import { useState, useCallback } from 'react';
import { LifeEventType } from '@/types/lifeEvent';
import { lifeEvents } from '@/data/lifeEvents';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHome } from '@/components/DashboardHome';
import { EventDashboard } from '@/components/EventDashboard';
import { ChatWidget } from '@/components/ChatWidget';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardLayout() {
  const [activeEvent, setActiveEvent] = useState<LifeEventType | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({
    marriage: [],
    birth: ['birth-2'], // Example: Some tasks already completed
    job: [],
    moving: ['moving-3'],
    care: [],
  });

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

  const selectedEvent = activeEvent ? lifeEvents.find(e => e.id === activeEvent) : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeEvent={activeEvent} onSelectEvent={handleSelectEvent} />
        
        <SidebarInset className="flex-1">
          {/* Top Header */}
          <header className="sticky top-0 z-40 h-14 glass border-b border-border/50 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <div className="hidden md:flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="タスクを検索..."
                  className="bg-transparent text-sm focus:outline-none w-48 placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
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
        </SidebarInset>
      </div>
      
      <ChatWidget />
    </SidebarProvider>
  );
}
