
import React from 'react';
import Logo from './Logo';
import { Maximize2 } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-chat-darker to-chat-dark/90 border-b border-chat-tag/20">
      <Logo />
      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-chat-tag hover:bg-chat-accent transition-colors duration-300">
        <Maximize2 size={16} className="text-white" />
      </button>
    </header>
  );
};

export default ChatHeader;
