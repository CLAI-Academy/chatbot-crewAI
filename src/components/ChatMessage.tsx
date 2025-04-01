
import React from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const ChatMessage: React.FC<{ message: MessageType }> = ({ message }) => {
  const isAi = message.sender === 'ai';
  
  return (
    <div className={cn(
      "flex my-4 animate-fade-in",
      isAi ? "justify-start" : "justify-end"
    )}>
      {isAi && (
        <div className="mr-3 flex-shrink-0">
          <Logo size={30} />
        </div>
      )}
      
      <div className={cn(
        "rounded-lg p-3 max-w-[80%] shadow-md",
        isAi ? "bg-chat-tag/80 text-white" : "bg-chat-accent/90 text-white"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="text-xs text-gray-400 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
