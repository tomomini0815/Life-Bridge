import { cn } from '@/lib/utils';
import { Baby, Briefcase, GraduationCap, Heart, Home, Star } from 'lucide-react';

interface TimelineEvent {
    year: string;
    title: string;
    icon: React.ElementType;
    status: 'completed' | 'active' | 'future';
    description: string;
}

const timelineData: TimelineEvent[] = [
    {
        year: '2019',
        title: '大学卒業',
        icon: GraduationCap,
        status: 'completed',
        description: '希望を胸に、社会への第一歩を踏み出しました。', // Gratuation
    },
    {
        year: '2019',
        title: '新卒入社',
        icon: Briefcase,
        status: 'completed',
        description: '株式会社テックフューチャーに入社。エンジニアとしてのキャリアをスタート。', // First Job
    },
    {
        year: '2023',
        title: '結婚',
        icon: Heart,
        status: 'completed',
        description: 'パートナーと共に歩む新しい人生の幕開け。', // Marriage
    },
    {
        year: '2025',
        title: '引越し',
        icon: Home,
        status: 'active',
        description: '家族が増える未来を見据えて、広めのマンションへ。', // Moving (Current)
    },
    {
        year: '2026 (予想)',
        title: '第一子誕生',
        icon: Baby,
        status: 'future',
        description: '新しい家族の誕生。パパ・ママとしての生活が始まります。', // Baby
    },
];

export function LifeTimeline() {
    return (
        <div className="relative py-10 px-6">
            {/* Central Line */}
            <div className="absolute left-[29px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-300 to-indigo-100 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900" />

            <div className="space-y-12">
                {timelineData.map((event, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                        <div
                            key={index}
                            className={cn(
                                "relative flex items-center md:justify-center group",
                                // Mobile: always left aligned with line on left
                                // Desktop: alternating
                            )}
                        >
                            {/* Dot on Line */}
                            <div className={cn(
                                "absolute left-[20px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 z-10 transition-all duration-500",
                                event.status === 'completed' ? "bg-indigo-500 border-indigo-200" :
                                    event.status === 'active' ? "bg-yellow-400 border-yellow-200 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse-soft" :
                                        "bg-slate-200 border-slate-100 dark:bg-slate-700 dark:border-slate-600"
                            )} />

                            {/* Content Card */}
                            <div className={cn(
                                "ml-16 md:ml-0 w-full md:w-[42%] bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up",
                                "md:absolute",
                                // Desktop positioning
                                isLeft ? "md:right-[50%] md:mr-10" : "md:left-[50%] md:ml-10",
                                // Active state styling
                                event.status === 'active' && "border-yellow-400/50 bg-yellow-50/30 dark:bg-yellow-900/10 ring-1 ring-yellow-400/30"
                            )}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className={cn(
                                        "text-sm font-bold px-2 py-0.5 rounded-md",
                                        event.status === 'future' ? "text-muted-foreground bg-slate-100 dark:bg-slate-800" : "text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/30"
                                    )}>
                                        {event.year}
                                    </span>
                                    {event.status === 'active' && (
                                        <span className="flex items-center text-xs font-bold text-yellow-600 dark:text-yellow-400 animate-pulse">
                                            <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                                            NOW
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
                                    <event.icon className={cn(
                                        "w-5 h-5",
                                        event.status === 'future' ? "text-muted-foreground" : "text-purple-500"
                                    )} />
                                    {event.title}
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Future hint */}
            <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '800ms' }}>
                <p className="text-sm text-muted-foreground italic font-medium">
                    To be continued... and LifeBridge is always with you.
                </p>
            </div>
        </div>
    );
}
