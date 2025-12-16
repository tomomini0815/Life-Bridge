import { LifeEvent } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: LifeEvent;
  onClick: () => void;
  index: number;
}

const colorMap: Record<string, string> = {
  'event-marriage': 'from-pink-400 to-rose-500',
  'event-birth': 'from-orange-300 to-amber-500',
  'event-job': 'from-sky-400 to-blue-500',
  'event-moving': 'from-emerald-400 to-teal-500',
  'event-care': 'from-violet-400 to-purple-500',
};

const bgColorMap: Record<string, string> = {
  'event-marriage': 'bg-pink-50 hover:bg-pink-100',
  'event-birth': 'bg-orange-50 hover:bg-orange-100',
  'event-job': 'bg-sky-50 hover:bg-sky-100',
  'event-moving': 'bg-emerald-50 hover:bg-emerald-100',
  'event-care': 'bg-violet-50 hover:bg-violet-100',
};

export function EventCard({ event, onClick, index }: EventCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-6 rounded-2xl text-left transition-all duration-300",
        "border border-border/50 shadow-soft hover:shadow-card",
        "animate-slide-up opacity-0",
        bgColorMap[event.color]
      )}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-4">
        <div 
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
            "bg-gradient-to-br shadow-md",
            colorMap[event.color]
          )}
        >
          {event.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-background/80 rounded-full">
              {event.tasks.length}件の手続き
            </span>
            <span className="px-2 py-1 bg-background/80 rounded-full">
              💰 {event.tasks.filter(t => t.benefitAmount).length}件の給付金
            </span>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}
