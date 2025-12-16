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
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="glass-medium rounded-3xl p-8 border border-border/50 shadow-soft relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-20 h-20 rounded-3xl gradient-warm flex items-center justify-center text-4xl shadow-colored-primary transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {event.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">{event.title}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="group glass-medium rounded-3xl p-6 shadow-soft border-2 border-transparent hover:border-primary/10 transition-all duration-300 flex items-center gap-6 hover-lift">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <ProgressRing progress={progress} size={100} strokeWidth={8} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">進捗状況</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{completedCount}</span>
              <span className="text-xl font-medium text-muted-foreground">/{tasksWithStatus.length}</span>
            </div>
            <p className="text-xs font-semibold text-primary mt-1">タスク完了</p>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="group glass-medium rounded-3xl p-6 shadow-soft border-2 border-transparent hover:border-green-500/10 transition-all duration-300 hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
              <Coins className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">獲得可能な給付金</p>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            ¥{totalBenefits.toLocaleString()}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            申請済み: ¥{claimedBenefits.toLocaleString()}
          </div>
        </div>

        {/* Remaining Benefits Card */}
        <div className="group rounded-3xl p-6 shadow-soft border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 hover:border-amber-300/50 transition-all duration-300 hover-lift relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-16 -mt-16 animate-pulse-soft" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-500">まだもらえます！</p>
          </div>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-500 mb-2 relative z-10">
            ¥{remainingBenefits.toLocaleString()}
          </p>
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 relative z-10">
            あと{tasksWithStatus.filter(t => !t.completed && t.benefitAmount).length}件の申請で獲得可能です
          </p>
        </div>
      </div>

      {/* Achievement Banner */}
      {progress >= 50 && (
        <div className="relative overflow-hidden rounded-3xl p-6 flex items-center gap-5 shadow-lg animate-scale-in group border-2 border-primary/20">
          <div className="absolute inset-0 gradient-warm opacity-10 group-hover:opacity-15 transition-opacity" />
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-md" />

          <div className="relative z-10 w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center shadow-colored-primary group-hover:scale-110 transition-transform duration-300">
            <Trophy className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="relative z-10">
            <p className="text-lg font-bold text-foreground mb-1">素晴らしい進捗です！</p>
            <p className="text-muted-foreground">
              {progress >= 100
                ? 'すべての手続きが完了しました！お疲れ様でした 🎉'
                : `あなたは上位${Math.round(100 - progress)}%の効率で手続きを進めています`}
            </p>
          </div>
        </div>
      )}

      {/* View & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-light p-4 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground flex-shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                filter === f.value
                  ? "gradient-warm text-primary-foreground shadow-glow scale-105"
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl backdrop-blur-sm border border-border/50">
          <button
            onClick={() => setView('list')}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              view === 'list' ? "bg-background shadow-sm text-primary scale-105" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
            title="リスト表示"
          >
            <ListTodo className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('timeline')}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              view === 'timeline' ? "bg-background shadow-sm text-primary scale-105" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
            title="タイムライン表示"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
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
        <div className="text-center py-16 glass-light rounded-3xl border-2 border-dashed border-border/50">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">該当するタスクがありません</h3>
          <p className="text-muted-foreground text-sm">条件を変更して再度お試しください</p>
        </div>
      )}
    </div>
  );
}
