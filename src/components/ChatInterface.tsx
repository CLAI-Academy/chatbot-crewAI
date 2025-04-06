
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
  
  const fetchOpenAIStream = async (userMessage: string) => {
    try {
      setIsLoading(true);
      
      console.log("Sending message to OpenAI:", userMessage);
      
      const response = await supabase.functions.invoke('openai-chat', {
        body: { message: userMessage },
      });
      
      if (response.error) {
        console.error("Supabase function error:", response.error);
        throw new Error(`Error calling OpenAI: ${response.error.message}`);
      }
      
      if (!response.data) {
        throw new Error('No streaming data received');
      }
      
      const reader = response.data.getReader();
      const decoder = new TextDecoder("utf-8");
      
      // Create an AI message that will be updated as chunks come in
      const tempAiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: '',
        sender: 'ai',
        timestamp: new Date()
      };
      
      // Add the empty AI message
      setMessages(prev => [...prev, tempAiMessage]);
      
      // Process the stream
      let buffer = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the chunk
          const chunk = decoder.decode(value);
          buffer += chunk;
          
          // Process each line in the buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
          
          for (const line of lines) {
            // Skip empty lines
            if (line.trim() === '') continue;
            
            // Skip lines that don't start with "data: "
            if (!line.startsWith('data: ')) continue;
            
            // Extract the data
            const data = line.slice(6);
            
            // Check for the [DONE] message
            if (data.trim() === '[DONE]') continue;
            
            try {
              // Parse the JSON
              const json = JSON.parse(data);
              
              // Extract the content delta if it exists
              const contentDelta = json.choices?.[0]?.delta?.content || '';
              
              // Update the AI message with the new content
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const lastMessageIndex = updatedMessages.length - 1;
                if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].sender === 'ai') {
                  updatedMessages[lastMessageIndex] = {
                    ...updatedMessages[lastMessageIndex],
                    content: updatedMessages[lastMessageIndex].content + contentDelta
                  };
                }
                return updatedMessages;
              });
            } catch (error) {
              console.error('Error parsing JSON from stream:', error, 'Raw data:', data);
            }
          }
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error fetching OpenAI stream:', error);
      
      // Add error message
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
        description: "Error al conectar con OpenAI. Por favor, intenta de nuevo.",
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
    setInputCentered(false); // Move this here to transition only when a message is sent
    
    // Stream response from OpenAI
    fetchOpenAIStream(content);
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
            />
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 px-4 py-2">
            <>
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
            </>
          </ScrollArea>
          <div className="mt-auto">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              centered={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
