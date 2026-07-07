import React from 'react';
import { MessageCircle, Minus } from 'lucide-react';

export function DashboardMockupReal() {
    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 pt-12 pb-12 md:pb-24 lg:pb-32 overflow-visible">

            {/* Decorative Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 rounded-full blur-3xl -z-10" />

            {/* Macbook Pro Mockup (Front View) */}
            <div className="relative mx-auto w-full max-w-[950px] transition-all duration-700 hover:scale-[1.01]">

                {/* Glow behind laptop */}
                <div className="absolute -inset-10 bg-emerald-500/10 rounded-[3rem] blur-3xl opacity-30 -z-10" />

                {/* Screen Part */}
                <div className="relative rounded-t-[1.8rem] bg-[#0a0a0a] p-[8px] pb-0 border-x-[1px] border-t-[1px] border-slate-800 shadow-2xl overflow-hidden aspect-[16/10]">
                    {/* Top Bezel + Camera (Slimmer to prevent header overlap) */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-black z-20 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-slate-800 ring-1 ring-white/5" />
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="relative w-full h-full rounded-t-[1.3rem] overflow-hidden border border-white/5 bg-slate-900">
                        <img
                            src="/assets/images/dashboard_desktop_v4.png"
                            alt="LifeBridge Desktop"
                            className="w-full h-full object-cover object-top"
                        />
                        {/* Privacy Mask for Account Sidebar (Bottom Left) */}
                        <div className="absolute bottom-[2%] left-[2%] w-[20%] h-[12%] bg-slate-900/40 backdrop-blur-md rounded-lg border border-white/10 z-10" />

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
            <div className="absolute -bottom-6 right-[2%] md:bottom-[5%] md:right-[5%] lg:right-[10%] w-[160px] md:w-[260px] z-30 transition-all duration-700 hover:scale-[1.05]">

                {/* Phone Frame */}
                <div className="relative aspect-[9/19.5] rounded-[2.4rem] md:rounded-[2.8rem] bg-[#1a1a1a] p-[4px] md:p-[6px] border-[1px] border-slate-700 shadow-3xl overflow-hidden ring-1 ring-white/10 z-20">

                    {/* Dynamic Island */}
                    <div className="absolute top-2.5 md:top-3 left-1/2 -translate-x-1/2 w-16 h-[18px] md:h-5 bg-black rounded-full z-20 flex items-center justify-end px-2" />

                    {/* Screen Content */}
                    <div className="relative w-full h-full rounded-[2.2rem] md:rounded-[2.5rem] overflow-hidden bg-white">
                        <img
                            src="/assets/images/dashboard_mobile_v2.png"
                            alt="LifeBridge Mobile"
                            className="w-full h-full object-cover translate-y-6"
                        />
                        {/* Subtle Gradient Shadow at Top */}
                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10" />
                        
                        {/* Mobile AI Concierge Chat Bubble (Overlay) */}
                        <div className="absolute bottom-6 right-3 md:bottom-8 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-full shadow-[0_4px_12px_rgba(5,150,105,0.4)] flex items-center justify-center z-20">
                            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            <div className="absolute -top-1 -left-1 w-4 h-4 md:w-5 md:h-5 bg-slate-500 rounded-full border-2 border-white flex items-center justify-center">
                                <Minus className="w-[8px] h-[8px] md:w-[10px] md:h-[10px] text-white" strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating AI Helper Badge (Removed per user request) */}
            </div>

        </div>
    );
}
