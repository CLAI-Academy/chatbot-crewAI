
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
      "flex my-4",
      isAi ? "justify-start" : "justify-end"
    )}>
      {isAi && (
        <div className="mr-3 flex-shrink-0">
          <Logo size={30} />
        </div>
      )}
      
      <div className={cn(
        "rounded-lg p-3 max-w-[80%]",
        isAi ? "bg-chat-tag text-white" : "bg-chat-accent text-white"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
