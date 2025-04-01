
import React, { useState } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-chat-darker to-chat-dark/90 border-t border-chat-tag/20">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-chat-tag/50 transition-colors duration-300"
        >
          <Paperclip size={20} className="text-gray-400" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="w-full rounded-full py-3 px-4 bg-chat-tag/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chat-accent/50 transition-all duration-300"
          />
        </div>
        
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-chat-tag/50 transition-colors duration-300"
        >
          <Mic size={20} className="text-gray-400" />
        </button>
        
        <button 
          type="submit" 
          className={`p-3 rounded-full ${message.trim() ? 'bg-chat-accent hover:bg-opacity-80' : 'bg-chat-tag/50 cursor-not-allowed'} transition-colors duration-300`}
          disabled={!message.trim()}
        >
          <Send size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
