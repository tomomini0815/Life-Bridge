import { useState, useMemo } from 'react';
import { LifeEvent, Task } from '@/types/lifeEvent';
import { TaskItem } from './TaskItem';
import { ProgressRing } from './ProgressRing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Filter,
  Trophy,
  Coins,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  event: LifeEvent;
  onBack: () => void;
}

type FilterType = 'all' | 'government' | 'benefit' | 'private';

export function Dashboard({ event, onBack }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(event.tasks);
  const [filter, setFilter] = useState<FilterType>('all');

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.category === filter);
  }, [tasks, filter]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const totalBenefits = tasks
    .filter(t => t.benefitAmount)
    .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);

  const claimedBenefits = tasks
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{event.icon}</span>
              <h1 className="text-xl font-bold">{event.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          {/* Progress Card */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 flex items-center gap-6">
            <ProgressRing progress={progress} size={100} strokeWidth={6} />
            <div>
              <p className="text-sm text-muted-foreground">進捗状況</p>
              <p className="text-2xl font-bold">{completedCount}/{tasks.length}</p>
              <p className="text-xs text-muted-foreground">タスク完了</p>
            </div>
          </div>

          {/* Benefits Card */}
          <div className={cn(
            "bg-card rounded-2xl p-6 shadow-soft border border-border/50 transition-all duration-300",
            totalBenefits === 0 && "opacity-60 grayscale cursor-not-allowed"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">獲得可能な給付金</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ¥{totalBenefits.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              申請済み: ¥{claimedBenefits.toLocaleString()}
            </p>
          </div>

          {/* Remaining Benefits Card */}
          <div className={cn(
            "rounded-2xl p-6 shadow-soft border transition-all duration-300",
            remainingBenefits === 0 
              ? "opacity-60 grayscale cursor-not-allowed border-border/50 bg-secondary/20" 
              : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-amber-700">
                {remainingBenefits === 0 ? "対象なし" : "まだもらえます！"}
              </p>
            </div>
            <p className="text-3xl font-bold text-amber-700">
              ¥{remainingBenefits.toLocaleString()}
            </p>
            <p className="text-sm text-amber-600 mt-1">
              {remainingBenefits === 0 
                ? "現在対象となる未申請の給付金はありません" 
                : `あと${tasks.filter(t => !t.completed && t.benefitAmount).length}件の申請で獲得`
              }
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

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
                onToggle={toggleTask}
                eventColor={event.color}
              />
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">該当するタスクがありません</p>
          </div>
        )}
      </main>
    </div>
  );
}
