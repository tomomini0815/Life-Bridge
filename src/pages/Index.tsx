import { lifeEvents } from '@/data/lifeEvents';
import { LandingPage } from '@/components/LandingPage';
import { ChatWidget } from '@/components/ChatWidget';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleSelectEvent = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <LandingPage events={lifeEvents} onSelectEvent={handleSelectEvent} />
      <ChatWidget />
    </>
  );
};

export default Index;
