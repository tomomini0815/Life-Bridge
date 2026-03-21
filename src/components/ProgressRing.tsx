import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: 'default' | 'white';
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  variant = 'default'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const isWhite = variant === 'white';

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isWhite ? "rgba(255,255,255,0.2)" : "hsl(var(--muted))"}
          strokeWidth={strokeWidth}
          className={isWhite ? "" : "opacity-30"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isWhite ? "white" : "url(#gradient)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-1000 ease-out",
            !isWhite && "filter drop-shadow-[0_0_4px_rgba(20,184,166,0.4)]"
          )}
        />
        {!isWhite && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(
          "font-bold font-display leading-none flex items-baseline tracking-tight", 
          size <= 60 ? "text-sm" : size <= 80 ? "text-lg" : "text-3xl",
          isWhite ? "text-white" : "text-foreground"
        )}>
          {Math.round(progress)}
          <span className={size <= 80 ? "text-[0.6em] ml-0.5" : "text-xl ml-1"}>%</span>
        </span>
        <span className={cn(
          size <= 60 ? "text-[9px] scale-90" : size <= 80 ? "text-[10px] mt-1" : "text-xs mt-1", 
          isWhite ? "text-white/80" : "text-muted-foreground",
          "leading-none font-medium"
        )}>完了</span>
      </div>
    </div>
  );
}
