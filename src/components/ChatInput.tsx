
import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-chat-darker border-t border-gray-800/50">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
          disabled={isLoading}
        >
          <Paperclip size={20} className="text-gray-400" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isLoading ? "Esperando respuesta..." : "Hello, create an image of a f|"}
            className="w-full rounded-full py-3 px-4 bg-gray-800/70 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all duration-300"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className={`p-3 rounded-full ${message.trim() && !isLoading ? 'bg-chat-accent hover:bg-opacity-80' : 'bg-gray-800 cursor-not-allowed'} transition-colors duration-300`}
          disabled={!message.trim() || isLoading}
        >
          <Send size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
