
import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  centered?: boolean;
  // Eliminamos onTypingStart de las props
};

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false, 
  centered = false
  // Eliminamos onTypingStart de los parámetros
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Eliminamos la llamada a onTypingStart
  };

  return (
    <div className={`p-4 ${centered ? 'bg-transparent' : 'bg-chat-darker border-t border-gray-800/30'} transition-all duration-500`}>
      <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${centered ? 'rounded-full bg-gray-800/30 p-1.5 shadow-xl backdrop-blur-sm border border-gray-700/30' : ''}`}>
        <button 
          type="button" 
          className={`p-2 rounded-full hover:bg-gray-700 transition-colors duration-300 ${centered ? 'bg-gray-800/50' : ''}`}
          disabled={isLoading}
        >
          <Plus size={20} className="text-gray-400" />
        </button>
        
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder={isLoading ? "Esperando respuesta..." : "Pregunta lo que quieras"}
            className={`w-full py-3 px-4 ${centered ? 'bg-transparent' : 'bg-gray-800/50 rounded-full border border-gray-700/20'} text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-chat-accent/50 transition-all duration-300`}
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className={`p-3 rounded-full ${message.trim() && !isLoading ? 'bg-chat-accent hover:bg-chat-accent/80 shadow-md' : 'bg-gray-800 cursor-not-allowed'} transition-colors duration-300`}
          disabled={!message.trim() || isLoading}
        >
          <Send size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
