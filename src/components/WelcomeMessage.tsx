
import React from 'react';
import Logo from './Logo';

type WelcomeMessageProps = {
  username?: string;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ username = "Invitado" }) => {
  return (
    <div className="flex flex-col items-center justify-center my-12 animate-fade-in">
      <div className="mb-6">
        <Logo size={70} />
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-2">
        Hola, {username}
      </h1>
      
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
        ¿En qué puedo ayudarte hoy?
      </h2>
      
      <p className="text-gray-400 text-center max-w-md mb-8">
        Estoy listo para asistirte con lo que necesites.
        Desde responder preguntas, generar contenido hasta proporcionar
        recomendaciones personalizadas. ¡Comencemos!
      </p>
    </div>
  );
};

export default WelcomeMessage;
