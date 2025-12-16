import { useState, useMemo } from 'react';
import { LifeEvent, Task, LifeEventType } from '@/types/lifeEvent';
import { TaskItem } from './TaskItem';
import { ProgressRing } from './ProgressRing';
import { cn } from '@/lib/utils';
import { 
  Filter, 
  Trophy, 
  Coins, 
  CheckCircle2,
  Sparkles,
  FileText,
  ListTodo,
  Clock
} from 'lucide-react';

interface EventDashboardProps {
  event: LifeEvent;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}

type FilterType = 'all' | 'government' | 'benefit' | 'private';
type ViewType = 'list' | 'timeline';

export function EventDashboard({ event, completedTaskIds, onToggleTask }: EventDashboardProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<ViewType>('list');

  const tasksWithStatus = useMemo(() => {
    return event.tasks.map(task => ({
      ...task,
      completed: completedTaskIds.includes(task.id)
    }));
  }, [event.tasks, completedTaskIds]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasksWithStatus;
    return tasksWithStatus.filter(task => task.category === filter);
  }, [tasksWithStatus, filter]);

  const completedCount = tasksWithStatus.filter(t => t.completed).length;
  const progress = (completedCount / tasksWithStatus.length) * 100;
  
  const totalBenefits = tasksWithStatus
    .filter(t => t.benefitAmount)
    .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);
  
  const claimedBenefits = tasksWithStatus
    .filter(t => t.completed && t.benefitAmount)
    .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);

  const remainingBenefits = totalBenefits - claimedBenefits;

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'government', label: '🏛️ 行政' },
    { value: 'benefit', label: '💰 給付金' },
    { value: 'private', label: '🏢 民間' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center text-2xl shadow-glow">
          {event.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Card */}
        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 flex items-center gap-5">
          <ProgressRing progress={progress} size={90} strokeWidth={6} />
          <div>
            <p className="text-sm text-muted-foreground">進捗状況</p>
            <p className="text-2xl font-bold">{completedCount}/{tasksWithStatus.length}</p>
            <p className="text-xs text-muted-foreground">タスク完了</p>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl gradient-warm flex items-center justify-center">
              <Coins className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">獲得可能な給付金</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ¥{totalBenefits.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            申請済み: ¥{claimedBenefits.toLocaleString()}
          </p>
        </div>

        {/* Remaining Benefits Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-soft border border-amber-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-amber-700">まだもらえます！</p>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            ¥{remainingBenefits.toLocaleString()}
          </p>
          <p className="text-sm text-amber-600 mt-1">
            あと{tasksWithStatus.filter(t => !t.completed && t.benefitAmount).length}件の申請で獲得
          </p>
        </div>
      </div>

      {/* Achievement Banner */}
      {progress >= 50 && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 flex items-center gap-4 animate-scale-in">
          <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">素晴らしい進捗です！</p>
            <p className="text-sm text-muted-foreground">
              {progress >= 100 
                ? 'すべての手続きが完了しました！お疲れ様でした 🎉' 
                : `あなたは上位${Math.round(100 - progress)}%の効率で手続きを進めています`}
            </p>
          </div>
        </div>
      )}

      {/* View & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                filter === f.value
                  ? "gradient-warm text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
          <button
            onClick={() => setView('list')}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === 'list' ? "bg-card shadow-soft" : "hover:bg-card/50"
            )}
          >
            <ListTodo className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('timeline')}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === 'timeline' ? "bg-card shadow-soft" : "hover:bg-card/50"
            )}
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-slide-up opacity-0"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <TaskItem
              task={task}
              onToggle={onToggleTask}
              eventColor={event.color}
            />
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">該当するタスクがありません</p>
        </div>
      )}
    </div>
  );
}
