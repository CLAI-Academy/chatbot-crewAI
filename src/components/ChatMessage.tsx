
import React from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import ReactMarkdown from 'react-markdown';

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
        <div className="mr-3 flex-shrink-0 mt-1">
          <Logo size={30} />
        </div>
      )}
      
      <div className={cn(
        "rounded-xl p-4 max-w-[80%]",
        isAi 
          ? "text-white" // Sin fondo para mensajes del bot
          : "bg-chat-accent/90 text-white border border-chat-accent/50 shadow-md backdrop-blur-sm"
      )}>
        {isAi ? (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none">
            <ReactMarkdown components={{
              // Custom rendering for tables to ensure they display properly
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className="border-collapse w-full" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-gray-800/50" {...props} />
              ),
              tbody: ({ node, ...props }) => (
                <tbody className="divide-y divide-gray-700/30" {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="border-b border-gray-700/30" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-2 whitespace-normal break-words" {...props} />
              )
            }}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
        )}
        <div className="text-xs text-gray-400 mt-2 text-right">
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
