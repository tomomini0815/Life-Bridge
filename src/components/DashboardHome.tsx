import { lifeEvents } from '@/data/lifeEvents';
import { Task, LifeEventType } from '@/types/lifeEvent';
import { ProgressRing } from './ProgressRing';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHomeProps {
  onSelectEvent: (eventId: LifeEventType) => void;
  completedTasks: Record<string, string[]>;
}

const colorMap: Record<string, { bg: string; text: string; gradient: string }> = {
  marriage: { bg: 'bg-pink-50', text: 'text-pink-600', gradient: 'from-pink-400 to-rose-500' },
  birth: { bg: 'bg-orange-50', text: 'text-orange-600', gradient: 'from-orange-300 to-amber-500' },
  job: { bg: 'bg-sky-50', text: 'text-sky-600', gradient: 'from-sky-400 to-blue-500' },
  moving: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-400 to-teal-500' },
  care: { bg: 'bg-violet-50', text: 'text-violet-600', gradient: 'from-violet-400 to-purple-500' },
};

export function DashboardHome({ onSelectEvent, completedTasks }: DashboardHomeProps) {
  // Calculate overall stats
  const allEvents = lifeEvents.map(event => {
    const completed = completedTasks[event.id] || [];
    const total = event.tasks.length;
    const progress = total > 0 ? (completed.length / total) * 100 : 0;
    const totalBenefits = event.tasks
      .filter(t => t.benefitAmount)
      .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);
    const claimedBenefits = event.tasks
      .filter(t => completed.includes(t.id) && t.benefitAmount)
      .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);
    const urgentTasks = event.tasks.filter(t => !completed.includes(t.id) && t.priority === 'high');
    
    return {
      ...event,
      completed: completed.length,
      total,
      progress,
      totalBenefits,
      claimedBenefits,
      urgentTasks,
    };
  });

  const activeEvents = allEvents.filter(e => e.completed > 0 || e.total > 0);
  const totalCompleted = allEvents.reduce((sum, e) => sum + e.completed, 0);
  const totalTasks = allEvents.reduce((sum, e) => sum + e.total, 0);
  const overallProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
  const totalPotentialBenefits = allEvents.reduce((sum, e) => sum + e.totalBenefits, 0);
  const totalClaimedBenefits = allEvents.reduce((sum, e) => sum + e.claimedBenefits, 0);
  const allUrgentTasks = allEvents.flatMap(e => e.urgentTasks.map(t => ({ ...t, eventId: e.id, eventIcon: e.icon })));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="gradient-warm rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">おかえりなさい！</h1>
            <p className="text-primary-foreground/80">
              今日も一歩ずつ、手続きを進めていきましょう。
            </p>
          </div>
          <div className="hidden md:block">
            <Sparkles className="w-16 h-16 text-primary-foreground/30" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">全体進捗</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{Math.round(overallProgress)}%</span>
            <span className="text-sm text-muted-foreground mb-1">完了</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-warm rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">完了タスク</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{totalCompleted}</span>
            <span className="text-sm text-muted-foreground mb-1">/ {totalTasks}件</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-muted-foreground">獲得済み給付金</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">¥{totalClaimedBenefits.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            残り ¥{(totalPotentialBenefits - totalClaimedBenefits).toLocaleString()}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-muted-foreground">要対応</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{allUrgentTasks.length}</span>
            <span className="text-sm text-muted-foreground mb-1">件</span>
          </div>
          <p className="text-xs text-destructive mt-1">
            優先度の高いタスクがあります
          </p>
        </div>
      </div>

      {/* Urgent Tasks */}
      {allUrgentTasks.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border border-red-200/50">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            優先度の高いタスク
          </h2>
          <div className="space-y-3">
            {allUrgentTasks.slice(0, 3).map((task) => (
              <div 
                key={task.id}
                className="bg-card/80 rounded-xl p-4 flex items-center gap-4 hover:shadow-soft transition-shadow cursor-pointer"
                onClick={() => onSelectEvent(task.eventId as LifeEventType)}
              >
                <span className="text-2xl">{task.eventIcon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{task.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {task.deadline && (
                      <>
                        <Clock className="w-3 h-3" />
                        {task.deadline}
                      </>
                    )}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Life Events Progress */}
      <div>
        <h2 className="font-semibold text-foreground mb-4">ライフイベント別進捗</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifeEvents.map((event) => {
            const stats = allEvents.find(e => e.id === event.id)!;
            const colors = colorMap[event.id];
            
            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className={cn(
                  "p-5 rounded-2xl text-left transition-all duration-300",
                  "border border-border/50 shadow-soft hover:shadow-card",
                  "group",
                  colors.bg
                )}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                      "bg-gradient-to-br shadow-md",
                      colors.gradient
                    )}
                  >
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.completed}/{stats.total}件完了
                    </p>
                    {stats.totalBenefits > 0 && (
                      <p className={cn("text-xs mt-2", colors.text)}>
                        💰 ¥{stats.totalBenefits.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <ProgressRing progress={stats.progress} size={50} strokeWidth={4} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">今日のヒント</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground">
              📋 <strong className="text-foreground">書類の準備</strong>は前日までに！
              当日焦らないように、必要書類は事前に確認しておきましょう。
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground">
              💡 <strong className="text-foreground">オンライン申請</strong>が可能なものは、
              窓口の待ち時間なしで手続きできます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
