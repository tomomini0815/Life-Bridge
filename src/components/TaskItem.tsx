import { Task } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { Check, Clock, FileText, MapPin, Wifi, AlertCircle, ChevronDown, Coins } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  eventColor: string;
}

const priorityStyles = {
  high: 'border-l-red-400 bg-red-50/50',
  medium: 'border-l-amber-400 bg-amber-50/30',
  low: 'border-l-green-400 bg-green-50/30',
};

const priorityLabels = {
  high: '優先度：高',
  medium: '優先度：中',
  low: '優先度：低',
};

const categoryIcons = {
  government: '🏛️',
  benefit: '💰',
  private: '🏢',
};

const categoryLabels = {
  government: '行政手続き',
  benefit: '給付金申請',
  private: '民間手続き',
};

export function TaskItem({ task, onToggle, eventColor }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 overflow-hidden transition-all duration-300",
        "bg-card shadow-soft hover:shadow-card",
        task.completed ? "opacity-60 border-l-muted" : priorityStyles[task.priority]
      )}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              "transition-all duration-300",
              task.completed 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-border hover:border-primary"
            )}
          >
            {task.completed && <Check className="w-4 h-4" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-base">
                {categoryIcons[task.category]}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                task.category === 'benefit' 
                  ? "bg-amber-100 text-amber-700" 
                  : task.category === 'government'
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              )}>
                {categoryLabels[task.category]}
              </span>
              {task.benefitAmount && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {task.benefitAmount.toLocaleString()}円
                </span>
              )}
            </div>
            
            <h4 className={cn(
              "font-medium text-foreground",
              task.completed && "line-through"
            )}>
              {task.title}
            </h4>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.estimatedTime}
              </span>
              {task.deadline && (
                <span className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  {task.deadline}
                </span>
              )}
              {task.isOnline && (
                <span className="flex items-center gap-1 text-green-600">
                  <Wifi className="w-3 h-3" />
                  オンライン可
                </span>
              )}
            </div>
          </div>
          
          <ChevronDown 
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform duration-300",
              isExpanded && "rotate-180"
            )} 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50 animate-fade-in">
          <div className="grid gap-3">
            <div>
              <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                必要書類
              </h5>
              <ul className="space-y-1">
                {task.requiredDocs.map((doc, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                提出先
              </h5>
              <p className="text-sm">{task.submitTo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
