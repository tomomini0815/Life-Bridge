import { lifeEvents } from '@/data/lifeEvents';
import { LandingPageTest } from '@/components/LandingPageTest';
import { ChatWidget } from '@/components/ChatWidget';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSelectEvent = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <LandingPageTest events={lifeEvents} onSelectEvent={handleSelectEvent} />
      <ChatWidget />
    </>
  );
};

export default Index;
