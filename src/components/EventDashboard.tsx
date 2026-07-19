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
  ArrowLeft,
  Heart,
  Baby,
  Briefcase,
  Rocket,
  Truck,
  HandHeart,
  Landmark,
  Building,
  Building2,
  PiggyBank,
  HeartCrack,
  GraduationCap,
  Home,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventDashboardProps {
  event: LifeEvent;
  completedTaskIds: string[];
  userUrgentTaskIds: string[];
  isPriorityEvent?: boolean;
  onToggleTask: (taskId: string) => void;
  onToggleUrgentTask: (taskId: string) => void;
  onTogglePriorityEvent?: () => void;
}

type FilterType = 'all' | 'government' | 'benefit' | 'private';
type ViewType = 'list' | 'timeline';

const iconMap: Record<string, React.ElementType> = {
  marriage: Heart,
  birth: Baby,
  divorce: HeartCrack,
  exam: GraduationCap,
  job: Briefcase,
  startup: Rocket,
  moving: Truck,
  finance: PiggyBank,
  care: HandHeart,
  inheritance: Building2,
  homePurchase: Home,
};

export function EventDashboard({ event, completedTaskIds, userUrgentTaskIds, isPriorityEvent, onToggleTask, onToggleUrgentTask, onTogglePriorityEvent }: EventDashboardProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<ViewType>('list');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(event.taskGroups?.[0]?.id || null);

  const tasksWithStatus = useMemo(() => {
    return event.tasks.map(task => ({
      ...task,
      completed: completedTaskIds.includes(task.id)
    }));
  }, [event.tasks, completedTaskIds]);

  const filteredTasksByGroup = useMemo(() => {
    if (!activeGroupId) return tasksWithStatus;
    return tasksWithStatus.filter(task => task.groupId === activeGroupId);
  }, [tasksWithStatus, activeGroupId]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return filteredTasksByGroup;
    return filteredTasksByGroup.filter(task => task.category === filter);
  }, [filteredTasksByGroup, filter]);

  const completedCount = tasksWithStatus.filter(t => t.completed).length;
  const progress = (completedCount / tasksWithStatus.length) * 100;

  const totalBenefits = tasksWithStatus
    .filter(t => t.benefitAmount)
    .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);

  const claimedBenefits = tasksWithStatus
    .filter(t => t.completed && t.benefitAmount)
    .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);

  const remainingBenefits = totalBenefits - claimedBenefits;

  const filters: { value: FilterType; label: React.ReactNode }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'government', label: <span className="flex items-center gap-2"><Landmark className="w-4 h-4" /> 行政</span> },
    { value: 'benefit', label: <span className="flex items-center gap-2"><Coins className="w-4 h-4" /> 給付金</span> },
    { value: 'private', label: <span className="flex items-center gap-2"><Building className="w-4 h-4" /> 民間</span> },
  ];

  return (
    <div className="space-y-4 animate-fade-in max-w-none mx-auto pb-4">
      {/* Header */}
      <div className="glass-medium rounded-2xl p-4 md:p-5 border border-border/50 shadow-soft relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl gradient-warm flex items-center justify-center text-3xl sm:text-4xl shadow-colored-primary transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
              {(() => {
                const Icon = iconMap[event.id] || Heart;
                return <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
              })()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2 font-display">{event.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{event.description}</p>
            </div>
          </div>
          
          {onTogglePriorityEvent && (
            <div className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePriorityEvent}
                className={cn(
                  "rounded-full transition-all flex items-center gap-2 px-4 shadow-sm border-2 h-10",
                  isPriorityEvent 
                    ? "border-amber-400 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20" 
                    : "border-border hover:bg-muted text-muted-foreground"
                )}
              >
                <Star className={cn("w-4 h-4", isPriorityEvent ? "fill-current" : "")} />
                <span className="font-bold">{isPriorityEvent ? '優先順位: オン' : '優先順位: オフ'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="group glass-medium rounded-2xl p-4 shadow-soft border-2 border-transparent hover:border-primary/10 transition-all duration-300 flex items-center gap-6 hover-lift">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <ProgressRing progress={progress} size={100} strokeWidth={8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1 truncate">進捗状況</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{completedCount}</span>
              <span className="text-lg font-medium text-muted-foreground">/{tasksWithStatus.length}</span>
            </div>
            <p className="text-[10px] font-semibold text-primary mt-1">タスク完了</p>
          </div>
        </div>

        {/* Benefits Card */}
        <div className={cn(
          "group glass-medium rounded-2xl p-4 shadow-soft border-2 border-transparent transition-all duration-300 hover-lift",
          totalBenefits === 0 ? "opacity-60 grayscale cursor-not-allowed" : "hover:border-green-500/10"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
              <Coins className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">獲得可能な給付金</p>
          </div>
          <p className="text-2xl font-bold text-foreground mb-2 truncate">
            ¥{totalBenefits.toLocaleString()}
          </p>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-green-700 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-lg border border-green-200/50">
            <CheckCircle2 className="w-3 h-3" />
            申請済み: ¥{claimedBenefits.toLocaleString()}
          </div>
        </div>

        {/* Remaining Benefits Card */}
        <div className={cn(
          "group rounded-2xl p-4 shadow-soft border-2 transition-all duration-300 hover-lift relative overflow-hidden",
          remainingBenefits === 0 
            ? "opacity-60 grayscale cursor-not-allowed border-muted bg-muted/10" 
            : "border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 hover:border-amber-300/50"
        )}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-16 -mt-16 animate-pulse-soft" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-500">
              {remainingBenefits === 0 ? "対象なし" : "まだもらえます！"}
            </p>
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-2 relative z-10 truncate">
            ¥{remainingBenefits.toLocaleString()}
          </p>
          <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 relative z-10">
            {remainingBenefits === 0 
              ? "現在対象となる未申請の給付金はありません" 
              : `あと${tasksWithStatus.filter(t => !t.completed && t.benefitAmount).length}件の申請で獲得可能です`
            }
          </p>
        </div>
      </div>

      {/* Achievement Banner */}
      {progress >= 50 && (
        <div className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-5 shadow-lg animate-scale-in group border-2 border-primary/20">
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
                : `あなたは上位${Math.round(100 - progress)}% の効率で手続きを進めています`}
            </p>
          </div>
        </div>
      )}

      {/* Group Tabs (e.g. Purchase vs Sale) */}
      {event.taskGroups && (
        <div className="flex p-1 bg-secondary/30 rounded-2xl border border-border/50 max-w-sm">
          {event.taskGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                activeGroupId === group.id
                  ? "bg-primary text-white shadow-md scale-[1.02]"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              {group.title}
            </button>
          ))}
        </div>
      )}

      {/* View & Filter Controls */}
      <div className="flex flex-row items-center justify-between gap-2 glass-light p-2 md:p-3 rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1 scrollbar-hide min-w-0 pr-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground flex-shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap",
                filter === f.value
                  ? "gradient-warm text-primary-foreground shadow-glow scale-105"
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl backdrop-blur-sm border border-border/50 flex-shrink-0 scale-90 sm:scale-100 origin-right">
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

      {/* Task List / Timeline */}
      <div className={cn("space-y-4 relative transition-all duration-300", view === 'timeline' && "pl-16 md:pl-24 ml-2 border-l-2 border-dashed border-border/50 pb-4")}>
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              "animate-slide-up opacity-0 relative",
              view === 'timeline' && "before:absolute before:-left-[calc(2rem+2px)] before:top-1/2 before:-translate-y-1/2 before:w-6 before:h-0.5 before:bg-border/50 before:content-[''] after:absolute after:-left-[calc(2.5rem+4px)] after:top-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:rounded-full after:bg-primary after:ring-4 after:ring-background after:content-['']"
            )}
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            {view === 'timeline' && task.deadline && (
              <div className="absolute -left-14 md:-left-24 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-bold text-muted-foreground bg-background/80 backdrop-blur-sm px-1.5 md:px-2 py-0.5 rounded-full border border-border shadow-sm z-10 whitespace-nowrap">
                {task.deadline}
              </div>
            )}
            <TaskItem
              task={task}
              onToggle={onToggleTask}
              onToggleUrgent={onToggleUrgentTask}
              isUserUrgent={userUrgentTaskIds.includes(task.id)}
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
