import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronRight, Minus, Heart, Baby, Briefcase, Rocket, Truck, HandHeart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AiConciergeService, AiMessage, UserContext } from '@/services/AiConciergeService';
import { GeminiService } from '@/services/GeminiService';
import { chatService } from '@/services/ChatService';
import { useAuth } from '@/contexts/AuthContext';


interface ChatWidgetProps {
  currentContext?: UserContext;
  onSelectEvent?: (eventId: string | null) => void;
}

export function ChatWidget({ currentContext = 'general', onSelectEvent }: ChatWidgetProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'こんにちは！LifeBridgeコンシェルジュです。\nどのようなライフイベントについてお手伝いしましょうか？',
      timestamp: new Date(),
      actions: ['💒 結婚', '👶 出産', '💼 転職', '🏠 引越し', '🤝 介護', 'その他'],
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isEmpathyMode, setIsEmpathyMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      if (input) {
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
      }
    }
  }, [input]);

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

  // Reset chat when context changes
  useEffect(() => {
    const greetingText = AiConciergeService.getGreetingMessage(currentContext);

    // Determine default actions based on context
    // Determine default actions based on context
    let actions = ['使い方を見る', '質問する'];
    if (['marriage', 'birth', 'baby', 'moving', 'startup', 'care', 'retirement'].includes(currentContext)) {
      actions = ['手続きの流れ', '必要書類', '給付金について'];
    } else if (currentContext === 'subscription') {
      actions = ['支払い予定', '解約について', '見直し提案'];
    } else if (currentContext === 'simulator') {
      actions = ['給付金を探す', 'シミュレーション開始'];
    } else if (currentContext === 'memo') {
      actions = ['メモの書き方', '整理のコツ'];
    }

    // If user is logged in, load history, otherwise show greeting
    if (user) {
      chatService.setUser(user.id);
      chatService.loadMessages().then(history => {
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([{
            id: `init-${Date.now()}`,
            role: 'assistant',
            content: greetingText,
            timestamp: new Date(),
            actions: actions,
          }]);
        }
      });
    } else {
      setMessages([{
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: greetingText,
        timestamp: new Date(),
        actions: actions,
      }]);
    }

    // Optional: Don't force open, but maybe show indicator if needed
    // setHasUnread(true); // Maybe too intrusive
  }, [currentContext, user]);

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

      // Try Gemini first if enabled
      if (GeminiService.isEnabled()) {
        try {
          responseContent = await GeminiService.sendMessage(
            userMsg.content,
            messages,
            currentContext,
            mode
          );
        } catch (err: any) {
          const errorMsg = err?.message || '';
          console.warn("Gemini error:", errorMsg);

          // If it's a rate limit or specific error, show it to user
          if (errorMsg.includes('RATE_LIMIT:') || errorMsg.includes('AUTH_ERROR:') ||
            errorMsg.includes('NETWORK_ERROR:') || errorMsg.includes('SAFETY_BLOCK:')) {
            // Extract the user-friendly message after the error code
            const userMessage = errorMsg.split(': ')[1] || errorMsg;
            throw new Error(userMessage);
          }

          // Otherwise, use fallback
          responseContent = '';
        }
      }

      // Use Gemini response or fallback to rule-based
      if (responseContent) {
        const geminiMsg: AiMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          actions: []
        };
        setMessages(prev => [...prev, geminiMsg]);
        if (user) chatService.saveMessage(geminiMsg);
      } else {
        // Fallback to Rule-Based AI Concierge
        const response = await AiConciergeService.processMessage(
          userMsg.content,
          currentContext,
          mode,
          [...messages, userMsg]
        );
        setMessages(prev => [...prev, response]);
        if (user) chatService.saveMessage(response);
      }
    } catch (e: any) {
      console.error('Chat error:', e);
      const errorMessage = e?.message || '';

      // Show specific error message or generic fallback
      const fallbackMsg: AiMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMessage || 'ご質問ありがとうございます。具体的にどのようなことをお知りになりたいですか？',
        timestamp: new Date(),
        actions: errorMessage.includes('制限') ? [] : ['手続きの流れ', '必要書類', '期限について', '給付金について']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string) => {
    const userMsg: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    (async () => {
      try {
        let responseContent = '';
        const mode = isEmpathyMode ? 'empathy' : 'normal';

        if (GeminiService.isEnabled()) {
          try {
            responseContent = await GeminiService.sendMessage(action, messages, currentContext, mode);
          } catch (err: any) {
            const errorMsg = err?.message || '';
            console.warn("Gemini error for action:", errorMsg);

            // If it's a specific error, show it to user
            if (errorMsg.includes('RATE_LIMIT:') || errorMsg.includes('AUTH_ERROR:') ||
              errorMsg.includes('NETWORK_ERROR:') || errorMsg.includes('SAFETY_BLOCK:')) {
              const userMessage = errorMsg.split(': ')[1] || errorMsg;
              throw new Error(userMessage);
            }

            responseContent = '';
          }
        }

        if (responseContent) {
          const aiMsg: AiMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: responseContent,
            timestamp: new Date(),
            actions: []
          };
          setMessages(prev => [...prev, aiMsg]);
          if (user) chatService.saveMessage(aiMsg);
        } else {
          const res = await AiConciergeService.processMessage(
            action,
            currentContext,
            mode,
            [...messages, userMsg]
          );
          setMessages(prev => [...prev, res]);
          if (user) chatService.saveMessage(res);
        }
      } catch (e: any) {
        console.error('Action error:', e);
        const errorMessage = e?.message || '';
        const fallbackMsg: AiMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: errorMessage || `${action}についてですね。具体的にどのようなことをお知りになりたいですか？`,
          timestamp: new Date(),
          actions: errorMessage.includes('制限') ? [] : ['手続きの流れ', '必要書類', '期限について']
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
      finally { setIsTyping(false); }
    })();
  };

  return (
    <>
      {/* Chat button */}
      <div className={cn(
        "fixed z-50 transition-all duration-300",
        isMinimized ? "bottom-6 right-4 md:right-6" : "bottom-6 right-4 md:right-6"
      )}>
        {hasUnread && !isOpen && !isMinimized && (
          <div className="absolute -top-2 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Proactive Bubble (if closed and has suggestion, and not minimized) */}
        {!isOpen && hasUnread && !isMinimized && (
          <div
            className="hidden md:block absolute bottom-16 right-0 w-64 p-3 bg-white dark:bg-zinc-900 rounded-2xl rounded-tr-sm shadow-xl border border-border/50 animate-slide-up cursor-pointer hover:bg-muted/50 transition-colors"
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

        <div className="relative">
          {!isMinimized && !isOpen && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              size="icon"
              className="absolute -top-1 -left-1 z-50 h-6 w-6 rounded-full bg-slate-500 hover:bg-slate-600 text-white shadow-md border border-white"
            >
              <Minus className="w-3 h-3" />
            </Button>
          )}

          <button
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                setIsOpen(true);
              } else {
                setIsOpen(!isOpen);
              }
              setHasUnread(false);
            }}
            className={cn(
              "rounded-full",
              "bg-gradient-to-tr from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/30 text-white",
              "flex items-center justify-center relative overflow-hidden group",
              "transition-all duration-300 hover:scale-110",
              isOpen && "rotate-90 scale-0 opacity-0",
              isMinimized ? "w-10 h-10" : "w-14 h-14"
            )}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <MessageCircle className={cn("transition-all", isMinimized ? "w-5 h-5" : "w-7 h-7")} />
          </button>
        </div>
      </div>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 md:w-[380px] h-[600px] max-h-[80vh]",
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
                  "px-4 py-3 shadow-sm relative text-sm leading-relaxed group/message",
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
                <div className="whitespace-pre-line text-xs leading-relaxed">
                  {message.role === 'assistant' ? (
                    <div>
                      {message.content.split('\n').map((line, i) => {
                        // Check for list items (supports -, *, 1., and [ ])
                        const isList = /^[ \t]*([-*]|\d+\.|\[[ x]?\])[ \t]+/.test(line);

                        if (isList) {
                          // Extract content after the marker
                          const content = line.replace(/^[ \t]*([-*]|\d+\.|\[[ x]?\])[ \t]+/, '');
                          // Check if it was already marked as completed in markdown
                          const isChecked = /^[ \t]*\[x\]/.test(line);
                          const itemId = `msg-${message.id}-item-${i}`;

                          return (
                            <div key={i} className="flex items-start gap-2 my-1.5 group/item">
                              <div className="mt-0.5 shrink-0">
                                <Checkbox
                                  id={itemId}
                                  defaultChecked={isChecked}
                                  className="border-slate-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                                />
                              </div>
                              <label
                                htmlFor={itemId}
                                className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-text"
                              >
                                {content}
                              </label>
                            </div>
                          );
                        }
                        return <div key={i}>{line || <br />}</div>;
                      })}
                    </div>
                  ) : (
                    message.content
                  )}
                </div>

                {/* Action buttons for AI messages */}
                {message.role === 'assistant' && (
                  <div className="flex gap-1 mt-2 pt-2 border-t border-border/30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(message.content);
                        import('sonner').then(({ toast }) => {
                          toast.success('コピーしました', {
                            description: 'メッセージをクリップボードにコピーしました',
                          });
                        });
                      }}
                      className="text-xs px-2 py-1 rounded-md hover:bg-muted transition-colors flex items-center gap-1"
                      title="コピー"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      コピー
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Import memoService dynamically to avoid circular deps
                        import('@/services/MemoService').then(({ memoService }) => {
                          memoService.createMemoFromChat(message.content);
                          import('sonner').then(({ toast }) => {
                            toast.success('メモに保存しました', {
                              description: 'メモ帳から確認できます',
                            });
                          });
                        });
                      }}
                      className="text-xs px-2 py-1 rounded-md hover:bg-muted transition-colors flex items-center gap-1"
                      title="メモに保存"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      メモ保存
                    </button>
                  </div>
                )}
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

        {/* Persistent Event Menu */}
        <div className="px-4 py-2 bg-slate-50/50 dark:bg-zinc-900 border-t border-border/50 overflow-x-auto whitespace-nowrap scrollbar-hide z-10 relative">
          <div className="flex gap-2 pb-1">
            {[
              { id: 'marriage', label: '結婚', icon: Heart, color: 'text-pink-500 bg-pink-50 border-pink-100' },
              { id: 'birth', label: '出産', icon: Baby, color: 'text-orange-500 bg-orange-50 border-orange-100' },
              { id: 'job', label: '転職', icon: Briefcase, color: 'text-sky-500 bg-sky-50 border-sky-100' },
              { id: 'startup', label: '起業', icon: Rocket, color: 'text-purple-500 bg-purple-50 border-purple-100' },
              { id: 'moving', label: '引越し', icon: Truck, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
              { id: 'care', label: '介護', icon: HandHeart, color: 'text-violet-500 bg-violet-50 border-violet-100' },
            ].map((event) => (
              <button
                key={event.id}
                onClick={() => onSelectEvent?.(event.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 active:scale-95",
                  event.color,
                  currentContext === event.id && "ring-2 ring-offset-1 ring-primary"
                )}
              >
                <event.icon className="w-3.5 h-3.5" />
                {event.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-border/50 pt-2">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="メッセージを入力..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-foreground placeholder:text-muted-foreground text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-shadow resize-none overflow-y-auto min-h-[44px]"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={cn(
                "h-11 w-11 shrink-0 rounded-xl hover:opacity-90 transition-all shadow-md",
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

