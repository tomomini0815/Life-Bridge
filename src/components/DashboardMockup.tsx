import React from 'react';
import {
    Heart,
    Baby,
    Briefcase,
    Rocket,
    Truck,
    HandHeart,
    Search,
    LayoutDashboard,
    Calendar,
    Settings,
    Bell,
    CheckCircle2,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardMockup() {
    return (
        <div className="w-full bg-[#f8fafc] rounded-xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/10] flex text-[10px] md:text-sm select-none pointer-events-none">
            {/* Sidebar Overlay */}
            <div className="w-[15%] md:w-[20%] h-full bg-gradient-to-b from-[#10b981] to-[#047857] p-2 md:p-6 flex flex-col gap-2 md:gap-4 shrink-0">
                <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <div className="w-3 h-3 md:w-5 md:h-5 text-white blur-[0.5px]">LB</div>
                    </div>
                    <div className="hidden md:block font-bold text-white tracking-tight">LifeBridge</div>
                </div>

                {[
                    { icon: LayoutDashboard, label: 'ホーム' },
                    { icon: Heart, label: '結婚' },
                    { icon: Baby, label: '出産' },
                    { icon: Briefcase, label: '転職' },
                    { icon: Rocket, label: '起業' },
                    { icon: Truck, label: '引越し' },
                    { icon: HandHeart, label: '介護' },
                ].map((item, i) => (
                    <div key={i} className={cn(
                        "flex items-center gap-3 px-2 py-1.5 md:px-3 md:py-2 rounded-lg transition-colors",
                        i === 0 ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10"
                    )}>
                        <item.icon className="w-3.5 h-3.5 md:w-5 md:h-5 shrink-0" />
                        <span className="hidden md:block font-medium">{item.label}</span>
                    </div>
                ))}

                <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-3 py-2 text-white/40">
                        <Settings className="w-5 h-5 shrink-0" />
                        <span className="hidden md:block">設定</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="h-10 md:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-2 md:gap-4 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 md:px-4 md:py-2 w-32 md:w-64">
                        <Search className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                        <div className="h-2 w-24 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <Bell className="w-4 w-4 md:w-5 md:h-5 text-slate-400" />
                        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-400 shadow-md" />
                    </div>
                </div>

                <div className="flex-1 p-4 md:p-8 overflow-hidden bg-white">
                    <div className="flex flex-col gap-4 md:gap-8 h-full">
                        {/* Welcome */}
                        <div className="shrink-0">
                            <div className="h-2 w-32 bg-slate-200 rounded-full mb-2" />
                            <div className="h-3 w-64 bg-slate-100 rounded-full" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 shrink-0">
                            {[
                                { label: '全体進捗', value: '75%', color: 'from-teal-400 to-emerald-500', shadow: 'shadow-emerald-500/20' },
                                { label: '完了タスク', value: '24', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20' },
                                { label: '獲得済み給付金', value: '¥240k', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20' },
                                { label: '要対応', value: '3', color: 'from-red-400 to-pink-500', shadow: 'shadow-red-500/20' },
                            ].map((card, i) => (
                                <div key={i} className={cn("rounded-2xl p-3 md:p-5 shadow-lg flex flex-col justify-between text-white bg-gradient-to-r", card.color, card.shadow)}>
                                    <span className="text-[8px] md:text-xs font-medium opacity-90">{card.label}</span>
                                    <span className="text-sm md:text-2xl font-black mt-1">{card.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations Group */}
                        <div className="flex-1 grid grid-cols-3 gap-3 md:gap-6 min-h-0">
                            <div className="col-span-2 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-slate-800">あなたへのおすすめ</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { title: '出産育児一時金', type: '給付金' },
                                        { title: '児童手当の申請', type: '手続き' }
                                    ].map((rec, i) => (
                                        <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                                            <span className="text-[6px] md:text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mb-2 inline-block">{rec.type}</span>
                                            <div className="font-bold text-slate-700 text-[10px] md:text-xs">{rec.title}</div>
                                            <div className="h-1.5 w-full bg-slate-200 rounded-full mt-3" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Detail */}
                            <div className="col-span-1 bg-slate-50 rounded-2xl p-4 flex flex-col gap-4 border border-slate-200">
                                <div className="font-bold text-slate-800">ライフイベント進捗</div>
                                {[
                                    { label: '出産', progress: 80, color: 'bg-orange-500' },
                                    { label: '引っ越し', progress: 40, color: 'bg-emerald-500' }
                                ].map((ev, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[8px] md:text-[10px] font-bold">
                                            <span>{ev.label}</span>
                                            <span>{ev.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div className={cn("h-full transition-all duration-1000", ev.color)} style={{ width: `${ev.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="zm-13.5 17.5l.5 -1.5l1.5 -.5l-1.5 -.5l-.5 -1.5l-.5 1.5l-1.5 .5l1.5 .5l.5 1.5z" />
            <path d="zm11 -13.5l.5 -1.5l1.5 -.5l-1.5 -.5l-.5 -1.5l-.5 1.5l-1.5 .5l1.5 .5l.5 1.5z" />
            <path d="zm-4.5 -4.5l.5 -1.5l1.5 -.5l-1.5 -.5l-.5 -1.5l-.5 1.5l-1.5 .5l1.5 .5l.5 1.5z" />
        </svg>
    );
}
