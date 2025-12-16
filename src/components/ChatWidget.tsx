import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'こんにちは！LifeBridge AIアシスタントです。手続きでお困りのことはありますか？',
    isBot: true,
    timestamp: new Date(),
  },
];

const quickReplies = [
  '期限が近い手続きは？',
  'もらえる給付金を教えて',
  '書類の準備方法',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        '期限が近い手続きは？': '現在、期限が近い手続きは以下の通りです：\n\n1. 出生届（14日以内）⏰\n2. 児童手当申請（15日以内）\n3. 健康保険の扶養追加（5日以内）\n\nまずは出生届から始めましょう！必要書類の準備をお手伝いしますか？',
        'もらえる給付金を教えて': '現在申請可能な給付金は以下の通りです：\n\n💰 出産育児一時金：50万円\n💰 児童手当：月1.5万円\n💰 育児休業給付金：約67万円\n\n合計で約120万円以上もらえる可能性があります！詳しい申請方法をご案内しましょうか？',
        '書類の準備方法': '書類の準備方法をお伝えします：\n\n📋 母子健康手帳 → 妊娠届出時に受け取り済み\n📋 出生証明書 → 病院で発行\n📋 届出人の本人確認書類 → マイナンバーカードか運転免許証\n\n何か不明な点はありますか？',
      };

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponses[input] || 'ご質問ありがとうございます。具体的な手続きについてお答えしますね。どのような手続きについてお知りになりたいですか？',
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    setTimeout(() => {
      const event = { target: { value: reply } };
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full",
          "gradient-warm shadow-glow text-primary-foreground",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "z-50",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[500px]",
          "bg-card rounded-2xl shadow-card border border-border/50",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 z-50",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="gradient-warm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">AIアシスタント</h3>
              <p className="text-xs text-primary-foreground/80">オンライン</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isBot ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.isBot
                    ? "bg-secondary text-secondary-foreground rounded-tl-sm"
                    : "gradient-warm text-primary-foreground rounded-tr-sm"
                )}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 rounded-full bg-secondary text-secondary-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              size="icon"
              variant="gradient"
              onClick={handleSend}
              className="rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
