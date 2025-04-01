
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-chat-darker to-chat-dark p-4">
      <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-chat-tag/30 backdrop-blur-sm">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
