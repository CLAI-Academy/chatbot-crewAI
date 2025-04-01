
import React from 'react';
import Logo from './Logo';
import { Maximize2 } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-chat-darker">
      <Logo />
      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-chat-tag hover:bg-chat-accent transition-colors">
        <Maximize2 size={16} className="text-white" />
      </button>
    </header>
  );
};

export default ChatHeader;
