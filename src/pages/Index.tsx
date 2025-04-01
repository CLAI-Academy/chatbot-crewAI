
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-chat-darker">
      <div className="w-full max-w-4xl">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
