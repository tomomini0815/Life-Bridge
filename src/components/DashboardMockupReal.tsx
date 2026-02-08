import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export function DashboardMockupReal() {
    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-32 lg:py-40 overflow-visible [perspective:2000px]">

            {/* 3D Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 rounded-full blur-3xl -z-10" />

            {/* Macbook Pro 3D Mockup */}
            <div className="relative mx-auto w-full max-w-[900px] transition-all duration-1000 [transform-style:preserve-3d] [transform:rotateX(5deg)_rotateY(-15deg)] hover:[transform:rotateX(2deg)_rotateY(-10deg)]">

                {/* Glow behind laptop */}
                <div className="absolute -inset-10 bg-emerald-500/10 rounded-[3rem] blur-3xl opacity-50 -z-10" />

                {/* Screen Part */}
                <div className="relative rounded-t-[1.8rem] bg-[#0a0a0a] p-[10px] pb-0 border-x-[2px] border-t-[2px] border-slate-800 shadow-2xl overflow-hidden aspect-[16/10]">
                    {/* Top Bezel + Camera */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-black z-20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800 ring-1 ring-white/5" />
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="relative w-full h-full rounded-t-xl overflow-hidden border border-white/5">
                        <img
                            src="/assets/images/dashboard_desktop_v2.png"
                            alt="LifeBridge Desktop"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]"
                        />
                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </div>
                </div>

                {/* Macbook Keyboard/Base Part */}
                <div className="relative h-6 md:h-8 bg-gradient-to-b from-slate-200 to-slate-400 rounded-b-[2.5rem] w-[106%] -left-[3%] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-t border-white/20">
                    {/* Center Groove */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-black/20 rounded-b-xl shadow-inner" />
                    {/* Base Perspective Shadow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[98%] h-2 bg-black/30 blur-md -z-10" />
                </div>
            </div>

            {/* iPhone 15 Pro 3D Mockup */}
            <div className="absolute -bottom-10 right-[5%] md:right-[8%] lg:right-[15%] w-[180px] md:w-[280px] z-30 transition-all duration-1000 [transform-style:preserve-3d] [transform:rotateY(10deg)_translateZ(100px)] hover:[transform:rotateY(5deg)_translateZ(150px)]">

                {/* Phone Frame */}
                <div className="relative aspect-[9/19.5] rounded-[3rem] bg-[#1a1a1a] p-[8px] border-[1px] border-slate-700 shadow-[20px_40px_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/10">

                    {/* Dynamic Island */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20 flex items-center justify-end px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    </div>

                    {/* Screen Content */}
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
                        <img
                            src="/assets/images/dashboard_mobile_v2.png"
                            alt="LifeBridge Mobile"
                            className="w-full h-full object-cover"
                        />
                        {/* Reflection Overlays */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Side Buttons (Simulated) */}
                    <div className="absolute left-[-2px] top-24 w-[3px] h-8 bg-slate-700 rounded-r-lg" />
                    <div className="absolute left-[-2px] top-36 w-[3px] h-14 bg-slate-700 rounded-r-lg" />
                    <div className="absolute right-[-2px] top-32 w-[3px] h-20 bg-slate-700 rounded-l-lg" />
                </div>

                {/* Floating AI Helper Badge */}
                <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 border border-emerald-100 dark:border-emerald-900/30 animate-float-slow transition-all duration-500 hover:scale-110">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 md:w-10 md:h-10 text-white" />
                        </div>
                        <div>
                            <div className="text-xs md:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">AI CONCIERGE</div>
                            <div className="text-[10px] md:text-xs text-emerald-600 font-bold">24時間いつでも瞬時に解決</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Badges */}
            <div className="hidden xl:flex absolute top-1/4 -left-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 animate-float-medium flex-col gap-1">
                <div className="text-[10px] text-slate-500 font-bold">全体進捗</div>
                <div className="text-lg font-black text-emerald-600">75% 完成</div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-emerald-500 w-3/4" />
                </div>
            </div>

        </div>
    );
}
