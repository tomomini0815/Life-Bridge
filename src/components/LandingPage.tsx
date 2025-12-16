import { LifeEvent } from '@/types/lifeEvent';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Sparkles, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 gradient-soft" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute inset-0 gradient-hero" />

        {/* Floating Blur Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float will-change-transform" />
        <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-accent/15 rounded-full blur-3xl animate-float-delayed will-change-transform" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse-soft" />

        <div className="relative container mx-auto px-4 pt-8 pb-20">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-20 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gradient-warm flex items-center justify-center shadow-colored-primary">
                <span className="text-2xl">🌉</span>
              </div>
              <span className="text-xl font-bold font-display">LifeBridge</span>
            </div>
            <Button variant="soft" size="sm" className="hover-lift">
              ログイン
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-light text-primary text-sm font-semibold mb-8 animate-fade-in hover-lift">
              <Sparkles className="w-4 h-4" />
              人生の転機をスムーズに
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 animate-slide-up font-display leading-[1.1]">
              複雑な手続きを
              <br />
              <span className="text-gradient-shimmer">シンプルに。</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-slide-up max-w-2xl mx-auto leading-relaxed stagger-1" style={{ animationDelay: '0.1s' }}>
              結婚、出産、転職、引越し...
              <br />
              人生の大きな変化に必要な手続きを、AIが最適な順序でナビゲート
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-slide-up stagger-2" style={{ animationDelay: '0.2s' }}>
              <Button variant="premium" size="xl" onClick={() => navigate('/dashboard')} className="group">
                無料で始める
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="xl" className="hover-lift">
                詳しく見る
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-slide-up stagger-3" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group hover-lift">
                  <p className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-3xl glass-medium hover-lift animate-slide-up opacity-0 will-change-transform"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center mb-6 shadow-colored-primary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}</div>
        </div>
      </section>

      {/* Event Selection Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              あなたのライフイベント
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">何が起きましたか？</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              あなたのライフイベントを選択してください。
              必要な手続きリストをすぐにご用意します。
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onSelectEvent(event)}
                index={index}
              />
            ))}
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
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center shadow-colored-primary">
                <span className="text-lg">🌉</span>
              </div>
              <span className="text-lg font-bold font-display">LifeBridge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LifeBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
