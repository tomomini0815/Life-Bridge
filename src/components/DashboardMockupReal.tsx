import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export function DashboardMockupReal() {
    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 py-12 md:py-24 lg:py-32 overflow-visible">

            {/* Decorative Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 rounded-full blur-3xl -z-10" />

            {/* Macbook Pro Mockup (Front View) */}
            <div className="relative mx-auto w-full max-w-[950px] transition-all duration-700 hover:scale-[1.01]">

                {/* Glow behind laptop */}
                <div className="absolute -inset-10 bg-emerald-500/10 rounded-[3rem] blur-3xl opacity-30 -z-10" />

                {/* Screen Part */}
                <div className="relative rounded-t-[1.8rem] bg-[#0a0a0a] p-[8px] pb-0 border-x-[1px] border-t-[1px] border-slate-800 shadow-2xl overflow-hidden aspect-[16/10]">
                    {/* Top Bezel + Camera */}
                    <div className="absolute top-0 left-0 right-0 h-7 bg-black z-20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800 ring-1 ring-white/5" />
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="relative w-full h-full rounded-t-xl overflow-hidden border border-white/5 bg-slate-900">
                        <img
                            src="/assets/images/dashboard_desktop_v3.png"
                            alt="LifeBridge Desktop"
                            className="w-full h-full object-contain"
                        />
                        {/* Subtle Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </div>
                </div>

                {/* Macbook Keyboard/Base Part (Simplified Front View) */}
                <div className="relative h-4 md:h-5 bg-gradient-to-b from-slate-200 to-slate-400 rounded-b-[2rem] w-[104%] -left-[2%] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] border-t border-white/20">
                    {/* Center Groove */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-black/20 rounded-b-xl" />
                </div>
            </div>

            {/* iPhone 15 Pro Mockup (Front View, Floating) */}
            <div className="absolute -bottom-6 right-[2%] md:-bottom-12 md:right-[5%] lg:right-[10%] w-[160px] md:w-[260px] z-30 transition-all duration-700 hover:scale-[1.05]">

                {/* Phone Frame */}
                <div className="relative aspect-[9/19.5] rounded-[2.8rem] bg-[#1a1a1a] p-[8px] border-[1px] border-slate-700 shadow-3xl overflow-hidden ring-1 ring-white/10">

                    {/* Dynamic Island */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-20 flex items-center justify-end px-2" />

                    {/* Screen Content */}
                    <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden bg-white">
                        <img
                            src="/assets/images/dashboard_mobile_v2.png"
                            alt="LifeBridge Mobile"
                            className="w-full h-full object-cover translate-y-6"
                        />
                        {/* Subtle Gradient Shadow at Top */}
                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* Floating AI Helper Badge */}
                <div className="absolute -bottom-4 -left-12 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl p-3 md:p-5 border border-emerald-100 dark:border-emerald-900/30 animate-float-slow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-[10px] md:text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">AI CONCIERGE</div>
                            <div className="text-[9px] md:text-[11px] text-emerald-600 font-bold">瞬時に解決</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
