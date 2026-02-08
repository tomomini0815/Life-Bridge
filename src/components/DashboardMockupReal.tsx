import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export function DashboardMockupReal() {
    return (
        <div className="relative w-full max-w-5xl mx-auto px-4 py-12 md:py-20 lg:py-24 overflow-visible">

            {/* Macbook Pro Mockup */}
            <div className="relative mx-auto w-full max-w-[800px] group transition-all duration-700 hover:scale-[1.02]">
                {/* Macbook Frame */}
                <div className="relative rounded-t-[1.5rem] bg-[#1e1e1e] border-[6px] border-[#333] shadow-2xl overflow-hidden aspect-[16/10]">
                    {/* Bezel/Camera */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-[#1e1e1e] z-20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    </div>
                    {/* Screenshot */}
                    <img
                        src="/assets/images/dashboard_desktop.png"
                        alt="LifeBridge Desktop Dashboard"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Macbook Bottom */}
                <div className="relative h-4 bg-[#ddd] rounded-b-[2rem] w-[105%] -left-[2.5%] shadow-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-black/10 rounded-b-lg" />
                </div>
            </div>

            {/* iPhone Mockup (Floating/Overlapping) */}
            <div className="absolute -bottom-4 right-[2%] md:-bottom-12 md:right-[5%] lg:right-[10%] w-[140px] md:w-[220px] transition-all duration-700 hover:scale-110 hover:-rotate-2 z-30 group">
                {/* Phone Frame */}
                <div className="relative aspect-[9/19.5] rounded-[2.5rem] bg-[#1e1e1e] border-[8px] border-[#333] shadow-2xl overflow-hidden ring-4 ring-slate-900/10">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full z-20" />
                    {/* Screenshot */}
                    <img
                        src="/assets/images/dashboard_mobile.png"
                        alt="LifeBridge Mobile Dashboard"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Reflection Highlight */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </div>

            {/* Floating Action Badge */}
            <div className="absolute -top-6 -left-2 md:top-10 md:left-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-3 md:p-5 border border-slate-100 dark:border-slate-800 animate-float-slow z-40 max-w-[180px] md:max-w-none">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Bot className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-xs md:text-sm font-bold text-slate-800 dark:text-white">AI手続きナビ</div>
                        <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">スマホでもPCでもシームレスに</div>
                    </div>
                </div>
            </div>

            {/* Side Badge (Benefits) */}
            <div className="hidden lg:flex absolute top-1/2 -left-20 -translate-y-1/2 bg-gradient-to-br from-amber-400 to-orange-500 text-white p-6 rounded-3xl shadow-2xl flex-col gap-2 animate-float-medium z-10 border-4 border-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-black text-lg">給付金試算額</span>
                </div>
                <div className="text-3xl font-black">¥500,000</div>
                <div className="text-xs opacity-90 font-bold">最短ルートで受給へ</div>
            </div>

        </div>
    );
}
