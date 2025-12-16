import { LifeEvent } from '@/types/lifeEvent';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-soft" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 pt-8 pb-16">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
                <span className="text-xl">🌉</span>
              </div>
              <span className="text-xl font-bold font-display">LifeBridge</span>
            </div>
            <Button variant="soft" size="sm">
              ログイン
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              人生の転機をスムーズに
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up font-display leading-tight">
              複雑な手続きを
              <br />
              <span className="text-gradient">シンプルに。</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up max-w-xl mx-auto" style={{ animationDelay: '0.1s' }}>
              結婚、出産、転職、引越し...
              <br />
              人生の大きな変化に必要な手続きを、AIが最適な順序でナビゲート
            </p>

            <div className="flex items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button variant="gradient" size="xl">
                無料で始める
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                詳しく見る
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-background shadow-soft border border-border/50 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Selection Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-display">何が起きましたか？</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              あなたのライフイベントを選択してください。
              必要な手続きリストをすぐにご用意します。
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center gradient-warm rounded-3xl p-12 shadow-glow">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4 font-display">
              大切な手続きを、もう忘れない
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              120万円以上の給付金を見逃している人も。
              LifeBridgeで、あなたが受け取れるすべてを確認しましょう。
            </p>
            <Button variant="glass" size="xl" className="text-foreground">
              今すぐ無料で始める
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                <span className="text-sm">🌉</span>
              </div>
              <span className="font-semibold">LifeBridge</span>
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
