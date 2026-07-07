import React from 'react';
import { RoadmapTimeline } from '@/components/roadmap/RoadmapTimeline';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LifePlanRoadmap: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-sans selection:bg-orange-200 relative">
      {/* Playful Dot Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#e6aa85 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/80 backdrop-blur-md border-b-2 border-dashed border-orange-200 p-4 flex justify-between items-center px-4 md:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>戻る</span>
        </button>
        <div className="font-extrabold text-[#115e59] text-xl flex items-center gap-1 tracking-tight">
          LifeBridge
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-16 px-4 sm:px-6 relative overflow-hidden z-10">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 opacity-20 text-orange-400 rotate-12 animate-pulse [animation-duration:3s]">
          <Sparkles className="w-16 h-16" />
        </div>
        <div className="absolute top-60 left-10 opacity-20 text-teal-500 -rotate-12 animate-pulse [animation-duration:4s]">
          <Sparkles className="w-12 h-12" />
        </div>

        {/* Page Title */}
        <div className="text-center mb-24 relative">
          <div className="inline-block relative">
            <span className="absolute -top-6 -left-8 bg-yellow-300 text-yellow-900 text-sm font-black px-4 py-1.5 -rotate-12 rounded-lg shadow-sm border border-yellow-400"
                  style={{ borderRadius: '15px 5px 15px 5px/5px 15px 5px 15px' }}>
              よりぬき
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white bg-gradient-to-br from-[#f89c56] to-[#e87a35] px-10 py-5 inline-block shadow-lg border-[3px] border-white"
                style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>
              ライフプラン応援！ロードマップ
            </h1>
          </div>
          <p className="mt-8 text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed text-lg px-4 md:px-0 bg-white/50 backdrop-blur-sm py-4 rounded-2xl border border-stone-100 shadow-sm">
            人生のイベントに合わせて、あなたをサポートする制度がたくさんあります。<br />
            順を追ってどんな支援が受けられるか確認してみましょう！
          </p>
        </div>

        {/* Timeline Component */}
        <RoadmapTimeline />
      </main>
    </div>
  );
};

export default LifePlanRoadmap;
