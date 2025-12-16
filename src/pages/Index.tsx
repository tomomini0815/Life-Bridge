import { useState } from 'react';
import { LifeEvent } from '@/types/lifeEvent';
import { lifeEvents } from '@/data/lifeEvents';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { ChatWidget } from '@/components/ChatWidget';

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

  const handleSelectEvent = (event: LifeEvent) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      {selectedEvent ? (
        <Dashboard event={selectedEvent} onBack={handleBack} />
      ) : (
        <LandingPage events={lifeEvents} onSelectEvent={handleSelectEvent} />
      )}
      <ChatWidget />
    </>
  );
};

export default Index;
