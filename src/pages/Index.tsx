import { lifeEvents } from '@/data/lifeEvents';
import { LandingPageTest } from '@/components/LandingPageTest';
import { ChatWidget } from '@/components/ChatWidget';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserContext } from '@/services/AiConciergeService';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [chatContext, setChatContext] = useState<UserContext>('general');

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return null; // Prevent flash of LP while redirecting or loading auth
  }

  const handleSelectEvent = (event: any) => {
    // Instead of navigating, we set the chat context to trigger the AI concierge
    if (event?.id) {
      setChatContext(event.id as UserContext);
    }
  };

  return (
    <>
      <LandingPageTest events={lifeEvents} onSelectEvent={handleSelectEvent} />
      <ChatWidget currentContext={chatContext} />
    </>
  );
};

export default Index;
