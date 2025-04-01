
import React from 'react';
import Logo from './Logo';

type WelcomeMessageProps = {
  username?: string;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ username = "Invitado" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center">
      <div className="mb-6">
        <Logo size={64} />
      </div>
      
      <h1 className="text-xl font-medium text-gray-300 mb-2">
        Hi, {username}
      </h1>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        Can I help you with anything?
      </h2>
      
      <p className="text-gray-400 text-center max-w-md mb-8 text-sm">
        Ready to assist you with anything you need?
        From answering questions, generation to providing
        recommendations. Let's get started!
      </p>
    </div>
  );
};

export default WelcomeMessage;
