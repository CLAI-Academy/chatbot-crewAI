
import React from 'react';
import Logo from './Logo';

type WelcomeMessageProps = {
  username?: string;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ username = "Invitado" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center">
      <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
        <Logo size={80} />
      </div>
      
      <h1 className="text-xl font-medium text-gray-300 mb-3">
        Hola, {username}
      </h1>
      
      <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-chat-accent">
        ¿En qué puedo ayudarte?
      </h2>
      
      <p className="text-gray-400 text-center max-w-md mb-10 text-sm leading-relaxed">
        Estoy listo para asistirte con lo que necesites.
        Desde responder preguntas, generación de contenido
        hasta ofrecer recomendaciones. ¡Empecemos!
      </p>
    </div>
  );
};

export default WelcomeMessage;
