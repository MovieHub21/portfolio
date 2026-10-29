import { useState, useEffect } from 'react';

export interface VisitorContext {
  greeting: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  localTimeFormatted: string;
  timeZoneLabel: string;
  isHighCapability: boolean;
}

export function useVisitorPersonalization(): VisitorContext {
  const [context, setContext] = useState<VisitorContext>(() => {
    return calculateContext();
  });

  useEffect(() => {
    // Update every minute for live clock accuracy
    const timer = setInterval(() => {
      setContext(calculateContext());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return context;
}

function calculateContext(): VisitorContext {
  const now = new Date();
  const hour = now.getHours();

  let greeting = 'Welcome';
  let timeOfDay: VisitorContext['timeOfDay'] = 'afternoon';

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening';
    timeOfDay = 'evening';
  } else {
    greeting = 'Welcome.';
    timeOfDay = 'night';
  }

  // Format time strictly client-side using standard Intl
  let localTimeFormatted = '';
  let timeZoneLabel = '';

  try {
    localTimeFormatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timeZoneLabel = tz ? tz.replace(/_/g, ' ') : 'Local Time';
  } catch {
    localTimeFormatted = `${hour}:${now.getMinutes().toString().padStart(2, '0')}`;
    timeZoneLabel = 'Local Time';
  }

  // Conservative device capability detection (purely local, no tracking)
  const isHighCapability =
    typeof navigator !== 'undefined' &&
    (!navigator.hardwareConcurrency || navigator.hardwareConcurrency >= 4);

  return {
    greeting,
    timeOfDay,
    localTimeFormatted,
    timeZoneLabel,
    isHighCapability,
  };
}
