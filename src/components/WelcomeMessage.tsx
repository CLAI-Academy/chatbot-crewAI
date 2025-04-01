
import React from 'react';
import Logo from './Logo';

type WelcomeMessageProps = {
  username?: string;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ username = "Invitado" }) => {
  return (
    <div className="flex flex-col items-center justify-center my-20">
      <div className="mb-8">
        <Logo size={60} />
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-2">
        Hola, {username}
      </h1>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        ¿En qué puedo ayudarte hoy?
      </h2>
      
      <p className="text-gray-400 text-center max-w-lg mb-8">
        Listo para asistirte con lo que necesites.
        Desde responder preguntas, generar contenido hasta proporcionar
        recomendaciones. ¡Comencemos!
      </p>
    </div>
  );
};

export default WelcomeMessage;
