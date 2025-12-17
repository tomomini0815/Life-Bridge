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
  Target,
  Zap,
  Heart,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LifeTimeline } from './LifeTimeline';

interface DashboardHomeProps {
  onSelectEvent: (eventId: LifeEventType) => void;
  completedTasks: Record<string, string[]>;
}

const colorMap: Record<string, { bg: string; text: string; gradient: string; glass: string; border: string }> = {
  marriage: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    gradient: 'from-pink-400 to-rose-500',
    glass: 'bg-pink-50/40 dark:bg-pink-900/10',
    border: 'border-pink-200/50 hover:border-pink-300/80'
  },
  birth: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    gradient: 'from-orange-300 to-amber-500',
    glass: 'bg-orange-50/40 dark:bg-orange-900/10',
    border: 'border-orange-200/50 hover:border-orange-300/80'
  },
  job: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    gradient: 'from-sky-400 to-blue-500',
    glass: 'bg-sky-50/40 dark:bg-sky-900/10',
    border: 'border-sky-200/50 hover:border-sky-300/80'
  },
  moving: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    gradient: 'from-emerald-400 to-teal-500',
    glass: 'bg-emerald-50/40 dark:bg-emerald-900/10',
    border: 'border-emerald-200/50 hover:border-emerald-300/80'
  },
  care: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    gradient: 'from-violet-400 to-purple-500',
    glass: 'bg-violet-50/40 dark:bg-violet-900/10',
    border: 'border-violet-200/50 hover:border-violet-300/80'
  },
};

export function DashboardHome({ onSelectEvent, completedTasks }: DashboardHomeProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');

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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Welcome Section */}
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium mb-4 border border-primary/20 text-primary">
            <Sparkles className="h-3 w-3" />
            <span>AIパートナーと連携中</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground">こんにちは、Tomomiさん</h1>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            人生の転機は、新しい物語の始まりです。<br />
            複雑な手続きは私に任せて、あなたらしい毎日を過ごしましょう。
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-muted/50 p-1 rounded-full flex gap-1 border border-border/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
              activeTab === 'overview' ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            ダッシュボード
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
              activeTab === 'timeline' ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-xs">✨</span>
            人生のタイムライン
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group rounded-3xl p-6 hover-lift border-2 border-transparent hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">全体進捗</span>
              </div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">{Math.round(overallProgress)}%</span>
                <span className="text-sm text-teal-600/70 dark:text-teal-400/70 mb-1.5 font-medium">完了</span>
              </div>
              <div className="h-3 bg-teal-100/50 dark:bg-teal-800/30 rounded-full overflow-hidden p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="group rounded-3xl p-6 hover-lift border-2 border-transparent hover:border-green-500/20 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-800/50 flex items-center justify-center text-green-600 dark:text-green-400 shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">完了タスク</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">{totalCompleted}</span>
                <span className="text-sm text-green-600/70 dark:text-green-400/70 mb-1.5 font-medium">/ {totalTasks}件</span>
              </div>
            </div>

            <div className="group rounded-3xl p-6 hover-lift border-2 border-transparent hover:border-amber-500/20 transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">獲得済み給付金</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">¥{totalClaimedBenefits.toLocaleString()}</span>
              </div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mt-2 bg-amber-100/50 dark:bg-amber-800/30 px-2 py-1 rounded-lg inline-block">
                残り ¥{(totalPotentialBenefits - totalClaimedBenefits).toLocaleString()}
              </p>
            </div>

            <div className="group rounded-3xl p-6 hover-lift border-2 border-transparent hover:border-red-500/20 transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-800/50 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner-glow group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">要対応</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-red-600 dark:text-red-400">{allUrgentTasks.length}</span>
                <span className="text-sm text-red-600/70 dark:text-red-400/70 mb-1.5 font-medium">件</span>
              </div>
              <p className="text-xs font-medium text-red-700 dark:text-red-300 mt-2 bg-red-100/50 dark:bg-red-800/30 px-2 py-1 rounded-lg inline-block">
                期限が迫っています
              </p>
            </div>
          </div>

          {/* Urgent Tasks */}
          {allUrgentTasks.length > 0 && (
            <div className="glass-medium rounded-3xl p-8 border-2 border-red-200/30 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 shadow-soft">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                優先度の高いタスク
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUrgentTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="group bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-red-100 dark:border-red-900/30 hover:border-red-300 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
                    onClick={() => onSelectEvent(task.eventId as LifeEventType)}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-500/10 transition-colors" />
                    <div className="flex items-start gap-4 relative z-10">
                      <span className="text-3xl bg-white dark:bg-card rounded-xl p-2 shadow-sm group-hover:scale-110 transition-transform duration-300">{task.eventIcon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate mb-1 group-hover:text-red-600 transition-colors">{task.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                          {task.deadline && (
                            <span className="inline-flex items-center gap-1.5 text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md text-xs">
                              <Clock className="w-3 h-3" />
                              {task.deadline}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-100/50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Life Events Progress */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold font-display">ライフイベント別進捗</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifeEvents.map((event) => {
                const stats = allEvents.find(e => e.id === event.id)!;
                const colors = colorMap[event.id];

                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className={cn(
                      "p-6 rounded-3xl text-left transition-all duration-500",
                      "backdrop-blur-xl border-2",
                      "shadow-soft hover:shadow-xl group relative overflow-hidden",
                      colors.glass,
                      colors.border
                    )}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0" />

                    <div className="flex items-start gap-4 relative z-10 w-full">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                          "bg-gradient-to-br shadow-lg",
                          "group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                          colors.gradient
                        )}
                      >
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                            {stats.completed}/{stats.total}完了
                          </span>
                        </div>
                        {stats.totalBenefits > 0 && (
                          <p className={cn("text-xs font-bold mt-2 flex items-center gap-1", colors.text)}>
                            <span>💰</span> ¥{stats.totalBenefits.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="relative group-hover:scale-110 transition-transform duration-300">
                          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <ProgressRing progress={stats.progress} size={56} strokeWidth={5} />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips Section */}
          <div className="glass-medium rounded-3xl p-8 border border-border/50 shadow-soft">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-warm flex items-center justify-center shadow-colored-primary">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">今日のヒント</h2>
                <p className="text-sm text-muted-foreground">スムーズな手続きのためのアドバイス</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors hover-lift">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-xl mr-2">📋</span>
                  <strong className="text-foreground">書類の準備</strong>は前日までに！
                  当日焦らないように、必要書類は事前に確認しておきましょう。
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors hover-lift">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-xl mr-2">💡</span>
                  <strong className="text-foreground">オンライン申請</strong>が可能なものは、
                  窓口の待ち時間なしで手続きできます。積極的に活用しましょう。
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[500px]">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Your Life Journey
            </h2>
            <p className="text-muted-foreground">あなたとLifeBridgeが歩んだ軌跡</p>
          </div>
          <LifeTimeline />
        </div>
      )}
    </div>
  );
}
