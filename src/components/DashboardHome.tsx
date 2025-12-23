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
  Lightbulb
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
}

const colorMap: Record<string, { bg: string; text: string; gradient: string; glass: string; border: string }> = {
  marriage: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    gradient: 'from-pink-400 to-rose-500',
    glass: 'bg-pink-50/40 dark:bg-pink-900/10',
    border: 'border-pink-200/50 hover:border-pink-300/80 dark:border-pink-800/20 dark:hover:border-pink-700/40'
  },
  birth: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    gradient: 'from-orange-300 to-amber-500',
    glass: 'bg-orange-50/40 dark:bg-orange-900/10',
    border: 'border-orange-200/50 hover:border-orange-300/80 dark:border-orange-800/20 dark:hover:border-orange-700/40'
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
};

const iconMap: Record<string, React.ElementType> = {
  marriage: Church,
  birth: Baby,
  job: Briefcase,
  startup: Rocket,
  moving: Home,
  care: HandHeart,
};

export function DashboardHome({ onSelectEvent, onNavigate, completedTasks }: DashboardHomeProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');
  const [userName, setUserName] = useState('Tomomi');
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
    const profile = profileService.getProfile();
    if (profile.name) setUserName(profile.name);
    fetchRecommendations(profile);

    // Subscribe to changes
    const unsubscribe = profileService.subscribe((updatedProfile) => {
      setUserName(updatedProfile.name || 'Tomomi');
      fetchRecommendations(updatedProfile);
    });

    return () => unsubscribe();
  }, []);

  const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load initial settings
    const loadSettings = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('lifebridge_menu_visibility');
        if (stored) {
          try {
            setMenuVisibility(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse menu settings:', e);
          }
        }
      }
    };
    loadSettings();

    // Listen for changes
    const handleSettingsChange = (event: CustomEvent) => {
      setMenuVisibility(event.detail);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lifebridge_menu_visibility' && event.newValue) {
        try {
          setMenuVisibility(JSON.parse(event.newValue));
        } catch (e) {
          console.error('Storage sync error:', e);
        }
      }
    };

    window.addEventListener('menuVisibilityChanged', handleSettingsChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('menuVisibilityChanged', handleSettingsChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
    <div className="space-y-4 md:space-y-8 animate-fade-in max-w-7xl mx-auto pb-4 md:pb-10">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl py-2 px-8">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-xl font-bold mb-1 tracking-tight text-foreground">こんにちは、{userName}さん</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            人生の転機は、新しい物語の始まりです。複雑な手続きのナビゲートのお手伝いいたします。
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center border-b border-border/40">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="relative overflow-hidden group rounded-3xl p-4 md:p-6 hover-lift transition-all duration-300 bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-1">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute right-8 bottom-8 w-24 h-24 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/90">全体進捗</span>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-5 h-5" />
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl lg:text-4xl font-bold text-white">{Math.round(overallProgress)}%</span>
                  <p className="text-sm text-white/80 mt-1 font-medium">完了</p>
                </div>

                <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${overallProgress}% ` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden group rounded-3xl p-4 md:p-6 hover-lift transition-all duration-300 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute right-8 bottom-8 w-24 h-24 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/90">完了タスク</span>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <span className="text-3xl lg:text-4xl font-bold text-white">{totalCompleted}</span>
                  <p className="text-sm text-white/80 mt-1 font-medium">/ {totalTasks}件</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden group rounded-3xl p-4 md:p-6 hover-lift transition-all duration-300 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-1">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute right-8 bottom-8 w-24 h-24 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/90">獲得済み給付金</span>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <span className="text-3xl lg:text-4xl font-bold text-white">¥{totalClaimedBenefits.toLocaleString()}</span>
                  <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    <p className="text-xs font-medium text-white">
                      残り ¥{(totalPotentialBenefits - totalClaimedBenefits).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden group rounded-3xl p-4 md:p-6 hover-lift transition-all duration-300 bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-1">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute right-8 bottom-8 w-24 h-24 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/90">要対応</span>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <span className="text-3xl lg:text-4xl font-bold text-white">{allUrgentTasks.length}</span>
                  <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    <p className="text-xs font-medium text-white">
                      期限が迫っています
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          {visibleRecommendations.length > 0 && (
            <div className="glass-medium rounded-3xl p-4 md:p-8 border-2 border-indigo-200/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 shadow-soft mb-4 md:mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">あなたへのおすすめ</h2>
                  <p className="text-sm text-muted-foreground">登録情報に基づいた提案</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleRecommendations.map((rec) => (
                  <div key={rec.id} className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        rec.type === 'benefit' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          rec.type === 'procedure' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {rec.type === 'benefit' ? '給付金' : rec.type === 'procedure' ? '手続き' : 'タスク'}
                      </span>
                      {rec.urgency === 'high' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                          <AlertTriangle className="w-3 h-3" /> 要確認
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-foreground mb-2">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {rec.description}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => {
                          if (rec.link === '/settings') {
                            onNavigate('settings');
                          } else if (rec.link?.includes('benefits')) {
                            onNavigate('simulator');
                          } else if (rec.link) {
                            window.open(rec.link, '_blank');
                          }
                        }}
                        className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                      >
                        {rec.actionLabel || '移動する'} <ArrowRight className="w-4 h-4 ml-1" />
                      </button>

                      {rec.details && (
                        <button
                          onClick={() => setExpandedRecId(expandedRecId === rec.id ? null : rec.id)}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                          {expandedRecId === rec.id ? '閉じる' : '詳細'}
                          {expandedRecId === rec.id ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                        </button>
                      )}
                    </div>

                    {rec.details && expandedRecId === rec.id && (
                      <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-white/10 space-y-3 animate-in fade-in slide-in-from-top-1">
                        <div>
                          <p className="text-xs font-bold text-foreground mb-1">概要</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {rec.details.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground mb-1">計算式</p>
                          <p className="text-xs text-muted-foreground bg-white/50 dark:bg-white/5 p-2 rounded-md font-mono whitespace-pre-line">
                            {rec.details.calculation}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground mb-1">給付要件</p>
                          <p className="text-xs text-muted-foreground whitespace-pre-line">
                            {rec.details.requirements}
                          </p>
                        </div>

                        {/* Nested Accordion for Application Guide */}
                        <div className="pt-2">
                          <details className="group rounded-lg border border-border/50 bg-background/50 open:bg-background open:ring-1 open:ring-primary/20">
                            <summary className="flex cursor-pointer items-center justify-between p-3 text-xs font-bold text-foreground">
                              <div className="flex items-center gap-2">
                                申請手続きガイド（必要書類・手順）
                              </div>
                              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-3 pb-3 pt-0">
                              <div className="space-y-3 pt-2">
                                {/* Required Documents */}
                                {rec.requiredDocuments && rec.requiredDocuments.length > 0 && (
                                  <div>
                                    <p className="mb-2 text-xs font-bold text-foreground/80">📋 必要書類</p>
                                    <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                                      {rec.requiredDocuments.map((doc, idx) => (
                                        <li key={idx} className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">
                                          <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                                          {doc}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Application Steps */}
                                {rec.details.applicationSteps && (
                                  <div>
                                    <p className="mb-1 text-xs font-bold text-foreground/80">📝 手続きの流れ</p>
                                    <p className="text-xs leading-relaxed text-muted-foreground bg-primary/5 p-2 rounded-md">
                                      {rec.details.applicationSteps}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                        <IconComponent className="w-8 h-8 text-white" />
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
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors hover-lift">
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
