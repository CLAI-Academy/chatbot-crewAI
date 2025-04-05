import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeMessage from "./WelcomeMessage";
import SuggestionTags from "./SuggestionTags";
import ChatApp from "./ChatApp";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const suggestionTags = ["Future", "Futuristic", "Futures"];

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowWelcome(false);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: `Gracias por tu mensaje "${content}". Estoy procesando tu solicitud.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleTagClick = (tag: string) => {
    handleSendMessage(`Cuéntame sobre ${tag}`);
  };

  return (
    <div className="flex flex-col h-screen rounded-none md:h-[80vh] md:rounded-xl bg-chat-darker shadow-2xl overflow-hidden border border-gray-700/30">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
        <>
          <WelcomeMessage username="Tommy Radison" />
          <SuggestionTags tags={suggestionTags} onTagClick={handleTagClick} />
        </>
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
