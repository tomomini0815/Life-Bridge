import { LifeEvent } from '@/types/lifeEvent';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Sparkles, ArrowRight, CheckCircle, Zap, Church, Baby, Briefcase, Rocket, Home, HandHeart, HelpCircle, Clock, Coins, FileText, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/ui/hero-section-with-smooth-bg-shader';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';
import { useMemo } from 'react';
interface LandingPageProps {
  events: LifeEvent[];
  onSelectEvent: (event: LifeEvent) => void;
}

const features = [
  {
    icon: Sparkles,
    title: 'AIが最適な順序を提案',
    description: '複雑な手続きの依存関係を分析し、最も効率的な順番をガイド',
  },
  {
    icon: Shield,
    title: '期限アラートで安心',
    description: '重要な締め切りを見逃さない。プッシュ通知でリマインド',
  },
  {
    icon: Heart,
    title: '給付金を逃さない',
    description: 'もらえるはずのお金を見逃さない。申請可能な給付金を自動表示',
  },
];

const stats = [
  { value: '50万組', label: '年間の結婚件数' },
  { value: '70万人', label: '年間の出生数' },
  { value: '120万円+', label: '平均獲得可能給付金' },
];

export function LandingPage({ events, onSelectEvent }: LandingPageProps) {
  const navigate = useNavigate();

  // Memoize icon mapping for better performance
  const getEventIcon = useMemo(() => {
    const iconMap: Record<string, React.ReactNode> = {
      'marriage': <Church className="w-8 h-8 text-white" />,
      'birth': <Baby className="w-8 h-8 text-white" />,
      'job': <Briefcase className="w-8 h-8 text-white" />,
      'startup': <Rocket className="w-8 h-8 text-white" />,
      'moving': <Home className="w-8 h-8 text-white" />,
      'care': <HandHeart className="w-8 h-8 text-white" />,
    };
    return (eventId: string) => iconMap[eventId] || <Sparkles className="w-8 h-8 text-white" />;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <HeroSection
        title="複雑な手続きを"
        highlightText="シンプルに。"
        description="結婚、出産、転職、引越し...人生の大きな変化に必要な手続きを、AIが最適な順序でナビゲート"
        buttonText="無料で始める"
        secondaryButtonText="詳しく見る"
        onButtonClick={() => navigate('/dashboard')}
        onSecondaryButtonClick={() => {
          const featuresSection = document.getElementById('features');
          featuresSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        colors={["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"]}
        distortion={0.8}
        swirl={0.6}
        speed={0.42}
        showStats={true}
        stats={stats}
        titleFontWeight="font-medium"
      />

      {/* Features Section */}
      <section id="features" className="py-32 relative bg-gradient-to-b from-transparent to-background/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              主な機能
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              あなたをサポートする3つの機能
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AIが最適化した手続きフローで、人生の転機をスムーズに
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-3xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Gradient Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:shadow-xl group-hover:shadow-teal-500/50 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Selection Section */}
      <section className="py-32 relative bg-gradient-to-b from-background/50 to-transparent overflow-hidden">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              あなたのライフイベント
            </div>
            <h2 className="text-4xl md:text-5xl font-medium mb-6">何が起きましたか？</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              あなたのライフイベントを選択してください。
              必要な手続きリストをすぐにご用意します。
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="group relative p-8 rounded-3xl bg-white/30 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Gradient Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:shadow-xl group-hover:shadow-teal-500/50 group-hover:scale-110 transition-all duration-300">
                    {getEventIcon(event.id)}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-teal-500" />
                      <span>{event.tasks?.length || 0}件の手続き</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section - Relatable Pain Points */}
      <section className="py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/30 via-transparent to-emerald-50/30 dark:from-teal-950/10 dark:via-transparent dark:to-emerald-950/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-6">
              <Heart className="w-4 h-4" />
              あなたの不安、わかります
            </div>
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              こんなことで<br className="md:hidden" />お困りではないですか？
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              人生の転機には、たくさんの不安がつきもの。
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: HelpCircle,
                title: '何から始めればいいか\nわからない...',
                description: '結婚届を出したけど、その後の手続きが山ほど。健康保険、年金、銀行、クレジットカード...どれから手をつければいいの？',
                color: 'from-rose-400 to-pink-500',
              },
              {
                icon: Clock,
                title: '期限に間に合うか\n心配...',
                description: '出産後14日以内に出生届、30日以内に児童手当...期限がバラバラで混乱。忘れたら大変なことになるかも。',
                color: 'from-orange-400 to-amber-500',
              },
              {
                icon: Coins,
                title: 'もらえるお金を\n見逃してないか不安...',
                description: '出産一時金、育児休業給付金、失業手当...制度が複雑すぎて、自分が何をもらえるのかわからない。損してるかも？',
                color: 'from-emerald-400 to-teal-500',
              },
              {
                icon: FileText,
                title: '書類が多すぎて\n頭がパンク...',
                description: '役所、会社、銀行、保険会社...それぞれ違う書類を要求される。何を準備すればいいのか、もう限界。',
                color: 'from-blue-400 to-cyan-500',
              },
              {
                icon: Users,
                title: '忙しくて\n時間がない...',
                description: '仕事に育児に家事...平日は役所に行けないし、土日は閉まってる。いつ手続きすればいいの？',
                color: 'from-violet-400 to-purple-500',
              },
              {
                icon: AlertCircle,
                title: '誰に聞けばいいか\nわからない...',
                description: '友達に聞いても状況が違うし、ネットの情報は古かったり間違ってたり。信頼できる情報が欲しい。',
                color: 'from-fuchsia-400 to-pink-500',
              },
            ].map((problem, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {/* Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.color} opacity-80 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 leading-tight whitespace-pre-line">
                      {problem.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed pl-20">
                  {problem.description}
                </p>

                {/* Hover effect decoration */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            ))}
          </div>

          {/* Solution CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 border border-teal-200/50 dark:border-teal-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                  そんなあなたのために、LifeBridgeがあります
                </h3>
                <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                AIが最適な順序を提案し、期限を管理し、もらえる給付金を教えてくれる。<br />
                <span className="font-semibold text-teal-700 dark:text-teal-300">あなたは、ただ指示に従うだけ。</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-3xl p-16 shadow-xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 gradient-warm" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 font-display">
                大切な手続きを、もう忘れない
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                120万円以上の給付金を見逃している人も。
                LifeBridgeで、あなたが受け取れるすべてを確認しましょう。
              </p>
              <Button variant="glass" size="xl" className="text-foreground font-semibold hover:scale-105 shadow-xl" onClick={() => navigate('/dashboard')}>
                今すぐ無料で始める
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30 p-2">
                <LifeBridgeLogo className="w-full h-full" />
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                LifeBridge
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <button
                onClick={() => navigate('/terms')}
                className="hover:text-foreground transition-colors"
              >
                利用規約
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="hover:text-foreground transition-colors"
              >
                プライバシーポリシー
              </button>
              <button
                onClick={() => navigate('/commercial-transaction')}
                className="hover:text-foreground transition-colors"
              >
                特定商取引法
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 LifeBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
