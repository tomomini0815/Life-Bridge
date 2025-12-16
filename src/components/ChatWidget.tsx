import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AiConciergeService, AiMessage, UserContext } from '@/services/AiConciergeService';
import { GeminiService } from '@/services/GeminiService';

interface ChatWidgetProps {
  currentContext?: UserContext;
}

export function ChatWidget({ currentContext = 'general' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'こんにちは！LifeBridgeコンシェルジュです。お手伝いできることはありますか？',
      timestamp: new Date(),
      actions: ['引越しの手続き', '出産・育児', 'その他'],
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isEmpathyMode, setIsEmpathyMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive Messaging Trigger
  useEffect(() => {
    // Reset conversation when context changes significantly (optional), 
    // for now we just try to trigger a suggestion if the user switches context
    const suggestion = AiConciergeService.getProactiveSuggestion(currentContext);
    if (suggestion) {
      // Small delay to simulate "noticing"
      const timer = setTimeout(() => {
        setMessages(prev => {
          // Avoid duplicate triggers
          if (prev.some(m => m.id === suggestion.id)) return prev;
          return [...prev, suggestion];
        });
        if (!isOpen) {
          setHasUnread(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentContext, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let responseContent = '';
      const mode = isEmpathyMode ? 'empathy' : 'normal';

      // Hybrid Logic: Try Gemini (Smart) -> Fallback to Concierge (Rule)
      if (GeminiService.isEnabled()) {
        try {
          responseContent = await GeminiService.sendMessage(
            userMsg.content,
            messages, // send history excluding current msg (handled in service) or including? Service handles it.
            currentContext,
            mode
          );
        } catch (err) {
          console.warn("Gemini Failed, falling back", err);
          // Fallback content handled below if empty
        }
      }

      if (responseContent) {
        const geminiMsg: AiMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          // Gemini currently doesn't return structured actions, we can infer keywords or keep empty
          actions: []
        };
        setMessages(prev => [...prev, geminiMsg]);
      } else {
        // Fallback to Rule-Based
        const response = await AiConciergeService.processMessage(
          userMsg.content,
          currentContext,
          mode,
          [...messages, userMsg]
        );
        setMessages(prev => [...prev, response]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '申し訳ありません。エラーが発生しました。',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string) => {
    // Treat action click as user sending that text
    setInput(action);
    // Hack to trigger send immediately after state update would require effect, 
    // but for simplicity we just call logic directly or use timeout
    setTimeout(() => {
      // We can't reuse handleSend easily because valid input state is needed
      // Simpler to just process directly
      const userMsg: AiMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: action,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      // Async wrapper
      (async () => {
        try {
          let responseContent = '';
          const mode = isEmpathyMode ? 'empathy' : 'normal';

          if (GeminiService.isEnabled()) {
            try {
              responseContent = await GeminiService.sendMessage(action, messages, currentContext, mode);
            } catch (e) { console.warn("Gemini Action Failed", e); }
          }

          if (responseContent) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: responseContent,
              timestamp: new Date(),
              actions: []
            }]);
          } else {
            const res = await AiConciergeService.processMessage(
              action,
              currentContext,
              mode,
              [...messages, userMsg]
            );
            setMessages(prev => [...prev, res]);
          }
        } catch (e) { console.error(e); }
        finally { setIsTyping(false); }
      })();
    }, 0);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        {hasUnread && !isOpen && (
          <div className="absolute -top-2 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Proactive Bubble (if closed and has suggestion) */}
        {!isOpen && hasUnread && (
          <div
            className="absolute bottom-16 right-0 w-64 p-3 bg-white dark:bg-zinc-900 rounded-2xl rounded-tr-sm shadow-xl border border-border/50 animate-slide-up cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => { setIsOpen(true); setHasUnread(false); }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-foreground mb-1">AIコンシェルジュ</p>
                <p className="text-muted-foreground line-clamp-2">
                  新しい提案があります。タップして確認してください。
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
          className={cn(
            "w-14 h-14 rounded-full",
            "bg-gradient-to-tr from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/30 text-white",
            "flex items-center justify-center relative overflow-hidden group",
            "transition-all duration-300 hover:scale-110",
            isOpen && "rotate-90 scale-0 opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]",
          "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md rounded-3xl shadow-2xl border border-border/50",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) z-50 origin-bottom-right",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className={cn(
          "p-4 flex items-center justify-between shadow-md relative z-10 transition-colors duration-500",
          isEmpathyMode
            ? "bg-gradient-to-r from-rose-400 via-orange-300 to-rose-400"
            : "bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"
        )}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                {isEmpathyMode ? <Sparkles className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-white" />}
              </div>
              <div className={cn("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white", isEmpathyMode ? "bg-pink-400" : "bg-green-400")} />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-base leading-tight">AIコンシェルジュ</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] opacity-90 font-medium tracking-wide">
                  {isEmpathyMode ? '寄り添いモード ON' : '通常モード'}
                </span>
                <div
                  onClick={() => setIsEmpathyMode(!isEmpathyMode)}
                  className="w-8 h-4 bg-black/20 rounded-full relative cursor-pointer hover:bg-black/30 transition-colors"
                >
                  <div className={cn(
                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
                    isEmpathyMode ? "left-4.5" : "left-0.5"
                  )} />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 dark:bg-black/20 scroll-smooth">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                message.role === 'assistant' ? "self-start" : "self-end items-end"
              )}
            >
              {/* Avatar for Bot */}
              {message.role === 'assistant' && (
                <span className="text-[10px] text-muted-foreground ml-1">AI Assistant</span>
              )}

              <div
                className={cn(
                  "px-4 py-3 shadow-sm relative text-sm leading-relaxed",
                  message.role === 'assistant'
                    ? "bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-sm border border-border/50 text-foreground"
                    : cn(
                      "text-white rounded-2xl rounded-tr-sm transition-colors duration-500",
                      isEmpathyMode
                        ? "bg-gradient-to-br from-rose-400 to-orange-300"
                        : "bg-gradient-to-br from-teal-500 to-emerald-600"
                    )
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>

              {/* Suggested Actions (Bot only) */}
              {message.role === 'assistant' && message.actions && message.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1 ml-1">
                  {message.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 font-medium",
                        isEmpathyMode
                          ? "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100"
                          : "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100"
                      )}
                    >
                      {action}
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <span className="text-[10px] text-muted-foreground/60 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex self-start max-w-[85%] items-end gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isEmpathyMode ? "bg-rose-100" : "bg-teal-100"
              )}>
                {isEmpathyMode
                  ? <Sparkles className="w-4 h-4 text-rose-400" />
                  : <Bot className="w-4 h-4 text-teal-500" />
                }
              </div>
              <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-border/50 shadow-sm">
                <div className="flex gap-1.5 h-4 items-center">
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]", isEmpathyMode ? "bg-rose-400" : "bg-teal-400")} />
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]", isEmpathyMode ? "bg-orange-400" : "bg-emerald-400")} />
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-bounce", isEmpathyMode ? "bg-rose-400" : "bg-teal-400")} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-border/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-shadow"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={cn(
                "h-11 w-11 rounded-xl hover:opacity-90 transition-all shadow-md",
                isEmpathyMode
                  ? "bg-gradient-to-r from-rose-400 to-orange-300 shadow-rose-500/20"
                  : "bg-gradient-to-r from-teal-500 to-emerald-600 shadow-teal-500/20"
              )}
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

