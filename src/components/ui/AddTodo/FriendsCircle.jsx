import React, { useEffect, useState } from 'react';
import Message from './Message';

export default function FriendsCircle({ setstartCri, Tasks }) {
  const criticisms = [
    "ഡാ ഡാ നീ ആ അപ്പുറത്തെ ചെക്കനെ കണ്ട് പടിക്ക്",
    "ബാക്കി ഉള്ളവരൊക്കെ എല്ലാം തീർത്തു നീയിങ്ങനെ നടന്നോ ",
    "അവൻ നാളത്തെ പണി ഇന്ന് തന്നെ തുടങ്ങി ",
    "അവനെ പോലെ കഷ്ടപ്പെട്ടു ജീവിക്ക് നാലു കാശ് കയ്യിൽ നില്കും",
    "എന്നാ പിന്നെ എല്ലാം പറഞ്ഞ പോലെ ",
  ];

  const [visibleCriticisms, setVisibleCriticisms] = useState(["എന്താ മാഷെ വല്ലതും നടക്കുമോ ഇന്ന്?"]);
  const [anyTaskIncomplete, setAnyTaskIncomplete] = useState(false);

  useEffect(() => {
    // Check if any task has a status of false
    const hasIncompleteTask = Tasks.some(task => task.status === false);
    setAnyTaskIncomplete(hasIncompleteTask);
  }, [Tasks]);

  useEffect(() => {
    if (setstartCri && anyTaskIncomplete) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < criticisms.length) {
          setVisibleCriticisms((prev) => [...prev, criticisms[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10000); // 10000 ms = 10 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [setstartCri, anyTaskIncomplete]);

  return (
    <div className='md:w-1/2 w-full h-96 overflow-y-auto bg-white'>
      <h1 className='text-black text-center text-xl font-bold p-3 underline'>{anyTaskIncomplete ? "കണ്ടു പടിക്കടാ!!" : "നീ കൊള്ളാല്ലോടാ!"}</h1>
      {
        Tasks.length > 0 ? (
          <>
      {anyTaskIncomplete ? (
        visibleCriticisms.map((criticism, i) => (
          <Message key={i} text={criticism} isSender={false} />
        ))
      ) : (
        <Message text="എല്ലാ ദിവസോം ഇതുപോലെ ഒക്കെ തന്നെ ആയാൽ മതിയായിരുന്നു!" isSender={false} />
      )}
      </>
        ):(
          <Message text="വെറുതെ ഇരിക്കാണ്ട് വല്ലതും ചെയ്യടാ!!" isSender={false} />
        )
      }
    </div>
  );
}
