import React, { useState } from 'react';

const Toast = ({ message, onClose, bgcolor }) => {
  // Automatically close the toast after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call onClose function after 3 seconds
    }, 3000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 right-5 ${bgcolor} text-white py-2 px-4 rounded-lg shadow-lg flex items-center space-x-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-xl font-semibold">&times;</button>
    </div>
  );
};

export default Toast;
