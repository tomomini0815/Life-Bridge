import { lifeEvents } from '@/data/lifeEvents';
import { LandingPageTest } from '@/components/LandingPageTest';
import { ChatWidget } from '@/components/ChatWidget';
import { useState } from 'react';
import { UserContext } from '@/services/AiConciergeService';

const TestLanding = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatContext, setChatContext] = useState<UserContext>('general');

    const handleSelectEvent = (event: any) => {
        // Map event ID to chat context
        const contextMap: Record<string, UserContext> = {
            'marriage': 'marriage',
            'birth': 'birth',
            'moving': 'moving',
            'job': 'job',
            'startup': 'startup',
            'care': 'care'
        };

        const context = contextMap[event.id] || 'general';
        setChatContext(context);
        setIsChatOpen(true);
    };

    return (
        <>
            <LandingPageTest events={lifeEvents} onSelectEvent={handleSelectEvent} />
            <ChatWidget externalIsOpen={isChatOpen} currentContext={chatContext} />
        </>
    );
};

export default TestLanding;
