
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import SuggestionTags from './SuggestionTags';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inputCentered, setInputCentered] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const suggestionTags = [
    "Future", "Futuristic", "Futures"
  ];
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Nueva función para llamar a la API de localhost
  const fetchResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      
      console.log("Enviando mensaje a la API local:", userMessage);
      
      const response = await fetch('http://localhost:8000/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage
        })
      });
      
      if (!response.ok) {
        console.error('Error de respuesta:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Detalles del error:', errorText);
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Respuesta recibida:", data);
      
      // Verificar que la respuesta tenga el formato correcto
      if (!data || typeof data.response !== 'string') {
        console.error('Formato de respuesta inválido:', data);
        throw new Error('Formato de respuesta inválido');
      }
      
      // Crear el mensaje de respuesta
      const aiMessage: MessageType = {
        id: Date.now().toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      // Añadir el mensaje a la conversación de forma segura
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      
      // Añadir mensaje de error
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      
      toast({
        title: "Error",
        description: "Error al conectar con la API. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  

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
    setInputCentered(false);
    
    // Usar la API de localhost en lugar de OpenAI
    fetchResponse(content);
  };
  
  const handleTypingStart = () => {
    setInputCentered(false);
  };
  
  const handleTagClick = (tag: string) => {
    handleSendMessage(`Cuéntame sobre ${tag}`);
  };
  
  return (
    <div className="flex flex-col h-screen rounded-none md:h-[80vh] md:rounded-xl bg-gradient-to-b from-chat-darker to-[#1A1632] shadow-2xl overflow-hidden border border-gray-700/30 relative">
      <ChatHeader />
      
      {showWelcome && inputCentered ? (
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6">
          <WelcomeMessage />
          <div className="w-full max-w-lg mx-auto mb-6">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              centered={true}
              onTypingStart={handleTypingStart}
            />
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 px-4 py-2 overflow-auto">
            <div className="max-w-full">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
              {isLoading && (
                <div className="flex justify-start my-4">
                  <div className="flex space-x-2 p-3 bg-gray-800/80 rounded-lg">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-auto">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              centered={false}
              onTypingStart={handleTypingStart}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
