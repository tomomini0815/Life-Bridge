import { lifeEvents } from '@/data/lifeEvents';
import { LandingPageTest } from '@/components/LandingPageTest';
import { ChatWidget } from '@/components/ChatWidget';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserContext } from '@/services/AiConciergeService';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [chatContext, setChatContext] = useState<UserContext>('general');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        // WebGLシェーダーや画像などのアセット読み込みラグをカバーするため、
        // わずかに遅らせてからフェードインでLPを表示します
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [user, loading, navigate]);

  if (loading || user || !showContent) {
    return <LoadingScreen />;
  }

  const handleSelectEvent = (event: any) => {
    if (event?.id) {
      setChatContext(event.id as UserContext);
      setIsChatOpen(true);
    }
  };

  const handleOpenChat = () => {
    setChatContext('general');
    setIsChatOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <LandingPageTest 
        events={lifeEvents} 
        onSelectEvent={handleSelectEvent} 
        onOpenChat={handleOpenChat}
      />
      <ChatWidget 
        currentContext={chatContext} 
        externalIsOpen={isChatOpen}
      />
    </div>
  );
};

export default Index;
