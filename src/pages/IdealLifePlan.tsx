import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Baby, GraduationCap, BriefcaseBusiness, Heart, Home, 
  Palmtree, Star, TrendingUp, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- Types & Data ---

type LifeStage = {
  id: string;
  icon: React.ElementType;
  title: string;
  period: string;
  description: string;
  milestones: string[];
  gradientTheme: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  topPosition: string; // Vertical position relative to the image wrapper
  side: 'left' | 'right';
};

const stages: LifeStage[] = [
  {
    id: 'childhood',
    icon: Baby,
    title: '誕生と成長',
    period: '0-18歳',
    description: '愛情に包まれて育ち、基本的な価値観や個性が形成される時期。',
    milestones: ['幼稚園・保育園', '小学校入学', '中学校・高校'],
    gradientTheme: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-100 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-800',
    topPosition: '8%',
    side: 'left'
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: '学びと探求',
    period: '18-22歳',
    description: '専門的な知識やスキルを身につけ、将来の方向性を模索。',
    milestones: ['大学・専門進学', '留学・語学学習', '資格取得'],
    gradientTheme: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    topPosition: '22%',
    side: 'right'
  },
  {
    id: 'career',
    icon: BriefcaseBusiness,
    title: 'キャリア構築と自立',
    period: '22-30歳',
    description: '社会人としての一歩を踏み出し、経済的な自立を目指す。',
    milestones: ['就職・起業', '専門スキル習得', '自己投資'],
    gradientTheme: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-100 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800',
    topPosition: '38%',
    side: 'left'
  },
  {
    id: 'marriage',
    icon: Heart,
    title: '結婚・パートナー',
    period: '28-35歳',
    description: '大切な人とともに人生を歩み始め、新しい絆を築く。',
    milestones: ['結婚', 'ライフスタイル統合', '将来設計の共有'],
    gradientTheme: 'from-red-500 to-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    topPosition: '55%',
    side: 'right'
  },
  {
    id: 'family',
    icon: Home,
    title: 'マイホーム・資産',
    period: '35-50歳',
    description: '安定した生活基盤を確立し、家族との時間を大切にする。',
    milestones: ['住宅購入', '子供の教育', '投資・資産運用'],
    gradientTheme: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    topPosition: '72%',
    side: 'left'
  },
  {
    id: 'retirement',
    icon: Palmtree,
    title: 'セカンドライフ',
    period: '60歳〜',
    description: '長年の努力が実り、趣味や社会貢献を楽しむ豊かな時間。',
    milestones: ['退職・リタイア', '旅行・趣味の充実', '健康寿命の延伸'],
    gradientTheme: 'from-amber-500 to-yellow-500',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    topPosition: '88%',
    side: 'right'
  }
];

// --- Hooks ---
function useFadeInOnScroll(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// --- Components ---
const SpeechBubble = ({ stage, index }: { stage: LifeStage; index: number }) => {
  const { ref, isVisible } = useFadeInOnScroll(0.3);
  const isLeft = stage.side === 'left';

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-20 w-[240px] sm:w-[300px] md:w-[340px] lg:w-[380px] transition-all duration-1000 ease-out",
        // Desktop placement (branching off the image wrapper)
        isLeft 
          ? "right-[90%] sm:right-full sm:mr-4 md:mr-8" 
          : "left-[90%] sm:left-full sm:ml-4 md:ml-8",
        // Mobile stack behavior (overlapping slightly to save space if needed)
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
      style={{ top: stage.topPosition }}
    >
      <Card className={cn(
        "relative overflow-visible group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300",
        "bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-white/30 dark:border-white/10"
      )}>
        {/* Glow behind the card */}
        <div className={cn(
          "absolute -inset-2 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl -z-10 bg-gradient-to-r hover:opacity-100",
          stage.gradientTheme
        )} />

        {/* The 'Speech Bubble' Triangle Pointer */}
        <div 
          className={cn(
            "absolute top-8 w-6 h-6 rotate-45 border bg-white/70 dark:bg-gray-950/70 hidden sm:block",
            isLeft 
              ? "-right-3 border-t-0 border-l-0 border-white/30 dark:border-white/10" 
              : "-left-3 border-b-0 border-r-0 border-white/30 dark:border-white/10"
          )} 
        />

        <CardContent className="p-5 md:p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl flex-shrink-0", stage.iconBg)}>
              <stage.icon className={cn("w-5 h-5", stage.iconColor)} />
            </div>
            <Badge variant="outline" className={cn("font-semibold ml-2 border", stage.borderColor, stage.iconColor, stage.iconBg)}>
              {stage.period}
            </Badge>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {stage.title}
          </h3>
          
          <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed mb-4">
            {stage.description}
          </p>
          
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-muted-foreground/70 uppercase">Milestones</p>
            <ul className="space-y-1.5">
              {stage.milestones.map((milestone, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                  <CheckCircle2 className={cn("w-3.5 h-3.5", stage.iconColor)} />
                  <span className="font-medium">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function IdealLifePlan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-primary/20 overflow-x-hidden font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 backdrop-blur-md bg-background/50 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" className="rounded-full gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">LifeBridge Vision</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 relative z-10 w-full overflow-hidden">
        
        {/* Hero Copy */}
        <section className="text-center px-4 pt-12 pb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 animate-in slide-in-from-top-4 fade-in duration-700">
            <Star className="w-3.5 h-3.5 mr-2 fill-primary/50" />
            Life Path Timeline
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            理想のライフプラン
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
            人生の階段を登るごとに、さまざまなライフイベントが訪れます。
            各ステージでの準備や心構えを可視化しました。
          </p>
        </section>

        {/* Central Vertical Timeline Area */}
        <section className="relative w-full pb-32 flex justify-center px-4 lg:px-0">
          
          {/* Main Visual Container */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] min-h-[800px] md:min-h-[1200px] animate-in zoom-in-95 fade-in duration-1000 delay-500 drop-shadow-2xl">
            
            {/* The vertical image */}
            <img 
              src="/vertical-roadmap.png" 
              alt="Vertical Life Stages" 
              className="w-full h-auto object-contain z-10 relative pointer-events-none drop-shadow-2xl"
            />
            
            {/* The Speech Bubbles tied to the image height */}
            {stages.map((stage, index) => (
              <SpeechBubble key={stage.id} stage={stage} index={index} />
            ))}
            
          </div>

        </section>

      </main>

    </div>
  );
}
