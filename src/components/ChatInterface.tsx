import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import AgentFlow from './AgentFlow';
import FinanceResponse from './FinanceResponse/FinanceResponse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { FinanceData } from '@/types/finance';

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
  const [isConnected, setIsConnected] = useState(false);
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null); // Use ref instead of state for WebSocket
  const { user } = useAuth();

  // URL for WebSocket
  const wsUrl = "ws://127.0.0.1:8000/ws";
  console.log("🔌 WebSocket URL configurada:", wsUrl);

  // Actualizar la referencia del modo cuando cambia agentFlowInfo
  useEffect(() => {
    modeRef.current = agentFlowInfo?.mode ?? null;
  }, [agentFlowInfo?.mode]);
  
  // Función para conectar WebSocket
  const connectWebSocket = () => {
    return new Promise<WebSocket>((resolve, reject) => {
      // Si ya hay una conexión abierta, la reutilizamos
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('✅ Reutilizando conexión WebSocket existente');
        resolve(wsRef.current);
        return;
      }
      
      console.log('🚀 Iniciando conexión WebSocket directa...');
      
      try {
        const socket = new WebSocket(wsUrl);
        
        // Evento: conexión establecida
        socket.onopen = () => {
          console.log('✅ WebSocket conexión establecida');
          wsRef.current = socket;
          setIsConnected(true);
          resolve(socket);
        };
        
        // Evento: mensaje recibido
        socket.onmessage = (event) => {
          console.log('📨 Mensaje WebSocket recibido:', event.data);
          try {
            const data = JSON.parse(event.data);
            console.log('🔄 Datos procesados:', data);
            
            if (data.connected) {
              console.log('✅ Conexión confirmada, client_id:', data.client_id);
              return;
            }
            
            if (data.status === 'pensando') {
              setIsLoading(true);
              return;
            }
            
            if (data.mode && data.agents) {
              // Actualizar información del flujo de agentes
              setAgentFlowInfo({
                mode: data.mode,
                agents: data.agents,
                currentAgent: data.actual_agent || null
              });
            }
            
            if (data.actual_agent && agentFlowInfo) {
              // Actualizar solo el agente actual
              setAgentFlowInfo(prev => prev ? {
                ...prev,
                currentAgent: data.actual_agent
              } : null);
            }
            
            if (data.status === 'completed' && data.resultado) {
              // Usar el modo que viene en el propio mensaje, no el estado
              const messageMode = data.mode || modeRef.current;
              
              // Check if the result is a JSON structure for finance response
              if (messageMode === 'finanzas') {
                try {
                  console.log('⚙️ Procesando datos financieros, modo detectado:', messageMode);
                  
                  // Parse resultado if it's a string, otherwise use as is
                  let financeResult = data.resultado;
                  
                  if (typeof financeResult === 'string') {
                    console.log('🔄 Parseando JSON desde string...');
                    // Log the first 200 characters to debug
                    console.log('📄 Primeros 200 caracteres:', financeResult.substring(0, 200));
                    
                    try {
                      financeResult = JSON.parse(financeResult);
                      console.log('✅ JSON parseado correctamente');
                    } catch (parseError) {
                      console.error('❌ Error al parsear JSON:', parseError);
                      console.log('📝 Contenido del string que falló al parsear:', financeResult.substring(0, 500) + '...');
                      
                      // Intentar recuperar partes del JSON si es posible
                      const jsonMatch = /\{[\s\S]*\}/.exec(financeResult);
                      if (jsonMatch) {
                        try {
                          financeResult = JSON.parse(jsonMatch[0]);
                          console.log('✅ JSON recuperado de fragmento');
                        } catch (e) {
                          console.error('❌ Tampoco se pudo recuperar el JSON del fragmento');
                          financeResult = null;
                        }
                      } else {
                        financeResult = null;
                      }
                    }
                  } else {
                    console.log('✅ Datos ya en formato objeto, no necesita parsing');
                  }
                  
                  console.log('📊 Objeto de datos financieros:', financeResult);
                  
                  // Crear objeto seguro con validación de cada propiedad
                  if (financeResult) {
                    const safeFinanceResult: FinanceData = {
                      escenarios: Array.isArray(financeResult.escenarios) ? financeResult.escenarios : [],
                      comparaciones: Array.isArray(financeResult.comparaciones) ? financeResult.comparaciones : [],
                      analisis_mercado: financeResult.analisis_mercado || {},
                      recomendaciones: typeof financeResult.recomendaciones === 'object' ? financeResult.recomendaciones : {},
                      preguntas_frecuentes: Array.isArray(financeResult.preguntas_frecuentes) ? financeResult.preguntas_frecuentes : [],
                      consejos_practicos: Array.isArray(financeResult.consejos_practicos) ? financeResult.consejos_practicos : []
                    };
                    
                    console.log('🔒 Datos financieros validados:', safeFinanceResult);
                    console.log('📋 Escenarios:', safeFinanceResult.escenarios.length);
                    console.log('📈 Comparaciones:', safeFinanceResult.comparaciones.length);
                    console.log('📊 Análisis de mercado:', Object.keys(safeFinanceResult.analisis_mercado).length ? 'Presente' : 'Ausente');
                    console.log('📝 Recomendaciones:', Object.keys(safeFinanceResult.recomendaciones).length);
                    console.log('❓ FAQs:', safeFinanceResult.preguntas_frecuentes.length);
                    console.log('💡 Consejos:', safeFinanceResult.consejos_practicos.length);
                    
                    // Establecer los datos financieros sin importar si escenarios está vacío o no
                    setFinanceData(safeFinanceResult);
                    
                    // Add a simple text message for the chat history
                    const aiMessage: MessageType = {
                      id: Date.now().toString(),
                      content: "He analizado tu consulta financiera. A continuación te presento diferentes escenarios y recomendaciones:",
                      sender: 'ai',
                      timestamp: new Date()
                    };
                    
                    setMessages(prev => [...prev, aiMessage]);
                    setIsLoading(false);
                    return;
                  } else {
                    console.error('❌ No se pudo procesar el objeto de datos financieros');
                    
                    const aiMessage: MessageType = {
                      id: Date.now().toString(),
                      content: "He analizado tu consulta financiera, pero tuve problemas procesando los datos. Por favor, intenta formular tu pregunta de otra manera.",
                      sender: 'ai',
                      timestamp: new Date()
                    };
                    
                    setMessages(prev => [...prev, aiMessage]);
                    setIsLoading(false);
                  }
                } catch (e) {
                  console.error('❌ Error general al procesar datos financieros:', e);
                  // If parsing fails, fallback to showing as regular message
                  const aiMessage: MessageType = {
                    id: Date.now().toString(),
                    content: "Ocurrió un error al procesar los datos financieros. Por favor, intenta de nuevo.",
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  
                  setMessages(prev => [...prev, aiMessage]);
                  setIsLoading(false);
                }
              } else {
                // Regular message handling if not finance data or parsing failed
                const aiMessage: MessageType = {
                  id: Date.now().toString(),
                  content: data.resultado,
                  sender: 'ai',
                  timestamp: new Date()
                };
                
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);
              }
            }
            
            if (data.error) {
              console.error('❌ Error en respuesta WebSocket:', data.error);
              toast({
                title: "Error",
                description: data.error,
                variant: "destructive"
              });
              setIsLoading(false);
            }
          } catch (e) {
            console.error('❌ Error procesando mensaje WebSocket:', e);
          }
        };
        
        // Evento: conexión cerrada
        socket.onclose = (event) => {
          console.log(`🔴 WebSocket desconectado. Código: ${event.code}, Razón: ${event.reason || 'No especificada'}`);
          setIsConnected(false);
          wsRef.current = null; // Clear the reference
          setIsLoading(false);
        };
        
        // Evento: error de conexión
        socket.onerror = (error) => {
          console.error('⚠️ Error en WebSocket:', error);
          toast({
            title: "Error de conexión",
            description: "No se pudo conectar al servidor. Intente de nuevo más tarde.",
            variant: "destructive"
          });
          setIsConnected(false);
          wsRef.current = null; // Clear the reference
          setIsLoading(false);
          reject(error);
        };
      } catch (err) {
        console.error('⛔ Error al crear conexión WebSocket:', err);
        toast({
          title: "Error",
          description: "No se pudo establecer la conexión WebSocket",
          variant: "destructive"
        });
        reject(err);
      }
    });
  };
  
  // Limpia agentFlowInfo cuando los datos de finanzas se han cargado completamente
  useEffect(() => {
    if (financeData) {
      // Solo limpiamos agentFlowInfo después de que los datos se han cargado completamente
      const timer = setTimeout(() => {
        setAgentFlowInfo(null);
      }, 1000); // Pequeña pausa para evitar parpadeo
      
      return () => clearTimeout(timer);
    }
  }, [financeData]);
  
  // Función para enviar mensaje por WebSocket
  const sendWebSocketMessage = async (content: string, image: string | null) => {
    try {
      const socket = await connectWebSocket();
      
      const messageData = {
        message: content,
        image: image
      };
      
      console.log('📤 Enviando mensaje por WebSocket:', messageData);
      socket.send(JSON.stringify(messageData));
      console.log('✅ Mensaje enviado correctamente');
      return true;
    } catch (err) {
      console.error('❌ Error enviando mensaje:', err);
      return false;
    }
  };
  
  // Limpiar WebSocket al desmontar componente
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        console.log('🧹 Cerrando conexión WebSocket al desmontar');
        wsRef.current.close(1000, "Componente desmontado");
        wsRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, financeData]);

  useEffect(() => {
    // Clean up uploaded image when component unmounts
    return () => {
      if (imageFilePath) {
        deleteUploadedImage(imageFilePath);
      }
    };
  }, [imageFilePath]);

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
  
  const handleSendMessage = async (content: string) => {
    console.log('📤 Iniciando envío de mensaje:', content);
    
    // Initialize WebSocket connection if this is the first message
    if (!hasInitiatedChat) {
      console.log('🚀 Primer mensaje, iniciando conexión WebSocket...');
      setHasInitiatedChat(true);
    }

    // Reset finance data when sending a new message
    if (financeData) {
      setFinanceData(null);
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
    
    // Enviar el mensaje usando la función asíncrona
    try {
      const success = await sendWebSocketMessage(content, uploadedImage);
      
      if (!success) {
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
      setIsLoading(false);
    }
    
    // Clear image URL after sending
    if (imageFilePath) {
      deleteUploadedImage(imageFilePath);
      setImageFilePath(null);
    }
    setUploadedImage(null);
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
    <div className="flex flex-col h-screen w-screen rounded-none bg-gradient-to-b from-chat-darker to-[#1A1632] shadow-2xl overflow-hidden border-0">
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
              
              {/* Display finance response when available */}
              {financeData && (
                <div className="my-4">
                  <FinanceResponse data={financeData} />
                </div>
              )}
              
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
