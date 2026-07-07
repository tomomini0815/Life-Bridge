import React from 'react';
import { RoadmapStepComponent } from './RoadmapStep';
import { roadmapData } from './RoadmapData';

// We use Lucide icons as stand-ins for the cute illustrations.
// In a real app, these would be custom SVG artwork matching the flyer.

export const RoadmapTimeline: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 relative font-[sans-serif]">
      {/* Central dashed line (path) for desktop */}
      <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0 border-l-[6px] border-dashed border-orange-300/70 -translate-x-1/2 z-0 relative after:content-[''] after:absolute after:inset-y-0 after:-left-[3px] after:w-1 after:bg-gradient-to-b after:from-orange-400/0 after:via-orange-400/20 after:to-orange-400/0"></div>

      <div className="flex flex-col items-center gap-10 relative z-10 w-full pt-8">
        {roadmapData.map((event, index) => (
          <RoadmapStepComponent key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
};
