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

                {/* Dash Content */}
                <div className="flex-1 p-4 md:p-8 overflow-hidden">
                    <div className="flex flex-col gap-4 md:gap-8 h-full">
                        {/* Top Cards */}
                        <div className="grid grid-cols-3 gap-3 md:gap-6 shrink-0">
                            {[
                                { label: '進行中の手続き', value: '12', sub: '+2 今週', color: 'emerald' },
                                { label: '獲得予定の給付金', value: '¥1,200k', sub: '最大試算額', color: 'teal' },
                                { label: '次の期限', value: '3日後', sub: '児童手当', color: 'amber' },
                            ].map((card, i) => (
                                <div key={i} className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-slate-200 flex flex-col gap-1 md:gap-2">
                                    <span className="text-[8px] md:text-xs text-slate-500 font-medium">{card.label}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm md:text-2xl font-black text-slate-800">{card.value}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className={cn("w-1 h-1 rounded-full", `bg-${card.color}-500`)} />
                                        <span className="text-[6px] md:text-[10px] text-slate-400 font-medium">{card.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Section */}
                        <div className="flex-1 grid grid-cols-5 gap-3 md:gap-6 min-h-0">
                            {/* Task List */}
                            <div className="col-span-3 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800">手続きロードマップ</h4>
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                                        <span>詳細を見る</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:gap-4">
                                    {[
                                        { title: '出生届の提出', status: 'done', date: '2/10 完了' },
                                        { title: '児童手当の認定申請', status: 'active', date: '2/25 期限' },
                                        { title: '雇用保険受給資格の確認', status: 'pending', date: '3/05 以降' },
                                        { title: '健康保険被扶養者届', status: 'pending', date: '3/10 期限' },
                                    ].map((task, i) => (
                                        <div key={i} className={cn(
                                            "flex items-center gap-3 p-2 md:p-3 rounded-xl border transition-all",
                                            task.status === 'active' ? "border-emerald-200 bg-emerald-50/50" : "border-slate-100"
                                        )}>
                                            {task.status === 'done' ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            ) : task.status === 'active' ? (
                                                <Clock className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                                            )}
                                            <span className={cn(
                                                "font-bold flex-1 truncate",
                                                task.status === 'done' ? "text-slate-400" : "text-slate-700"
                                            )}>{task.title}</span>
                                            <span className="text-[8px] md:text-xxs text-slate-400 whitespace-nowrap">{task.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar / Side Card */}
                            <div className="col-span-2 flex flex-col gap-3 md:gap-6">
                                <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5 flex flex-col gap-3 overflow-hidden">
                                    <h4 className="font-bold text-slate-800">カレンダー</h4>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: 28 }).map((_, i) => (
                                            <div key={i} className={cn(
                                                "aspect-square rounded flex items-center justify-center text-[6px] md:text-[10px] font-bold",
                                                i === 15 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "hover:bg-slate-50 text-slate-400"
                                            )}>
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-20 md:h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-5 text-white flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[8px] md:text-xxs font-bold opacity-80 uppercase tracking-wider">AI Insight</span>
                                        <Sparkles className="w-4 h-4 text-indigo-200" />
                                    </div>
                                    <p className="text-[10px] md:text-xs font-bold leading-tight">給付金の申請期限が3日後に迫っています。今すぐ準備を始めましょう。</p>
                                </div>
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
