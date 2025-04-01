
import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import SuggestionTags from './SuggestionTags';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const suggestionTags = [
    "Futuro", "Futurista", "Tecnología", "IA", "Innovación"
  ];
  
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: `Gracias por tu mensaje "${content}". Estoy procesando tu solicitud.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleTagClick = (tag: string) => {
    handleSendMessage(`Cuéntame sobre ${tag}`);
  };
  
  return (
    <div className="flex flex-col h-screen bg-chat-dark">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {showWelcome ? (
          <>
            <WelcomeMessage username="Tommy Radison" />
            <SuggestionTags tags={suggestionTags} onTagClick={handleTagClick} />
          </>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
