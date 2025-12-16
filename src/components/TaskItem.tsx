import { Task } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { Check, Clock, FileText, MapPin, Wifi, AlertCircle, ChevronDown, Coins, Briefcase, Landmark, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  eventColor: string;
}

const priorityStyles = {
  high: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50/80',
  medium: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-50/80',
  low: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50/80',
};

const categoryIcons = {
  government: Landmark,
  benefit: Coins,
  private: Briefcase,
};

const categoryLabels = {
  government: '行政手続き',
  benefit: '給付金申請',
  private: '民間手続き',
};

const categoryStyles = {
  government: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  benefit: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  private: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export function TaskItem({ task, onToggle, eventColor }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const CategoryIcon = categoryIcons[task.category];

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.officialUrl) {
      window.open(task.officialUrl, '_blank');
    }
  };

  return (
    <>
      <div
        className={cn(
          "group rounded-2xl border-l-[6px] transition-all duration-300 overflow-hidden",
          "glass-light hover:glass-medium shadow-sm hover:shadow-lg border-y border-r border-border/50",
          task.completed ? "opacity-60 grayscale-[0.5] border-l-muted hover:opacity-80" : priorityStyles[task.priority]
        )}
      >
        <div
          className="p-5 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(task.id);
              }}
              className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                "transition-all duration-300 shadow-sm",
                task.completed
                  ? "bg-primary border-primary text-primary-foreground scale-110"
                  : "border-muted-foreground/30 bg-background hover:border-primary hover:scale-110"
              )}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg",
                  categoryStyles[task.category]
                )}>
                  <CategoryIcon className="w-3.5 h-3.5" />
                  {categoryLabels[task.category]}
                </span>

                {task.benefitAmount && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-sm">
                    <Coins className="w-3.5 h-3.5" />
                    {task.benefitAmount.toLocaleString()}円
                  </span>
                )}

                {task.deadline && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg",
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  )}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {task.deadline}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <h4 className={cn(
                  "font-bold text-lg text-foreground transition-all duration-300",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                {task.description}
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  所要時間: {task.estimatedTime}
                </span>
                {task.isOnline && (
                  <span className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                    <Wifi className="w-3.5 h-3.5" />
                    オンライン申請可
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid transition-all duration-300 ease-in-out border-t border-border/10 bg-white/30 dark:bg-black/10",
          isExpanded ? "grid-rows-[1fr] opacity-100 py-4" : "grid-rows-[0fr] opacity-0 py-0"
        )}>
          <div className="overflow-hidden px-5">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  必要書類
                </h5>
                <ul className="space-y-2">
                  {task.requiredDocs.map((doc, i) => (
                    <li key={i} className="text-sm flex items-start gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-foreground/90">{doc}</span>
                    </li>
                  ))}
                </ul>

                {/* External Link Button */}
                {task.officialUrl && !task.completed && (
                  <div className="mt-4">
                    <Button
                      onClick={handleExternalLink}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all group/link"
                    >
                      <ExternalLink className="w-4 h-4 mr-2 group-hover/link:translate-x-1 transition-transform" />
                      {task.isOnline ? "オンライン申請サイトへ" : "公式サイトで確認"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  提出先・方法
                </h5>
                <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                  <p className="text-sm font-medium">{task.submitTo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
