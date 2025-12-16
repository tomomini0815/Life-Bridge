import { Task } from '@/types/lifeEvent';
import { cn } from '@/lib/utils';
import { Check, Clock, FileText, MapPin, Wifi, AlertCircle, ChevronDown, Coins, Briefcase, Landmark, ScanLine, Sparkles, Send, Printer } from 'lucide-react';
import { useState } from 'react';
import { DocumentScanner } from './DocumentScanner';
import { MynaPortalConnect } from './MynaPortalConnect';
import { KonbiniPrintModal } from './KonbiniPrintModal';
import { Button } from './ui/button';
import { ExtractedData } from '@/services/OCRService';
import { MynaService } from '@/services/MynaService';
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  eventColor: string;
  onOpenMynaModal: () => void;
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

export function TaskItem({ task, onToggle, eventColor, onOpenMynaModal }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  // const [showMynaConnect, setShowMynaConnect] = useState(false); // Removed
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [mynaConnected, setMynaConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const CategoryIcon = categoryIcons[task.category];

  const handleScanComplete = (data: ExtractedData) => {
    console.log("Scanned data:", data);

    // Simulate "Magic" auto-fill effect
    toast.success("書類を認識しました！", {
      description: "タスク情報を自動入力しました",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      duration: 4000
    });

    // In a real app, this would update the task state
    // For now we just complete it to show impact
    // onToggle(task.id); 
  };

  const handleMynaConnect = () => {
    setMynaConnected(true);
    toast.success("マイナポータルと連携しました", {
      icon: <span className="text-xl">🐰</span>,
    });
  };

  const handleOneTapApply = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!mynaConnected) {
      onOpenMynaModal(); // Use prop from parent
      return;
    }

    if (confirm("マイナポータルを通じて電子申請を行いますか？")) {
      setIsSubmitting(true);
      const result = await MynaService.submitApplication(task.id, {});
      setIsSubmitting(false);

      if (result.success) {
        toast.success("申請が完了しました！", {
          description: "行政手続きが正常に受理されました",
          icon: <Send className="w-5 h-5 text-blue-500" />,
        });
        onToggle(task.id);
      }
    }
  };

  const isGovernmentTask = task.category === 'government' || task.category === 'benefit';
  // Assume private tasks or offline tasks need paper
  const isPaperTask = !task.isOnline || task.category === 'private';

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
                  {/* Quick Action Buttons */}
                  {!task.completed && !isExpanded && (
                    <>
                      {isGovernmentTask && (
                        <Button
                          size="sm"
                          onClick={handleOneTapApply}
                          disabled={isSubmitting}
                          className={cn(
                            "h-8 px-3 text-xs font-semibold rounded-full shadow-sm transition-all animate-fade-in",
                            mynaConnected
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "bg-pink-500 hover:bg-pink-600 text-white"
                          )}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                              送信中...
                            </span>
                          ) : mynaConnected ? (
                            <span className="flex items-center gap-1">
                              <Send className="w-3 h-3" />
                              ワンタップ申請
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span className="text-sm">🐰</span>
                              マイナ申請
                            </span>
                          )}
                        </Button>
                      )}
                      {isPaperTask && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPrintModal(true);
                          }}
                          className="h-8 px-3 text-xs font-semibold rounded-full shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white animate-fade-in"
                        >
                          <Printer className="w-3 h-3 mr-1" />
                          申請書作成
                        </Button>
                      )}
                    </>
                  )}
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

                {/* Action Buttons */}
                {!task.completed && (
                  <div className="mt-4 flex flex-col gap-2">
                    {/* Magic Scan Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowScanner(true);
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md hover:shadow-cyan-500/25 group/scan"
                    >
                      <ScanLine className="w-4 h-4 mr-2 group-hover/scan:animate-pulse" />
                      書類をスキャンして自動入力
                      <Sparkles className="w-3.5 h-3.5 ml-2 text-yellow-300 animate-pulse" />
                    </Button>

                    {/* Myna Portal Button (for Gov tasks) */}
                    {isGovernmentTask && (
                      <Button
                        onClick={handleOneTapApply}
                        disabled={isSubmitting}
                        className={cn(
                          "w-full text-white shadow-md transition-all group/myna",
                          mynaConnected
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
                            : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/25"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                            申請データを送信中...
                          </>
                        ) : mynaConnected ? (
                          <>
                            <Send className="w-4 h-4 mr-2 group-hover/myna:translate-x-1 transition-transform" />
                            マイナポータルで電子申請（ワンタップ）
                          </>
                        ) : (
                          <>
                            <span className="mr-2 text-lg">🐰</span>
                            マイナポータルと連携して申請
                          </>
                        )}
                      </Button>
                    )}

                    {/* Print Button (for Paper tasks) */}
                    {isPaperTask && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPrintModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-500/25 group/print"
                      >
                        <Printer className="w-4 h-4 mr-2 group-hover/print:scale-110 transition-transform" />
                        申請書を自動作成・コンビニ印刷
                      </Button>
                    )}
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

      <DocumentScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanComplete={handleScanComplete}
      />

      {/* MynaPortalConnect removed from here */}

      <KonbiniPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        taskTitle={task.title}
      />
    </>
  );
}
