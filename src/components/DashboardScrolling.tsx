import React from 'react';
import { Sparkles } from 'lucide-react';

export function DashboardScrolling() {
    return (
        <div className="relative w-full max-w-[1000px] mx-auto group perspective-1000">
            {/* Background Glow (Removed pulse to avoid flickering) */}
            <div className="absolute -inset-20 bg-emerald-500/5 rounded-full blur-[100px] opacity-30 -z-10" />

            {/* MacBook Pro Frame */}
            <div className="relative z-10 transition-transform duration-700 hover:scale-[1.02]">
                <img
                    src="/assets/images/macbook_frame.png"
                    alt="MacBook Pro"
                    className="w-full h-auto drop-shadow-2xl"
                />

                {/* Screen Area */}
                {/* Adjust these percentages to perfectly fit the frame’s screen area */}
                <div 
                    className="absolute top-[7.7%] left-[9.7%] right-[9.7%] bottom-[14.5%] overflow-hidden bg-[#0f172a] rounded-[2px] shadow-inner"
                >
                    {/* Scrolling Dashboard Image */}
                    <div 
                        className="w-full animate-scroll hover:[animation-play-state:paused]" 
                        style={{ '--scroll-end': '-68%' } as React.CSSProperties}
                    >
                        <img
                            src="/assets/images/dashboard_full_scrolling.png"
                            alt="LifeBridge Dashboard"
                            className="w-full h-auto"
                        />
                        {/* Simple duplicate for a more continuous feel if the image were shorter, 
                            but for a long screenshot we just loop the whole thing or use a slow linear scroll. */}
                    </div>

                    {/* Subtle Reflection & Overlays */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {/* Screen Glare */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
                        {/* Inner Bezels Shadow */}
                        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
                    </div>
                </div>
            </div>

            {/* Floating Achievement Badge (Removed float to avoid flickering) */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 border border-emerald-100 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-[10px] md:text-sm font-black text-slate-800 uppercase tracking-widest mb-1">DASHBOARD</div>
                        <div className="text-[12px] md:text-lg font-bold text-emerald-600 leading-tight">直観的な操作感</div>
                    </div>
                </div>
            </div>

            {/* Platform Badges */}
            <div className="absolute top-1/2 -left-8 md:-left-16 -translate-y-1/2 flex flex-col gap-4 z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 border border-slate-200">WEB APP</div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 border border-slate-200">DESKTOP</div>
            </div>
        </div>
    );
}
