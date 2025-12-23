import { memo } from 'react';
import { LifeEvent } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { ArrowRight, Church, Baby, Briefcase, Rocket, Home, HandHeart, Heart } from 'lucide-react';

interface EventCardProps {
  event: LifeEvent;
  onClick: () => void;
  index: number;
}

const colorMap: Record<string, string> = {
  'event-marriage': 'from-pink-500/90 to-rose-600/90',
  'event-birth': 'from-orange-400/90 to-amber-600/90',
  'event-job': 'from-sky-500/90 to-blue-600/90',
  'event-moving': 'from-emerald-500/90 to-teal-600/90',
  'event-care': 'from-violet-500/90 to-purple-600/90',
  'event-startup': 'from-orange-500/90 to-red-600/90',
};

const glassColorMap: Record<string, string> = {
  'event-marriage': 'bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-950/40 dark:to-rose-950/20',
  'event-birth': 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/40 dark:to-amber-950/20',
  'event-job': 'bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-950/40 dark:to-blue-950/20',
  'event-moving': 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/20',
  'event-care': 'bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-950/40 dark:to-purple-950/20',
  'event-startup': 'bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-950/40 dark:to-red-950/20',
};

const borderColorMap: Record<string, string> = {
  'event-marriage': 'border-pink-200/50 hover:border-pink-300/80 dark:border-pink-800/20 dark:hover:border-pink-700/40',
  'event-birth': 'border-orange-200/50 hover:border-orange-300/80 dark:border-orange-800/20 dark:hover:border-orange-700/40',
  'event-job': 'border-sky-200/50 hover:border-sky-300/80 dark:border-sky-800/20 dark:hover:border-sky-700/40',
  'event-moving': 'border-emerald-200/50 hover:border-emerald-300/80 dark:border-emerald-800/20 dark:hover:border-emerald-700/40',
  'event-care': 'border-violet-200/50 hover:border-violet-300/80 dark:border-violet-800/20 dark:hover:border-violet-700/40',
  'event-startup': 'border-orange-200/50 hover:border-orange-300/80 dark:border-orange-800/20 dark:hover:border-orange-700/40',
};

const iconMap: Record<string, React.ElementType> = {
  marriage: Church,
  birth: Baby,
  job: Briefcase,
  startup: Rocket,
  moving: Home,
  care: HandHeart,
};

// Memoized EventCard to prevent unnecessary re-renders
export const EventCard = memo(function EventCard({ event, onClick, index }: EventCardProps) {
  const IconComponent = iconMap[event.id] || Heart;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-8 rounded-3xl text-left transition-all duration-500",
        "backdrop-blur-xl border-2",
        "shadow-soft hover:shadow-xl",
        "animate-slide-up opacity-0 will-change-transform",
        "hover:-translate-y-1 active:scale-[0.98]",
        glassColorMap[event.color],
        borderColorMap[event.color]
      )}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 1s ease-in-out, opacity 0.5s' }} />

      <div className="flex items-start gap-6 relative z-10">
        <div
          className={cn(
            "relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
            "bg-gradient-to-br shadow-lg",
            "group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
            colorMap[event.color]
          )}
        >
          <IconComponent className="w-8 h-8 text-white" />
          {/* Icon Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${colorMap[event.color].split(' ')[0].replace('from-', 'hsl(var(--event-')}` }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full font-medium hover:scale-105 transition-transform">
              {event.tasks.length}件の手続き
            </span>
            <span className="px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full font-medium hover:scale-105 transition-transform">
              💰 {event.tasks.filter(t => t.benefitAmount).length}件の給付金
            </span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-soft">
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
    </button>
  );
});

