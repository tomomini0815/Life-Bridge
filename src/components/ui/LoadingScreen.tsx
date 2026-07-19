import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none">
      <div className="flex flex-col items-center space-y-8 animate-fade-in">
        {/* スタイリッシュでプレミアムなロゴのプレースホルダー（パルスアニメーション） */}
        <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-teal-400 via-emerald-400 to-indigo-500 rounded-3xl shadow-[0_0_50px_rgba(45,212,191,0.25)] border border-white/10 animate-pulse">
          <span className="text-4xl font-display font-bold tracking-widest text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">LB</span>
        </div>
        
        <div className="flex flex-col items-center space-y-3 text-center">
          <h2 className="text-2xl font-display font-medium tracking-[0.2em] text-slate-100">LifeBridge</h2>
          <p className="text-xs text-slate-400 tracking-[0.15em] font-light">AIパートナーを起動しています...</p>
        </div>

        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-teal-400/90" />
        </div>
      </div>
    </div>
  );
}
