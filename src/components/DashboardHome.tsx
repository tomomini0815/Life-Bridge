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
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Church,
  Baby,
  Briefcase,
  Rocket,
  Home,
  HandHeart,
  ClipboardList,
  Lightbulb,
  HeartCrack,
  GraduationCap,
  Wallet,
  Scale,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { LifeTimeline } from './LifeTimeline';
import { recommendationService, RecommendationItem } from '@/services/RecommendationService';
import { profileService } from '@/services/ProfileService';
import { Link } from 'react-router-dom';

interface DashboardHomeProps {
  onSelectEvent: (eventId: LifeEventType) => void;
  onNavigate: (page: string) => void;
  completedTasks: Record<string, string[]>;
  userUrgentTasks: Record<string, string[]>;
  priorityEvents: string[];
}

const colorMap: Record<string, { bg: string; text: string; gradient: string; glass: string; border: string }> = {
  marriage: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    gradient: 'from-pink-400 to-rose-500',
    glass: 'bg-pink-50/40 dark:bg-pink-900/10',
    border: 'border-pink-200/50 hover:border-pink-300/80 dark:border-pink-800/20 dark:hover:border-pink-700/40'
  },
  divorce: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    gradient: 'from-slate-400 to-gray-500',
    glass: 'bg-slate-50/40 dark:bg-slate-900/10',
    border: 'border-slate-200/50 hover:border-slate-300/80 dark:border-slate-800/20 dark:hover:border-slate-700/40'
  },
  birth: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    gradient: 'from-orange-300 to-amber-500',
    glass: 'bg-orange-50/40 dark:bg-orange-900/10',
    border: 'border-orange-200/50 hover:border-orange-300/80 dark:border-orange-800/20 dark:hover:border-orange-700/40'
  },
  exam: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    gradient: 'from-cyan-400 to-teal-500',
    glass: 'bg-cyan-50/40 dark:bg-cyan-900/10',
    border: 'border-cyan-200/50 hover:border-cyan-300/80 dark:border-cyan-800/20 dark:hover:border-cyan-700/40'
  },
  job: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    gradient: 'from-sky-400 to-blue-500',
    glass: 'bg-sky-50/40 dark:bg-sky-900/10',
    border: 'border-sky-200/50 hover:border-sky-300/80 dark:border-sky-800/20 dark:hover:border-sky-700/40'
  },
  startup: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
    glass: 'bg-purple-50/40 dark:bg-purple-900/10',
    border: 'border-purple-200/50 hover:border-purple-300/80 dark:border-purple-800/20 dark:hover:border-purple-700/40'
  },
  moving: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    gradient: 'from-emerald-400 to-teal-500',
    glass: 'bg-emerald-50/40 dark:bg-emerald-900/10',
    border: 'border-emerald-200/50 hover:border-emerald-300/80 dark:border-emerald-800/20 dark:hover:border-emerald-700/40'
  },
  care: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    gradient: 'from-violet-400 to-purple-500',
    glass: 'bg-violet-50/40 dark:bg-violet-900/10',
    border: 'border-violet-200/50 hover:border-violet-300/80 dark:border-violet-800/20 dark:hover:border-violet-700/40'
  },
  finance: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    gradient: 'from-amber-400 to-yellow-500',
    glass: 'bg-amber-50/40 dark:bg-amber-900/10',
    border: 'border-amber-200/50 hover:border-amber-300/80 dark:border-amber-800/20 dark:hover:border-amber-700/40'
  },
  inheritance: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    gradient: 'from-indigo-400 to-blue-600',
    glass: 'bg-indigo-50/40 dark:bg-indigo-900/10',
    border: 'border-indigo-200/50 hover:border-indigo-300/80 dark:border-indigo-800/20 dark:hover:border-indigo-700/40'
  },
  homePurchase: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    gradient: 'from-blue-400 to-indigo-500',
    glass: 'bg-blue-50/40 dark:bg-blue-900/10',
    border: 'border-blue-200/50 hover:border-blue-300/80 dark:border-blue-800/20 dark:hover:border-blue-700/40'
  },
};

const iconMap: Record<string, React.ElementType> = {
  marriage: Church,
  divorce: HeartCrack,
  birth: Baby,
  exam: GraduationCap,
  job: Briefcase,
  startup: Rocket,
  moving: Truck,
  homePurchase: Home,
  care: HandHeart,
  finance: Wallet,
  inheritance: Scale,
};

import { useAuth } from '@/contexts/AuthContext';

export function DashboardHome({ onSelectEvent, onNavigate, completedTasks, userUrgentTasks, priorityEvents }: DashboardHomeProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');
  const [userName, setUserName] = useState('ゲスト');
  const [profile, setProfile] = useState<any>(null);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  // Recommendations
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    const fetchRecommendations = (currentProfile: any) => {
      // Safe cast or parsing
      const recs = recommendationService.getRecommendations(currentProfile);
      setRecommendations(recs);
    };

    // Initial load
    const initialProfile = profileService.getProfile();
    setUserName(initialProfile.name || 'ゲスト');
    setProfile(initialProfile);
    fetchRecommendations(initialProfile);

    // Subscribe to changes
    const unsubscribe = profileService.subscribe((updatedProfile) => {
      setUserName(updatedProfile.name || 'ゲスト');
      setProfile(updatedProfile);
      fetchRecommendations(updatedProfile);
    });

    return () => unsubscribe();
  }, []);

  const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const profile = profileService.getProfile();
    setMenuVisibility(profile.settings || {});

    // Subscribe to profile changes
    const unsubscribe = profileService.subscribe((updatedProfile) => {
      if (updatedProfile.settings) {
        setMenuVisibility(updatedProfile.settings);
      }
    });

    return unsubscribe;
  }, [user]);

  const visibleLifeEvents = lifeEvents.filter(event => menuVisibility[event.id] !== false);

  const visibleRecommendations = recommendations.filter(rec => {
    // If no specific category, always show
    if (!rec.category) return true;
    // Otherwise check visibility setting
    return menuVisibility[rec.category] !== false;
  });

  // Calculate overall stats
  const allEvents = visibleLifeEvents.map(event => {
    const completed = completedTasks[event.id] || [];
    const total = event.tasks.length;
    const progress = total > 0 ? (completed.length / total) * 100 : 0;
    const totalBenefits = event.tasks
      .filter(t => t.benefitAmount)
      .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);
    const claimedBenefits = event.tasks
      .filter(t => completed.includes(t.id) && t.benefitAmount)
      .reduce((sum, t) => sum + (t.benefitAmount || 0), 0);
    let urgentTasks = event.tasks.filter(t => !completed.includes(t.id) && (t.priority === 'high' || (userUrgentTasks[event.id] || []).includes(t.id)));
    
    // Only show urgent tasks for events that are explicitly marked as priority
    if (!priorityEvents.includes(event.id)) {
      urgentTasks = [];
    }

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
    <div className="space-y-3 md:space-y-4 animate-fade-in max-w-none mx-auto pb-2">
      {/* Tab Switcher */}
      <div className="flex justify-start border-b border-border/40 px-2 pt-3 md:pt-0">
        <div className="flex gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "pb-3 px-2 text-sm font-bold transition-all duration-300 border-b-2",
              activeTab === 'overview' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            ダッシュボード
          </button>

          {menuVisibility['timeline'] !== false && (
            <button
              onClick={() => setActiveTab('timeline')}
              className={cn(
                "pb-3 px-2 text-sm font-bold transition-all duration-300 flex items-center gap-2 border-b-2",
                activeTab === 'timeline' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-xs">✨</span>
              人生のタイムライン
            </button>
          )}
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* 進捗率カード */}
            <div className="relative overflow-hidden group rounded-2xl p-2.5 md:p-3 hover-lift transition-all duration-300 bg-gradient-to-r from-teal-400 to-emerald-500 shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs md:text-sm font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">全体進捗</span>
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span className="text-lg md:text-xl font-bold text-white leading-none">{Math.round(overallProgress)}%</span>
                  <span className="text-[10px] text-white/85 font-medium leading-none">完了</span>
                </div>
                <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/95 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${overallProgress}% ` }}
                  />
                </div>
              </div>
            </div>

            {/* 完了タスク */}
            <div className="relative overflow-hidden group rounded-2xl p-2.5 md:p-3 hover-lift transition-all duration-300 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs md:text-sm font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">完了タスク</span>
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg md:text-xl font-bold text-white leading-none">{totalCompleted}</span>
                  <span className="text-[10px] text-white/85 font-medium leading-none">/ {totalTasks}件</span>
                </div>
              </div>
            </div>

            {/* 獲得済み給付金 */}
            <div className="relative overflow-hidden group rounded-2xl p-2.5 md:p-3 hover-lift transition-all duration-300 bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs md:text-sm font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">獲得済み給付金</span>
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base md:text-lg font-bold text-white leading-none truncate">¥{totalClaimedBenefits.toLocaleString()}</span>
                  <span className="text-[9px] text-white/85 font-medium leading-none whitespace-nowrap">
                    残り ¥{(totalPotentialBenefits - totalClaimedBenefits).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 要対応タスク */}
            <div className="relative overflow-hidden group rounded-2xl p-2.5 md:p-3 hover-lift transition-all duration-300 bg-gradient-to-r from-red-400 to-pink-500 shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs md:text-sm font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">要対応</span>
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg md:text-xl font-bold text-white leading-none">{allUrgentTasks.length}</span>
                  <span className="text-[10px] text-white/85 font-medium leading-none">期限切迫</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          {visibleRecommendations.length > 0 && profile?.name && profile.name !== 'ゲスト' && (
            <div className="glass-medium rounded-2xl p-3 md:p-4 border-2 border-indigo-200/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 shadow-soft mb-3 md:mb-4">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Left Header Column */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:w-52 shrink-0 md:border-r border-indigo-100/50 dark:border-indigo-900/30 md:pr-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground leading-tight">あなたへのおすすめ</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">登録情報に基づいた提案</p>
                  </div>
                </div>

                {/* Right Area: Inline Text Links */}
                <div className="flex-1 flex flex-row flex-wrap items-center gap-x-6 gap-y-2">
                  {visibleRecommendations.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => {
                        if (rec.link === '/settings') {
                          onNavigate('settings');
                        } else if (rec.link?.includes('benefits')) {
                          onNavigate('simulator');
                        } else if (rec.link) {
                          window.open(rec.link, '_blank');
                        }
                      }}
                      className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-bold text-foreground bg-transparent border-none p-0 cursor-pointer whitespace-nowrap shrink-0 group"
                    >
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-bold",
                        rec.type === 'benefit' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          rec.type === 'procedure' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {rec.type === 'benefit' ? '給付金' : rec.type === 'procedure' ? '手続き' : '設定'}
                      </span>
                      <span className="underline-offset-4 group-hover:underline leading-none">{rec.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-65 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Urgent Tasks */}
          {allUrgentTasks.length > 0 && (
            <div className="glass-medium rounded-2xl p-3 md:p-4 border-2 border-red-200/30 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 shadow-soft">
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
                    className="group bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-red-100 dark:border-red-900/30 hover:border-red-300 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
                    onClick={() => onSelectEvent(task.eventId as LifeEventType)}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-500/10 transition-colors" />
                    <div className="flex items-start gap-4 relative z-10">
                      <span className="text-3xl bg-white dark:bg-card rounded-xl p-2 shadow-sm group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-12 h-12">
                        {(() => {
                          const Icon = iconMap[task.eventId] || Heart;
                          return <Icon className="w-6 h-6 text-red-500" />;
                        })()}
                      </span>
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
              {visibleLifeEvents.map((event) => {
                const stats = allEvents.find(e => e.id === event.id)!;
                const colors = colorMap[event.id];
                const IconComponent = iconMap[event.id] || Heart;

                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className={cn(
                      "p-4 rounded-2xl text-left transition-all duration-500",
                      "backdrop-blur-xl border-2",
                      "shadow-soft hover:shadow-xl group relative overflow-hidden",
                      "bg-emerald-50/60 dark:bg-emerald-900/10",
                      "border-emerald-200/60 hover:border-emerald-300 dark:border-emerald-800/30 dark:hover:border-emerald-700"
                    )}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0" />

                    <div className="flex items-start gap-4 relative z-10 w-full">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                          "bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/20",
                          "group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                        )}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-teal-950 dark:text-teal-50 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100/50 dark:bg-teal-900/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                            {stats.completed}/{stats.total}完了
                          </span>
                        </div>
                        {stats.totalBenefits > 0 && (
                          <p className="text-xs font-bold mt-2 flex items-center gap-1 text-teal-700 dark:text-teal-400">
                            <span>💰</span> ¥{stats.totalBenefits.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="relative group-hover:scale-110 transition-transform duration-300">
                          <div className="absolute inset-0 bg-teal-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <ProgressRing progress={stats.progress} size={68} strokeWidth={6} />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips Section */}
          <div className="glass-medium rounded-2xl p-3 md:p-4 border border-border/50 shadow-soft">
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
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors hover-lift">
                <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-3">
                  <span className="bg-white p-2 rounded-lg shadow-sm">
                    <ClipboardList className="w-5 h-5 text-indigo-500" />
                  </span>
                  <span>
                    <strong className="text-foreground block mb-1">書類の準備は前日までに！</strong>
                    当日焦らないように、必要書類は事前に確認しておきましょう。
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors hover-lift">
                <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-3">
                  <span className="bg-white p-2 rounded-lg shadow-sm">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  </span>
                  <span>
                    <strong className="text-foreground block mb-1">オンライン申請を活用</strong>
                    窓口の待ち時間なしで手続きできます。積極的に活用しましょう。
                  </span>
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
