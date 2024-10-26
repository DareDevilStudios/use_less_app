import React, { useEffect, useState } from 'react';
import Message from './Message';

export default function FriendsCircle({ setstartCri }) {
  const criticisms = [
    "Look at how quickly the project was completed; some are already wrapping up while you're still planning.",
    "It's impressive that others have finished their certifications this month, yet you haven't started yours.",
    "Some teams submitted their reports ahead of schedule, while it seems like you're still stuck on the first draft.",
    "Others organized their events in just a few days, while it feels like you're still waiting for the right moment to begin.",
    "It's amazing how quickly some are learning the new software, while you seem hesitant to give it a try.",
    "Many have launched their apps already, but it looks like you're still contemplating your next steps.",
    "Others have been able to gather their teams for brainstorming sessions, yet it seems like yours keeps getting postponed.",
    "Look at how swiftly some have turned their ideas into prototypes, while you're still refining your concept.",
    "It's great to see so many networking effectively at recent events, while you missed out on the opportunity.",
    "Some have transformed feedback into actionable changes in no time, while you seem to be avoiding it altogether."
  ];

  const [visibleCriticisms, setVisibleCriticisms] = useState([]);

  useEffect(() => {
    if (setstartCri) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < criticisms.length) {
          setVisibleCriticisms((prev) => [...prev, criticisms[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10000); // 3000 ms = 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [setstartCri]);

  return (
    <div className='w-1/2 h-96 overflow-y-auto bg-white'>
      <h1 className='text-black text-center text-xl font-bold p-3 underline'>കണ്ടു പടിക്കടാ!!</h1>
      {visibleCriticisms.map((criticism, i) => (
        <Message key={i} text={criticism} time={new Date().toLocaleTimeString()} isSender={false} />
      ))}
    </div>
  );
}
