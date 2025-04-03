
import React, { useState } from 'react';
import { Send, Paperclip, Plus, Globe, Search } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  centered?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false, 
  centered = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className={`p-4 ${centered ? 'bg-transparent' : 'bg-chat-darker border-t border-gray-800/50'} transition-all duration-300`}>
      <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${centered ? 'rounded-full bg-gray-800/30 p-1.5 shadow-xl' : ''}`}>
        <button 
          type="button" 
          className={`p-2 rounded-full hover:bg-gray-700 transition-colors duration-300 ${centered ? 'bg-gray-800/50' : ''}`}
          disabled={isLoading}
        >
          <Plus size={20} className="text-gray-400" />
        </button>
        
        <div className="flex-1 relative flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isLoading ? "Esperando respuesta..." : "Pregunta lo que quieras"}
            className={`w-full py-3 px-4 ${centered ? 'bg-transparent' : 'bg-gray-800/70 rounded-full'} text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all duration-300`}
            disabled={isLoading}
          />
          
          {centered && (
            <>
              <button 
                type="button" 
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors duration-300"
                disabled={isLoading}
              >
                <Globe size={20} className="text-gray-400" />
                <span className="sr-only">Buscar</span>
              </button>
              
              <button 
                type="button" 
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors duration-300"
                disabled={isLoading}
              >
                <Search size={20} className="text-gray-400" />
                <span className="ml-2 text-gray-400 hidden md:inline">Investigación en profundidad</span>
              </button>
            </>
          )}
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
