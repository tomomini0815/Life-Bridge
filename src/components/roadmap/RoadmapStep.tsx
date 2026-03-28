import React from 'react';
import { RoadmapEvent, SupportInfo } from './RoadmapData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface HandDrawnCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  dashed?: boolean;
}

// Helper to create a hand-drawn look using a custom border radius
const HandDrawnCard: React.FC<HandDrawnCardProps> = ({ children, className, borderColor = 'border-orange-300', dashed = false }) => {
  return (
    <div
      className={cn(
        "bg-[#fffdf8] relative overflow-hidden transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:shadow-[12px_20px_40px_-12px_rgba(230,170,133,0.5)]",
        "border-[3px]",
        borderColor,
        dashed ? "border-dashed" : "border-solid",
        className
      )}
      style={{
        // A comic hand-drawn border radius style
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.05)'
      }}
    >
      {children}
    </div>
  );
};

export const RoadmapStepComponent: React.FC<{ event: RoadmapEvent; index: number }> = ({ event, index }) => {
  const Icon = event.icon;

  return (
    <div className={cn(
      "relative w-full md:w-[45%] mb-12 group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both",
      event.isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8 origin-left",
    )}
    style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Connector Line (visible on desktop) */}
      <div className={cn(
        "hidden md:block absolute top-[50%] w-8 border-b-[4px] border-dashed border-orange-300 -z-10 opacity-60 group-hover:border-orange-500 group-hover:opacity-100 transition-colors duration-500",
        event.isLeft ? "-right-8" : "-left-8"
      )} />

      {/* Floating dot connector */}
      <div className={cn(
        "hidden md:flex absolute top-[50%] -translate-y-1/2 w-8 h-8 rounded-full border-[4px] border-white z-10 items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-125 group-hover:shadow-lg",
        event.color,
        event.isLeft ? "-right-[49px]" : "-left-[49px]"
      )}>
        <Icon className="w-4 h-4 text-white" strokeWidth={3} />
      </div>

      <HandDrawnCard className="p-6 md:p-8 pt-10 md:pt-12 border-[#e6aa85] relative overflow-visible">
        {/* Floating Illustration */}
        {event.imageUrl && (
          <div className={cn(
            "absolute -top-14 z-20 w-28 h-28 md:w-36 md:h-36 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2",
            "-right-2 md:-right-6" // Shift out towards the right edge so it doesn't block text
          )}>
            {/* Background mask to gently erase any overlapping lines (card borders or center timeline) behind the image */}
            <div className="absolute inset-0 bg-[#fffdf8] rounded-full blur-xl scale-90 -z-10 opacity-100" />
            <div className="absolute inset-0 bg-[#fffdf8] rounded-full blur-2xl scale-110 -z-10 opacity-70" />
            
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-contain drop-shadow-md opacity-90 relative z-10"
            />
          </div>
        )}

        {/* Title Badge / Header */}
        <div className={cn(
          "flex items-center gap-3 mb-5 relative z-10",
          "pr-24 md:pr-32" // Massive padding to strictly prevent text from reaching underneath the image and its blur mask
        )}>
          <div className={cn("p-2 rounded-full text-white shrink-0 shadow-sm", event.color)}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg md:text-2xl text-stone-800 leading-[1.3] whitespace-pre-wrap break-words">
              {event.title}
            </h3>
            {event.subtitle && (
              <p className="text-orange-600 font-bold text-xs md:text-sm mt-2">{event.subtitle}</p>
            )}
          </div>
        </div>

        {/* Badges */}
        {event.badges && event.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.badges.map((badge, idx) => (
              <span key={idx} className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-sm border border-green-300"
                    style={{ borderRadius: '15px 5px 15px 5px/5px 15px 5px 15px' }}>
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-stone-600 text-sm mb-4 leading-relaxed font-medium">
            {event.description}
          </p>
        )}

        {/* Supports List */}
        {event.supports && event.supports.length > 0 && (
          <div className="space-y-3 mt-6">
            {event.supports.map((support, idx) => (
              <div key={idx} className="relative bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-4 rounded-xl border border-orange-200/60 shadow-[inset_0_2px_10px_rgba(255,255,255,1)] hover:shadow-md hover:border-orange-300 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <span className="font-extrabold text-stone-700 text-sm md:text-base flex-1">{support.title}</span>
                  {support.amount && (
                    <span className="bg-gradient-to-r from-teal-500 to-teal-400 text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap self-start shadow-sm border border-teal-300/50">
                      {support.amount}
                    </span>
                  )}
                </div>
                <p className="text-stone-600 font-medium text-xs md:text-sm mt-3 leading-relaxed">
                  {support.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </HandDrawnCard>
    </div>
  );
};
