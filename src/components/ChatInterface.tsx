import React, { useState, useRef, useEffect, useMemo } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import AgentFlow from './AgentFlow';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import useWebSocket from '@/hooks/useWebSocket';

// Interface for agent flow information
interface AgentFlowInfo {
  mode: string;
  agents: string[];
  currentAgent: string | null;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inputCentered, setInputCentered] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFilePath, setImageFilePath] = useState<string | null>(null);
  const [agentFlowInfo, setAgentFlowInfo] = useState<AgentFlowInfo | null>(null);
  const [hasInitiatedChat, setHasInitiatedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // URL for WebSocket using useMemo to avoid recreation on each render
  const wsUrl = useMemo(() => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = 8000;
    return `${proto}://${host}:${port}/ws`;
  }, []);

  // Configure WebSocket with autoConnect set to false
  const { isConnected, lastMessage, sendMessage, error, connect } = useWebSocket({
    url: wsUrl,
    onOpen: () => {
      console.log('WebSocket connection established');
    },
    onClose: () => {
      console.log('WebSocket connection closed');
      setIsLoading(false);
    },
    onError: () => {
      toast({
        title: "Connection error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    },
    shouldReconnect: () => true, // Always try to reconnect on unexpected disconnection
    autoConnect: false // Don't connect automatically on component mount
  });
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clean up uploaded image when component unmounts
    return () => {
      if (imageFilePath) {
        deleteUploadedImage(imageFilePath);
      }
    };
  }, [imageFilePath]);

  // Process messages received from WebSocket
  useEffect(() => {
    if (!lastMessage) return;

    console.log('WebSocket message received:', lastMessage);

    if (lastMessage.status === 'pensando') {
      setIsLoading(true);
      return;
    }

    if (lastMessage.mode && lastMessage.agents) {
      // Update agent flow information
      setAgentFlowInfo({
        mode: lastMessage.mode,
        agents: lastMessage.agents,
        currentAgent: lastMessage.actual_agent || null
      });
    }

    if (lastMessage.actual_agent && agentFlowInfo) {
      // Update only the current agent
      setAgentFlowInfo(prev => prev ? {
        ...prev,
        currentAgent: lastMessage.actual_agent
      } : null);
    }

    if (lastMessage.status === 'completed' && lastMessage.resultado) {
      // Message completed, show response
      const aiMessage: MessageType = {
        id: Date.now().toString(),
        content: lastMessage.resultado,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Clear agent state when completed
      setTimeout(() => {
        setAgentFlowInfo(null);
      }, 2000);
    }

    if (lastMessage.error) {
      toast({
        title: "Error",
        description: lastMessage.error,
        variant: "destructive"
      });
      setIsLoading(false);
      setAgentFlowInfo(null);
    }
  }, [lastMessage, agentFlowInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para subir imágenes",
        variant: "destructive"
      });
      return null;
    }

    try {
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('temp_chat_images')
        .upload(filePath, file);
        
      if (error) {
        console.error('Error al subir imagen:', error);
        throw error;
      }
      
      // Obtener URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('temp_chat_images')
        .getPublicUrl(filePath);
        
      setImageFilePath(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error al procesar la subida:', error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen. Intenta de nuevo.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteUploadedImage = async (filePath: string) => {
    if (!filePath) return;
    
    try {
      const { error } = await supabase.storage
        .from('temp_chat_images')
        .remove([filePath]);
        
      if (error) {
        console.error('Error al eliminar imagen:', error);
      } else {
        console.log('Imagen eliminada con éxito:', filePath);
      }
    } catch (err) {
      console.error('Error en la eliminación de la imagen:', err);
    }
  };
  
  const handleSendMessage = (content: string) => {
    // Initialize WebSocket connection if this is the first message
    if (!hasInitiatedChat) {
      setHasInitiatedChat(true);
      connect(); // Manually connect to WebSocket
    }

    // Check WebSocket connection status before proceeding
    if (hasInitiatedChat && !isConnected) {
      toast({
        title: "Reconnecting...",
        description: "Trying to connect to the server...",
        variant: "default"
      });
      connect(); // Try to reconnect
    }

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    setInputCentered(false); // Move input to bottom only when a message is sent
    setIsLoading(true);
    
    // Send message to WebSocket server
    try {
      console.log('Preparing to send message:', {
        message: content,
        image: uploadedImage
      });
      
      sendMessage({
        message: content,
        image: uploadedImage
      });
      
      // Clear image URL after sending
      if (imageFilePath) {
        deleteUploadedImage(imageFilePath);
        setImageFilePath(null);
      }
      setUploadedImage(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    try {
      // Subir la imagen a Supabase y obtener la URL
      const imageUrl = await uploadImageToSupabase(file);
      
      if (imageUrl) {
        setUploadedImage(imageUrl);
        
        toast({
          title: "Imagen cargada",
          description: "La imagen se ha cargado y estará disponible para el próximo mensaje.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen. Intenta de nuevo.",
        variant: "destructive"
      });
    }
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
              onImageUpload={handleImageUpload}
              isLoading={isLoading} 
              centered={true}
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
              
              {/* Visualización de flujo de agentes */}
              {agentFlowInfo && (
                <div className="my-4">
                  <AgentFlow 
                    mode={agentFlowInfo.mode}
                    agents={agentFlowInfo.agents}
                    currentAgent={agentFlowInfo.currentAgent}
                  />
                </div>
              )}
              
              {isLoading && !agentFlowInfo && (
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
          
          {uploadedImage && (
            <div className="px-4 pb-2">
              <div className="relative bg-gray-800/50 rounded-lg p-2 inline-block max-w-[200px]">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="h-auto max-h-[150px] rounded object-cover"
                />
                <button 
                  className="absolute top-1 right-1 bg-gray-900/70 rounded-full p-1 text-gray-300 hover:text-white"
                  onClick={() => {
                    if (imageFilePath) {
                      deleteUploadedImage(imageFilePath);
                      setImageFilePath(null);
                    }
                    setUploadedImage(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-auto">
            <ChatInput 
              onSendMessage={handleSendMessage}
              onImageUpload={handleImageUpload}
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
