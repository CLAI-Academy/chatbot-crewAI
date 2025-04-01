
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
    <div className="chat-input-container bg-chat-darker">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button 
          type="button" 
          className="p-2 mr-2 rounded-full hover:bg-chat-tag transition-colors"
        >
          <Paperclip size={20} className="text-gray-400" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="w-full rounded-full py-3 px-4 bg-chat-tag text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chat-accent"
          />
        </div>
        
        <button 
          type="button" 
          className="p-2 mx-2 rounded-full hover:bg-chat-tag transition-colors"
        >
          <Mic size={20} className="text-gray-400" />
        </button>
        
        <button 
          type="submit" 
          className="p-2 rounded-full bg-chat-accent hover:bg-opacity-80 transition-colors"
          disabled={!message.trim()}
        >
          <Send size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
