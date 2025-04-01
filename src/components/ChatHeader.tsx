
import React from 'react';
import Logo from './Logo';
import { Maximize2 } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-chat-darker border-b border-chat-tag/20">
      <Logo size={32} />
      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/40 hover:bg-chat-tag transition-colors duration-300">
        <Maximize2 size={16} className="text-white/70" />
      </button>
    </header>
  );
};

export default ChatHeader;
