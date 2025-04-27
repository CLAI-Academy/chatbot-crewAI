import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeMessage from "./WelcomeMessage";
import SuggestionTags from "./SuggestionTags";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inputCentered, setInputCentered] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionTags = ["Finanzas", "Diagnóstico capilar"];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // API call function
  const fetchResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);

      console.log("Enviando mensaje a la API local:", userMessage);

      const response = await fetch("http://localhost:8000/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          // Include image data if available
          image: uploadedImage,
        }),
      });

      if (!response.ok) {
        console.error(
          "Error de respuesta:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Detalles del error:", errorText);
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta recibida:", data);

      if (!data || typeof data.response !== "string") {
        throw new Error("Formato de respuesta inválido");
      }

      // Clear the uploaded image after processing
      setUploadedImage(null);

      // build the AI message
      const aiMessage: MessageType = {
        id: Date.now().toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      // Add message to the conversation
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error al obtener respuesta:", error);

      // Add error message to the conversation
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content:
            "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);

      toast({
        title: "Error",
        description:
          "Error al conectar con la API. Por favor, intenta de nuevo.",
        variant: "destructive",
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
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowWelcome(false);
    setInputCentered(false); // Move the input to the bottom only when a message is sent

    // Use the localhost API instead of OpenAI
    fetchResponse(content);
  };

  const handleImageUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Store the image data as base64
      const base64Image = reader.result as string;
      setUploadedImage(base64Image);

      toast({
        title: "Imagen cargada",
        description:
          "La imagen se ha cargado y estará disponible para el próximo mensaje.",
        variant: "default",
      });
    };

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen. Intente de nuevo.",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleTagClick = (tag: string) => {
    if (tag === "Diagnóstico capilar") {
      handleSendMessage(`Cuéntame que necesito para realizar un ${tag}`);
    } else {
      handleSendMessage(`Cuéntame sobre ${tag}`);
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
            <div className="max-w-full flex flex-col">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
              {isLoading && (
                <div className="flex justify-start my-4">
                  <div className="flex space-x-2 p-3 bg-gray-800/80 rounded-lg">
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "200ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "400ms" }}
                    />
                  </div>
                </div>
              )}
              {!showWelcome && !isLoading && (
                <div className="flex flex-col items-center space-y-4 mt-4">
                  <SuggestionTags
                    tags={suggestionTags}
                    onTagClick={handleTagClick}
                  />
                  <p className="text-gray-400 text-sm">
                    ¿Quieres empezar de nuevo?{" "}
                    <button
                      className="text-chat-accent hover:underline"
                      onClick={() => {
                        setMessages([]);
                        setShowWelcome(true);
                        setInputCentered(true);
                      }}
                    >
                      Reiniciar
                    </button>
                  </p>
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
                  onClick={() => setUploadedImage(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
