import React from 'react';

const Message = ({ sender, text, time, isSender }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2 px-5`}>
      {!isSender && (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvx4LXoMCG4RR9wxwr-p4ludnsC3C6BoSHa9dnU7KRwntGPNz669eCBhMCYC6SZGWD9Mc&usqp=CAU" // Placeholder for sender's profile picture
          alt="Profile"
          className="rounded-full mr-2 w-12"
        />
      )}
      <div
        className={`max-w-xl p-2 rounded-lg ${
          isSender ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
        }`}
      >
        <p>{text}</p>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      {isSender && (
        <img
          src="https://via.placeholder.com/40" // Placeholder for sender's profile picture
          alt="Profile"
          className="rounded-full ml-2"
        />
      )}
    </div>
  );
};

export default Message;
