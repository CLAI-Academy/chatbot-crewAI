import React, { useState, useEffect } from "react";
import Logo from "./Logo";

type WelcomeMessageProps = {
  username?: string;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  username = "Invitado",
}) => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Bienvenido al chat de CLAI";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Speed of typing animation

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center">
      <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
        <Logo size={80} />
      </div>

      <h1 className="text-xl font-medium text-gray-300 mb-3">
        Hola, {username}
      </h1>

      <h2 className="text-4xl text-gray font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-chat-accent min-h-[48px]">
        <span className="inline-block border-r-2 border-chat-accent ">
          {typedText}
        </span>
      </h2>

      <p className="text-gray-400 text-center max-w-md mb-10 text-sm leading-relaxed">
        Estoy listo para asistirte con lo que necesites. Desde responder
        preguntas, generación de contenido hasta ofrecer recomendaciones.
        ¡Empecemos!
      </p>
    </div>
  );
};

export default WelcomeMessage;
